import React from 'react'
import { Link } from 'react-router-dom'

export const Logo: React.FC = () => {
  return (
    <Link 
      className="flex-none rounded-md text-xl inline-block font-semibold focus:outline-none focus:opacity-80" 
      to="/" 
      aria-label="Ahiyoyo"
    >
      <img src="/ahiyoyo.png" alt="Logo de Ahiyoyo" className="w-32 h-auto" />
    </Link>
  )
}