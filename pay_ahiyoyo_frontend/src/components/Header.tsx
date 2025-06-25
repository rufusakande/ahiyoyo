"use client";
import { useEffect } from "react";

export default function Hearder() {
	useEffect(() => {
		if (typeof window !== "undefined") {
			import("preline/preline");
		}
	}, []);

	return (
		<header className="sticky top-4 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full">
    <nav className="relative max-w-[66rem] w-full bg-neutral-800 rounded-[28px] py-3 ps-5 pe-2 md:flex md:items-center md:justify-between md:py-0 mx-2 lg:mx-auto" aria-label="Global">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80" href="/" aria-label="Preline">
          <img src="/ahiyoyo.png" alt="Logo de Ahiyoyo" className="w-32 h-auto" />
        </a>
        {/* End Logo */}

        <div className="md:hidden">
          <button type="button" className="hs-collapse-toggle size-8 flex justify-center items-center text-sm font-semibold rounded-full bg-neutral-800 text-white disabled:opacity-50 disabled:pointer-events-none" data-hs-collapse="#navbar-collapse" aria-controls="navbar-collapse" aria-label="Toggle navigation">
            <svg className="hs-collapse-open:hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
            <svg className="hs-collapse-open:block hidden flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Collapse */}
      <div id="navbar-collapse" className="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow md:block">
        <div className="flex flex-col gap-y-4 gap-x-0 mt-5 md:flex-row md:items-center md:justify-end md:gap-y-0 md:gap-x-7 md:mt-0 md:ps-7">
          <a className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" href="/" aria-current="page">Accueil</a>
          <a className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" href="#">Stories</a>
          <a className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" href="#">Reviews</a>
          <a className="text-sm text-white hover:text-neutral-300 md:py-4 focus:outline-none focus:text-neutral-300" href="/register">Inscription</a>

          <div>
            <a className="group inline-flex items-center gap-x-2 py-2 px-3 bg-[#fdc354] font-medium text-sm text-neutral-800 rounded-full focus:outline-none" href="/login">
              Connexion
            </a>
          </div>
        </div>
      </div>
      {/* End Collapse */}
    </nav>
  </header>
		);}