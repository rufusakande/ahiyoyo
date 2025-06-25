import React from 'react'
import { Link } from 'react-router-dom'
import { usePreline } from '../../hooks/usePreline'
import { Logo } from '../ui/Logo'
import { MobileMenuToggle } from '../ui/MobileMenuToggle'
import { NavigationMenu } from '../ui/NavigationMenu'

export const Header: React.FC = () => {
  usePreline()

  return (
    <header className="sticky top-4 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
      <nav className="relative max-w-[66rem] w-full bg-neutral-800 rounded-[28px] py-3 ps-5 pe-2 md:flex md:items-center md:justify-between md:py-0 mx-2 lg:mx-auto" aria-label="Global">
        <div className="flex items-center justify-between">
          <Logo />
          <MobileMenuToggle />
        </div>
        <NavigationMenu />
      </nav>
    </header>
  )
}