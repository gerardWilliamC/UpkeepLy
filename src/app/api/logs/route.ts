import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { zone_id, status, note, coverage_reason, is_coverage, lat, lng, fingerprint } = body

    if (!zone_id || !status) {
      return NextResponse.json({ error: 'zone_id and status are required' }, { status: 400 })
    }

    const validStatuses = ['ok', 'needs_attention', 'public_report']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: log, error } = await supabase
      .from('logs')
      .insert({
        zone_id,
        worker_id: user?.id ?? null,
        status,
        note: note ?? null,
        coverage_reason: coverage_reason ?? null,
        is_coverage: is_coverage ?? false,
        lat: lat ?? null,
        lng: lng ?? null,
        fingerprint: fingerprint ?? null,
      })
      .select()
      .single()

    if (error) throw error

    if (status === 'needs_attention' || status === 'public_report') {
      const severity = status === 'public_report' ? 'low' : 'med'
      await supabase.from('alerts').insert({
        log_id: log.id,
        zone_id,
        severity,
        description: note ?? `${status === 'public_report' ? 'Public report' : 'Needs attention'} logged`,
        status: 'open',
      })
    }

    return NextResponse.json({ data: log }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
