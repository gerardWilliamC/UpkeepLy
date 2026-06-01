import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { zone_id, item_name, category, description, current_location, fingerprint } = body

    if (!item_name || !category) {
      return NextResponse.json({ error: 'item_name and category are required' }, { status: 400 })
    }

    // Cash and bare keys never go on the public board
    const is_public = !(category === 'cash' || (category === 'keys' && !description?.trim()))

    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('found_items')
      .insert({
        zone_id: zone_id ?? null,
        logged_by: user?.id ?? null,
        item_name,
        category,
        description: description ?? null,
        current_location: current_location ?? null,
        is_public,
        fingerprint: fingerprint ?? null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
