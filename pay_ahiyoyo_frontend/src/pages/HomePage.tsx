import React from 'react'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Hero } from '../components/home/Hero'
import { Clients } from '../components/home/Clients'
import { Testimonials } from '../components/home/Testimonials'
import { Stats } from '../components/home/Stats'
import { Approach } from '../components/home/Approach'
import { Contact } from '../components/home/Contact'

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Clients />
      <Testimonials />
      <Stats />
      <Approach />
      <Contact />
      <Footer />
    </>
  )
}

export default HomePage