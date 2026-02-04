"use client";

import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import EnrolledUniversities from "./components/EnrolledUniversities";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const Features = dynamic(() => import("./components/Features"));
const Testimonials = dynamic(() => import("./components/Testimonials"));
const Sponsership = dynamic(() => import("./components/Sponsership"));
const UniversityRequest = dynamic(
  () => import("./components/UniversityRequest")
);

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LandingPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const router = useRouter();

  // For pwa offline redirection
  useEffect(() => {
    if (!Cookies.get("guest")) {
      router.replace("/app");
    }
  }, []);

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
      <EnrolledUniversities lang={lang} />
      <Stats lang={lang} />
      <Features lang={lang} />
      <Testimonials lang={lang} />
      <Sponsership lang={lang} />
      <UniversityRequest lang={lang} />
      <Footer lang={lang} />
    </>
  );
}
