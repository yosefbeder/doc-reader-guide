import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import Button from "@/components/Button";
import FeatureSection from "@/components/FeatureSection";

const features = [
  {
    title: "Advanced MCQ Practice",
    description: "Master your knowledge with over 38,500+ MCQs. Our quizzes support diagrams and detailed explanations to deepen your understanding.",
    lightScreenshot: "https://i.ibb.co/HD4JbTFV/mcq-questions-light.png",
    darkScreenshot: "https://i.ibb.co/JRZLtVHM/mcq-questions-dark.png",
  },
  {
    title: "Image Occlusion for Written Questions",
    description: "Practice anatomy and histology with image occlusion questions. A powerful tool to test your visual memory.",
    lightScreenshot: "https://i.ibb.co/M5pFkKfw/written-questions-light.png",
    darkScreenshot: "https://i.ibb.co/G31yDxXz/written-questions-dark.png",
  },
    {
    title: "Centralized Resource Hub",
    description: "Access all your study materials—official college notes, external lectures, and doctor's focus points—all tailored to your university's curriculum.",
    lightScreenshot: "https://i.ibb.co/GBwtsY9/lecture-sources-and-notes-light.png",
    darkScreenshot: "https://i.ibb.co/jvGSK0nz/lecture-sources-and-notes-dark.png",
  },
  {
    title: "Powerful Lecture Search",
    description: "Instantly find any lecture by its title, ensuring you never lose track of your study materials.",
    lightScreenshot: "https://i.ibb.co/5hksff3G/lecture-by-title-light.png",
    darkScreenshot: "https://i.ibb.co/S7ysvBQ6/lecture-by-title-dark.png",
  },
  {
    title: "Filter by Date",
    description: "Easily narrow down your search by date to find the exact lecture you need for your study session.",
    lightScreenshot: "https://i.ibb.co/wNNbpKMW/lecture-by-date-light.png",
    darkScreenshot: "https://i.ibb.co/Qvnk6HPp/lecture-by-date-dark.png",
  },
  {
    title: "Customize Your Experience",
    description: "Tailor the platform to your needs with customizable settings for a personalized study environment.",
    lightScreenshot: "https://i.ibb.co/xtmg5YK4/settings-light.png",
    darkScreenshot: "https://i.ibb.co/B2sV8ssS/settings-dark.png",
  },
];

export default function LandingPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="text-center py-20 bg-slate-50 dark:bg-slate-800">
        <div className="main">
            <div className="flex justify-center items-center mb-4">
                <Image src={Logo} width={128} alt="DocReader Guide Logo" />
            </div>
            <h1 className="h1">The Ultimate Study Companion for Medical Students</h1>
            <p className="mt-4">Organize, Practice, and Ace Your Medical Exams with DocReader Guide.</p>
            <Link href="/api/auth/login">
              <Button color="cyan" className="mt-8 font-bold py-3 px-6 rounded-lg text-lg">
                Get Started Now (Free Sign-Up)
              </Button>
            </Link>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="main text-center">
          <h2>Overwhelmed by Medical School?</h2>
          <p className="mt-4">
            Scattered resources, endless notes, and inefficient practice methods make studying a chore. DocReader Guide brings structure to your studies, providing an all-in-one solution to keep you organized and on track.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="main">
          <h2 className="text-center mb-16">Powerful Features to Enhance Your Learning</h2>
          <div className="flex flex-col gap-16">
            {features.map((feature, index) => (
              <FeatureSection key={feature.title} {...feature} reverse={index % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Numbers */}
      <section className="py-20">
        <div className="main text-center">
          <h2>Trusted by Thousands of Future Doctors</h2>
          <div className="flex justify-around mt-8">
            <div>
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">2,500+</p>
              <p>Students Using Our Platform</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">14,400+</p>
              <p>Shared Study Resources</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">38,500+</p>
              <p>Practice Questions Available</p>
            </div>
             <div>
              <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400">80+</p>
              <p>MCQs Inserted Daily via AI Pipeline</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-cyan-600 text-white text-center">
        <div className="main">
            <h2 className="text-4xl font-bold">Stop Wasting Time, Start Mastering Medicine.</h2>
            <Link href="/api/auth/login">
                <Button color="white" className="mt-8 font-bold py-3 px-6 rounded-lg text-lg">
                    Join DocReader Guide Today!
                </Button>
            </Link>
        </div>
      </section>
    </main>
  );
}