import { NextRequest, NextResponse } from 'next/server'
import { getResend } from '@/lib/resend'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, claim_id, item_name, claimant_name, claimant_email, found_location, ref_id, admin_note } = body

    if (!type || !claim_id || !item_name || !claimant_name || !claimant_email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let subject: string
    let html: string

    if (type === 'verify') {
      subject = `Your Lost Item Claim Has Been Verified — ${item_name}`
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#C8102E;">Upkeeply — Lost &amp; Found</h2>
          <p>Dear <strong>${claimant_name}</strong>,</p>
          <p>Your claim for the item <strong>${item_name}</strong> has been <strong>verified</strong>.</p>
          <h3>Pickup Details</h3>
          <ul>
            <li><strong>Item:</strong> ${item_name}</li>
            <li><strong>Found Location:</strong> ${found_location ?? 'LPU Cavite Campus'}</li>
            <li><strong>Pickup Location:</strong> PMU Office — Main Building, Ground Floor</li>
            <li><strong>Office Hours:</strong> Monday–Friday, 8:00 AM – 5:00 PM</li>
            <li><strong>Reference Number:</strong> ${ref_id}</li>
          </ul>
          <p>Please bring your <strong>LPU ID</strong> when claiming the item.</p>
          ${admin_note ? `<p><em>Note from PMU: ${admin_note}</em></p>` : ''}
          <hr/>
          <p style="color:#888;font-size:12px;">Upkeeply — LPU Cavite Campus Facility System</p>
        </div>`
    } else {
      subject = `Update on Your Lost Item Claim — ${item_name}`
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#C8102E;">Upkeeply — Lost &amp; Found</h2>
          <p>Dear <strong>${claimant_name}</strong>,</p>
          <p>Unfortunately, your claim for <strong>${item_name}</strong> could not be verified at this time.</p>
          <p><strong>Reference Number:</strong> ${ref_id}</p>
          <p>If you believe this is a mistake, please visit the <strong>PMU Office</strong> in person (Main Building, Ground Floor).</p>
          ${admin_note ? `<p><em>Note from PMU: ${admin_note}</em></p>` : ''}
          <hr/>
          <p style="color:#888;font-size:12px;">Upkeeply — LPU Cavite Campus Facility System</p>
        </div>`
    }

    await getResend().emails.send({
      from: 'noreply@upkeeply.lpuc.edu.ph',
      to: claimant_email,
      cc: 'pmu@lpuc.edu.ph',
      subject,
      html,
    })

    const supabase = await createServerSupabaseClient()
    await supabase
      .from('claims')
      .update({
        status: type === 'verify' ? 'verified' : 'rejected',
        resolved_at: new Date().toISOString(),
      })
      .eq('id', claim_id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
