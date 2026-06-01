import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('alerts')
      .select('*, zones(name, building)')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, status, assigned_to } = body

    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const supabase = await createServerSupabaseClient()
    const update: Record<string, unknown> = {}
    if (status) update.status = status
    if (assigned_to) update.assigned_to = assigned_to
    if (status === 'resolved') update.resolved_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('alerts')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
