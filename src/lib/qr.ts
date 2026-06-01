import crypto from 'crypto'
import QRCode from 'qrcode'

export function generateQRHash(zoneId: string): string {
  return crypto
    .createHash('sha256')
    .update(`upkeeply:zone:${zoneId}`)
    .digest('hex')
    .slice(0, 32)
}

export async function generateQRDataURL(hash: string): Promise<string> {
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/scan/${hash}`
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: { dark: '#07080F', light: '#FFFFFF' },
  })
}

export function parseQRHash(hash: string): string | null {
  if (!hash || !/^[a-f0-9]{32}$/.test(hash)) return null
  return hash
}
