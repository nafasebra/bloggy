'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditUserPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/user/me?edit=1');
  }, [router]);

  return null;
}
