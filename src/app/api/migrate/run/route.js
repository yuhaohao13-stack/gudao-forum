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
  const region = 'ap-southeast-1'
  const password = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // 尝试多种连接方式
  const configs = [
    // Direct (from Vercel cloud, may have IPv6)
    { host: `db.${ref}.supabase.co`, port: 5432, database: 'postgres', user: 'postgres', password },
    // Pooler session mode
    { host: `aws-0-${region}.pooler.supabase.com`, port: 5432, database: 'postgres', user: `postgres.${ref}`, password },
    // Pooler transaction mode
    { host: `aws-0-${region}.pooler.supabase.com`, port: 6543, database: 'postgres', user: `postgres.${ref}`, password },
  ]

  const results = []

  for (const config of configs) {
    try {
      const pool = new pg.Pool({ ...config, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 })
      const client = await pool.connect()

      // 执行迁移 SQL
      const sqls = [
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
