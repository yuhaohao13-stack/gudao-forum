import { createClient } from '@/lib/supabase/server'

// 管理员删除回复（软删除 is_deleted，仅 admin 可调用）
export async function POST(request) {
  try {
    const supabase = await createClient()
    const { reply_id } = await request.json()
    if (!reply_id) {
      return Response.json({ success: false, error: '缺少参数' }, { status: 400 })
    }

    // 验证登录
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ success: false, error: '未登录' }, { status: 401 })
    }

    // 验证管理员身份（仅 admin）
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return Response.json({ success: false, error: '无权限' }, { status: 403 })
    }

    // 软删除回复
    const { error } = await supabase
      .from('replies')
      .update({ is_deleted: true })
      .eq('id', reply_id)
    if (error) {
      return Response.json({ success: false, error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (e) {
    return Response.json({ success: false, error: '服务器错误' }, { status: 500 })
  }
}
