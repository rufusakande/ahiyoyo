"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("preline/preline");
    }
  }, []);

  return (
      <div className="max-w-5xl mx-auto px-4 xl:px-0 pt-24 lg:pt-32 pb-24">
        <div className="grid lg:grid-cols-7 lg:gap-x-8 xl:gap-x-12 lg:items-center">
          <div className="lg:col-span-3">
            <h2 className="block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">Rechargez votre compte <span className="text-primary">Alipay</span> en toute simplicité
            </h2>
            <p className="mt-3 text-lg text-neutral-800 dark:text-neutral-400">Transférez de l&rsquo;argent instantanément via Mobile Money vers votre compte Alipay</p>
            <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <Link className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-black hover:bg-yellow-500 focus:outline-none focus:bg-primary disabled:opacity-50 disabled:pointer-events-none" href="/login" target="_parent">
              Commencer
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"></path></svg>
                </Link>
              <Link className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800" href="/#contact" target="_parent">
              Contactez l&rsquo;équipe commerciale
              </Link>
            </div>
          </div>
          <div className="lg:col-span-4 mt-10 lg:mt-0">
            <Image  className="w-full rounded-xl" src="https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1973&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Hero Image" />
          </div>
        </div>
      </div>
  );
}