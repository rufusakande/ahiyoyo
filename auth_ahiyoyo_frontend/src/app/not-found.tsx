import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";
export default function NotFound() {
    return (
        <div className="dark:bg-neutral-900 flex h-full" cz-shortcut-listen="true">
            <div className="max-w-[50rem] flex flex-col mx-auto size-full">
                <main id="content">
                    <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
                        {/* Logo */}
                        {/* Logo */}
                        <Logo />
                        {/* End Logo */}
                        {/* End Logo */}
                        <h1 className="block text-7xl font-bold text-gray-800 sm:text-9xl dark:text-white">404</h1>
                        <p className="mt-3 text-gray-600 dark:text-neutral-400">Oups, quelque chose s&rsquo;est mal passé.</p>
                        <p className="text-gray-600 dark:text-neutral-400">Désolé, nous n&rsquo;avons pas pu trouver votre page.</p>
                        <div className="mt-5 flex flex-col justify-center items-center gap-2 sm:flex-row sm:gap-3">
                            <a className="w-full sm:w-auto py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-black hover:bg-yellow-500 focus:outline-none focus:bg-primary disabled:opacity-50 disabled:pointer-events-none" href="https://ahiyoyo.com/">
                                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                Retourner à Ahiyoyo
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}