import React from 'react'
import { Link } from 'react-router-dom'
import { usePreline } from '../hooks/usePreline'
import { Logo } from '../components/ui/Logo'

const RegisterPage: React.FC = () => {
  usePreline()

  return (
    <div className="relative bg-gradient-to-bl from-primary via-transparent dark:from-black-950 dark:via-transparent">
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid items-center md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <p className="inline-block text-sm font-medium bg-clip-text bg-gradient-to-l from-primary text-transparent dark:from-primary dark:to-primary">
              Preline: A vision for 2024
            </p>

            <div className="mt-4 md:mb-12 max-w-2xl">
              <h1 className="mb-4 font-semibold text-gray-800 text-4xl lg:text-5xl dark:text-neutral-200">
                Fully customizable rules to match your unique needs
              </h1>
              <p className="text-gray-600 dark:text-neutral-400">
                We provide you with a test account that can be set up in seconds. Our main focus is getting responses to you as soon as we can.
              </p>
            </div>

            <blockquote className="hidden md:block relative max-w-sm">
              <svg className="absolute top-0 start-0 transform -translate-x-6 -translate-y-8 size-16 text-gray-200 dark:text-neutral-800" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M7.39762 10.3C7.39762 11.0733 7.14888 11.7 6.6514 12.18C6.15392 12.6333 5.52552 12.86 4.76621 12.86C3.84979 12.86 3.09047 12.5533 2.48825 11.94C1.91222 11.3266 1.62421 10.4467 1.62421 9.29999C1.62421 8.07332 1.96459 6.87332 2.64535 5.69999C3.35231 4.49999 4.33418 3.55332 5.59098 2.85999L6.4943 4.25999C5.81354 4.73999 5.26369 5.27332 4.84476 5.85999C4.45201 6.44666 4.19017 7.12666 4.05926 7.89999C4.29491 7.79332 4.56983 7.73999 4.88403 7.73999C5.61716 7.73999 6.21938 7.97999 6.69067 8.45999C7.16197 8.93999 7.39762 9.55333 7.39762 10.3ZM14.6242 10.3C14.6242 11.0733 14.3755 11.7 13.878 12.18C13.3805 12.6333 12.7521 12.86 11.9928 12.86C11.0764 12.86 10.3171 12.5533 9.71484 11.94C9.13881 11.3266 8.85079 10.4467 8.85079 9.29999C8.85079 8.07332 9.19117 6.87332 9.87194 5.69999C10.5789 4.49999 11.5608 3.55332 12.8176 2.85999L13.7209 4.25999C13.0401 4.73999 12.4903 5.27332 12.0713 5.85999C11.6786 6.44666 11.4168 7.12666 11.2858 7.89999C11.5215 7.79332 11.7964 7.73999 12.1106 7.73999C12.8437 7.73999 13.446 7.97999 13.9173 8.45999C14.3886 8.93999 14.6242 9.55333 14.6242 10.3Z" fill="currentColor"/>
              </svg>

              <div className="relative z-10">
                <p className="text-xl italic text-gray-800 dark:text-white">
                  Amazing people to work with. Very fast and professional partner.
                </p>
              </div>

              <footer className="mt-3">
                <div className="flex items-center gap-x-4">
                  <div className="shrink-0">
                    <img className="size-8 rounded-full" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar"/>
                  </div>
                  <div className="grow">
                    <div className="font-semibold text-gray-800 dark:text-neutral-200">Josh Grazioso</div>
                    <div className="text-xs text-gray-500 dark:text-neutral-500">Director Payments & Risk | Airbnb</div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>

          <div>
            <form>
              <div className="lg:max-w-lg lg:mx-auto lg:me-0 ms-auto">
                <div className="p-4 sm:p-7 flex flex-col bg-white rounded-2xl shadow-lg dark:bg-neutral-900">
                  <div className="text-center">
                    <Logo />
                    <h1 className="block text-2xl font-bold text-gray-800 dark:text-white">Start your free trial</h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
                      Already have an account?
                      <Link className="text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary" to="/login">
                        Sign in here
                      </Link>
                    </p>
                  </div>

                  <div className="mt-5">
                    <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                      <svg className="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                        <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"></path>
                        <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"></path>
                        <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"></path>
                        <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"></path>
                      </svg>
                      Sign up with Google
                    </button>

                    <div className="py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-700 dark:after:border-neutral-700">Or</div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <input type="text" id="hs-hero-signup-form-floating-input-first-name" className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" placeholder="John"/>
                          <label htmlFor="hs-hero-signup-form-floating-input-first-name" className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                            peer-focus:scale-90
                            peer-focus:translate-x-0.5
                            peer-focus:-translate-y-1.5
                            peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                            peer-[:not(:placeholder-shown)]:scale-90
                            peer-[:not(:placeholder-shown)]:translate-x-0.5
                            peer-[:not(:placeholder-shown)]:-translate-y-1.5
                            peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">First name</label>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <input type="text" id="hs-hero-signup-form-floating-input-last-name" className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" placeholder="Doe"/>
                          <label htmlFor="hs-hero-signup-form-floating-input-last-name" className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                            peer-focus:scale-90
                            peer-focus:translate-x-0.5
                            peer-focus:-translate-y-1.5
                            peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                            peer-[:not(:placeholder-shown)]:scale-90
                            peer-[:not(:placeholder-shown)]:translate-x-0.5
                            peer-[:not(:placeholder-shown)]:-translate-y-1.5
                            peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Last name</label>
                        </div>
                      </div>

                      <div className="col-span-full">
                        <div className="relative">
                          <input type="email" id="hs-hero-signup-form-floating-input-email" className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" placeholder="you@email.com"/>
                          <label htmlFor="hs-hero-signup-form-floating-input-email" className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                            peer-focus:scale-90
                            peer-focus:translate-x-0.5
                            peer-focus:-translate-y-1.5
                            peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                            peer-[:not(:placeholder-shown)]:scale-90
                            peer-[:not(:placeholder-shown)]:translate-x-0.5
                            peer-[:not(:placeholder-shown)]:-translate-y-1.5
                            peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Email</label>
                        </div>
                      </div>

                      <div className="relative col-span-full">
                        <div className="relative">
                          <input type="password" id="hs-hero-signup-form-floating-input-new-password" className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" placeholder="********"/>
                          <label htmlFor="hs-hero-signup-form-floating-input-new-password" className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                            peer-focus:scale-90
                            peer-focus:translate-x-0.5
                            peer-focus:-translate-y-1.5
                            peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                            peer-[:not(:placeholder-shown)]:scale-90
                            peer-[:not(:placeholder-shown)]:translate-x-0.5
                            peer-[:not(:placeholder-shown)]:-translate-y-1.5
                            peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">New password</label>
                        </div>
                      </div>

                      <div className="col-span-full">
                        <div className="relative">
                          <input type="password" id="hs-hero-signup-form-floating-input-current-password" className="peer p-4 block w-full border border-gray-300 rounded-lg text-sm placeholder:text-transparent focus:border-primary focus:ring-primary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:focus:ring-neutral-600
                          focus:pt-6
                          focus:pb-2
                          [&:not(:placeholder-shown)]:pt-6
                          [&:not(:placeholder-shown)]:pb-2
                          autofill:pt-6
                          autofill:pb-2" placeholder="********"/>
                          <label htmlFor="hs-hero-signup-form-floating-input-current-password" className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent origin-[0_0] dark:text-white peer-disabled:opacity-50 peer-disabled:pointer-events-none
                            peer-focus:scale-90
                            peer-focus:translate-x-0.5
                            peer-focus:-translate-y-1.5
                            peer-focus:text-gray-500 dark:peer-focus:text-neutral-500
                            peer-[:not(:placeholder-shown)]:scale-90
                            peer-[:not(:placeholder-shown)]:translate-x-0.5
                            peer-[:not(:placeholder-shown)]:-translate-y-1.5
                            peer-[:not(:placeholder-shown)]:text-gray-500 dark:peer-[:not(:placeholder-shown)]:text-neutral-500 dark:text-neutral-500">Current password</label>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center">
                      <div className="flex">
                        <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-0.5 border border-gray-300 rounded text-primary focus:ring-primary dark:bg-neutral-900 dark:border-neutral-700 dark:checked:bg-primary dark:checked:border-primary dark:focus:ring-offset-gray-800"/>
                      </div>
                      <div className="ms-3">
                        <label htmlFor="remember-me" className="text-sm dark:text-white">I accept the <a className="text-primary decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-primary" href="#">Terms and Conditions</a></label>
                      </div>
                    </div>

                    <div className="mt-5">
                      <button type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-primary text-white hover:bg-yellow focus:outline-none focus:bg-primary disabled:opacity-50 disabled:pointer-events-none">Get started</button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-6 md:mt-12 py-3 flex items-center text-sm text-gray-800 gap-x-1.5 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-white dark:after:border-neutral-700">
          <span className="font-semibold bg-clip-text bg-gradient-to-l from-primary to-violet-500 text-transparent dark:from-primary dark:to-violet-400">50,000</span>
          individuals and companies trust Preline
        </div>

        <div className="flex flex-wrap gap-x-6 sm:gap-x-12 lg:gap-x-24">
          <svg className="py-3 lg:py-5 w-16 h-auto md:w-20 lg:w-24 text-gray-500 dark:text-neutral-500" enableBackground="new 0 0 2499 614" viewBox="0 0 2499 614" xmlns="http://www.w3.org/2000/svg"><path d="m431.7 0h-235.5v317.8h317.8v-235.5c0-45.6-36.7-82.3-82.3-82.3zm-308.9 0h-40.5c-45.6 0-82.3 36.7-82.3 82.3v40.5h122.8zm-122.8 196.2h122.8v122.8h-122.8zm392.5 317.8h40.5c45.6 0 82.3-36.7 82.3-82.3v-39.2h-122.8zm-196.3-121.5h122.8v122.8h-122.8zm-196.2 0v40.5c0 45.6 36.7 82.3 82.3 82.3h40.5v-122.8zm828-359.6h-48.1v449.4h254.5v-43h-206.4zm360.8 119c-93.7 0-159.5 69.6-159.5 169.6v11.5c1.3 43 20.3 83.6 51.9 113.9 30.4 27.9 69.6 44.3 111.4 44.3h6.3c44.3 0 86.1-16.5 119-44.3l1.3-1.3-21.5-35.4-2.5 1.3c-26.6 24.1-59.5 38-94.9 38-58.2 0-117.7-38-121.5-122.8h243.1v-2.5s1.3-15.2 1.3-22.8c-.3-91.2-53.4-149.5-134.4-149.5zm-108.9 134.2c10.1-57 51.9-93.7 106.3-93.7 40.5 0 84.8 24.1 88.6 93.7zm521.6-96.2v16.5c-20.3-34.2-58.2-55.7-97.5-55.7h-3.8c-86.1 0-145.6 68.4-145.6 168.4 0 101.3 57 169.6 141.8 169.6 67.1 0 97.5-40.5 107.6-58.2v49.4h45.6v-447h-46.8v157zm-98.8 257c-59.5 0-98.7-50.6-98.7-126.6 0-73.4 41.8-125.3 100-125.3 49.4 0 98.7 39.2 98.7 125.3 0 93.7-51.9 126.6-100 126.6zm424.1-250.7v2.5c-8.9-15.2-36.7-48.1-103.8-48.1-84.8 0-140.5 64.6-140.5 163.3s58.2 165.8 144.3 165.8c46.8 0 78.5-16.5 100-50.6v44.3c0 62-39.2 97.5-108.9 97.5-29.1 0-59.5-7.6-86.1-21.5l-2.5-1.3-17.7 39.2 2.5 1.3c32.9 16.5 69.6 25.3 105.1 25.3 74.7 0 154.4-38 154.4-143.1v-311.3h-46.8zm-93.7 241.8c-62 0-102.5-48.1-102.5-122.8 0-76 35.4-119 96.2-119 67.1 0 98.7 39.2 98.7 119 1.3 78.5-31.6 122.8-92.4 122.8zm331.7-286.1c-93.7 0-158.2 69.6-158.2 168.4v11.4c1.3 43 20.3 83.6 51.9 113.9 30.4 27.9 69.6 44.3 111.4 44.3h6.3c44.3 0 86.1-16.5 119-44.3l1.3-1.3-22.8-35.4-2.5 1.3c-26.6 24.1-59.5 38-94.9 38-58.2 0-117.7-38-121.5-122.8h244.2v-2.5s1.3-15.2 1.3-22.8c0-89.9-53.2-148.2-135.5-148.2zm-107.6 134.2c10.1-57 51.9-93.7 106.3-93.7 40.5 0 84.8 24.1 88.6 93.7zm440.6-127.9c-6.3-1.3-11.4-1.3-17.7-2.5-44.3 0-81 27.9-100 74.7v-72.2h-46.8l1.3 320.3v2.5h48.1v-135.4c0-20.3 2.5-41.8 8.9-60.8 15.2-49.4 49.4-81 89.9-81 5.1 0 10.1 0 15.2 1.3h2.5v-46.8z" fill="currentColor"/></svg>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage