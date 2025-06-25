"use client";

import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import Clients from "@/components/home/Clients";
import Testimonials from "@/components/Testimonials";
import Stats from "@/components/home/Stats";
import Approach from "@/components/home/Approach";
import Contact from "@/components/home/Contact";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
    }
  }, []);

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
  );
}
