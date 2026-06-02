import { NextRequest, NextResponse } from 'next/server'
import { generateQRDataURL } from '@/lib/qr'

export async function GET(req: NextRequest) {
  const hash = req.nextUrl.searchParams.get('hash')
  if (!hash) return NextResponse.json({ error: 'hash required' }, { status: 400 })

  try {
    const dataUrl = await generateQRDataURL(hash)
    return NextResponse.json({ dataUrl })
  } catch {
    return NextResponse.json({ error: 'Failed to generate QR' }, { status: 500 })
  }
}
