'use client';

import { MobileScreen } from '@/components/shared/MobileShell';
import { PublicLostFound } from '@/components/worker/MobileLostFound';
import { LOST_FOUND } from '@/lib/mock-data';

export default function PublicBoardPage() {
  return (
    <MobileScreen>
      <PublicLostFound items={LOST_FOUND} />
    </MobileScreen>
  );
}
