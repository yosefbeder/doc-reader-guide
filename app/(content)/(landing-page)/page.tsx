"use client";

import Features from "./components/Features";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import { useState } from "react";
import Testimonials from "./components/Testimonials";
import Footer from "@/components/Footer";
import Stats from "./components/Stats";
import Sponsership from "./components/Sponsership";
import UniversityRequest from "./components/UniversityRequest";

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <>
      <Nav lang={lang} toggleLanguage={toggleLanguage} />
      <Hero lang={lang} />
      <Stats lang={lang} />
      <Features lang={lang} />
      <Testimonials lang={lang} />
      <Sponsership lang={lang} />
      <UniversityRequest lang={lang} />
      <Footer lang={lang} isLandingPage />
    </>
  );
}
