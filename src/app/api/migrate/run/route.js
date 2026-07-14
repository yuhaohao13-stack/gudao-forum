import pg from 'pg'

/**
 * POST /api/migrate/run
 * 一次性迁移端点：在 Supabase 数据库中执行 DDL
 * 安全：需 Bearer token 匹配 MIGRATE_SECRET 环境变量
 * 部署后调用一次即可删除此文件
 */
export async function POST(request) {
  // 安全检查
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace('Bearer ', '').trim()
  if (!token || token !== process.env.MIGRATE_SECRET) {
    return Response.json({ error: '未授权' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const ref = supabaseUrl.replace('https://', '').replace('.supabase.co', '')
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // 尝试多种连接方式（多region，多格式）
  const regions = ['ap-southeast-1', 'ap-southeast-2', 'us-east-1', 'eu-west-1', 'eu-central-1']
  const configs = []

  // Direct
  configs.push({ host: `db.${ref}.supabase.co`, port: 5432, database: 'postgres', user: 'postgres', password })

  // Pooler - 各种region + 各种user格式
  for (const region of regions) {
    for (const port of [5432, 6543]) {
      for (const user of [`postgres.${ref}`, `postgres`]) {
        configs.push({ host: `aws-0-${region}.pooler.supabase.com`, port, database: 'postgres', user, password })
        configs.push({ host: `${ref}.pooler.supabase.com`, port, database: 'postgres', user, password })
      }
    }
  }

  const results = []

  for (const config of configs) {
    try {
      const pool = new pg.Pool({ ...config, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 })
      const client = await pool.connect()

      // 执行迁移 SQL
      const sqls = [
        `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_place TEXT;`,
        `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;`, 
        `ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS device_label TEXT DEFAULT '';`,
        `ALTER TABLE chat_presence ADD COLUMN IF NOT EXISTS device_label TEXT DEFAULT '';`,
      ]

      for (const sql of sqls) {
        await client.query(sql)
        results.push({ host: config.host, sql: sql.substring(0, 60), status: 'ok' })
      }

      await client.end()
      await pool.end()

      return Response.json({ success: true, results })
    } catch (err) {
      results.push({ host: config.host, error: err.message })
    }
  }

  return Response.json({ success: false, message: '所有连接方式均失败', results })
}
