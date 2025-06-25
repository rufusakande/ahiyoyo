import { useEffect } from 'react'

export const usePreline = () => {
  useEffect(() => {
    const loadPreline = async () => {
      if (typeof window !== 'undefined') {
        await import('preline/preline')
        if (window.HSStaticMethods) {
          window.HSStaticMethods.autoInit()
        }
      }
    }

    loadPreline()
  }, [])
}