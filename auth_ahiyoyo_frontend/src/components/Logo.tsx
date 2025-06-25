// components/Logo.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Logo() {
  return (
    <Link href="/" aria-label="Preline">
      <Image
        src="/ahiyoyo_lg.png"
        alt="Logo de Ahiyoyo"
        width={128}
        height={40}
        className="mx-auto"
      />
    </Link>
  )
}
