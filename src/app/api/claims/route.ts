import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { found_item_id, claimant_name, claimant_email, description } = body

    if (!found_item_id || !claimant_name || !claimant_email || !description) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const lpuEmailRegex = /^[^\s@]+@lpuc\.edu\.ph$/i
    if (!lpuEmailRegex.test(claimant_email)) {
      return NextResponse.json(
        { error: 'Must use an LPU Cavite school email (@lpuc.edu.ph)' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    const { data, error } = await supabase
      .from('claims')
      .insert({ found_item_id, claimant_name, claimant_email, description })
      .select()
      .single()

    if (error) throw error

    await supabase.from('found_items').update({ status: 'pending' }).eq('id', found_item_id)

    return NextResponse.json({ data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
