import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface IStaticMethods {
  autoInit(): void
}

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods
  }
}

export const PrelineScript = () => {
  const location = useLocation()

  useEffect(() => {
    const loadPreline = async () => {
      await import('preline/preline')
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit()
      }
    }

    loadPreline()
  }, [location.pathname])

  return null
}