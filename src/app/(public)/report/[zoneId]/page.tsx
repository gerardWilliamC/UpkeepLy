'use client';

import { MobileScreen } from '@/components/shared/MobileShell';
import PublicReport from '@/components/public/PublicReport';
import { LOST_FOUND } from '@/lib/mock-data';

export default function PublicReportPage() {
  return (
    <MobileScreen>
      <PublicReport lfExtra={LOST_FOUND} />
    </MobileScreen>
  );
}
