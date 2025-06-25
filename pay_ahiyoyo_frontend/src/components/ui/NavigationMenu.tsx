import React from 'react'
import { Link } from 'react-router-dom'

export const NavigationMenu: React.FC = () => {
  return (
    <div id="navbar-collapse" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block">
      <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:items-center md:justify-end md:gap-y-0 md:gap-x-7 md:mt-0 md:ps-7">
        <Link className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" to="/" aria-current="page">
          Accueil
        </Link>
        <Link className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" to="#">
          Stories
        </Link>
        <Link className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" to="#">
          Reviews
        </Link>
        <Link className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" to="/register">
          Inscription
        </Link>
        <div>
          <Link className="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#fdc354] font-medium text-sm text-neutral-800 rounded-full focus:outline-none" to="/login">
            Connexion
          </Link>
        </div>
      </div>
    </div>
  )
}