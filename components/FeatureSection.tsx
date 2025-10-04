import Image from "next/image";

interface FeatureSectionProps {
  title: string;
  description: string;
  lightScreenshot: string;
  darkScreenshot: string;
  reverse?: boolean;
}

export default function FeatureSection({
  title,
  description,
  lightScreenshot,
  darkScreenshot,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <div className="md:w-1/2">
        <h3 className="mb-4">{title}</h3>
        <p>{description}</p>
      </div>
      <div className="md:w-1/2">
        <Image
          src={lightScreenshot}
          alt={`${title} screenshot (light mode)`}
          width={1200}
          height={750}
          className="rounded-lg shadow-xl dark:hidden"
        />
        <Image
          src={darkScreenshot}
          alt={`${title} screenshot (dark mode)`}
          width={1200}
          height={750}
          className="rounded-lg hidden dark:block"
        />
      </div>
    </div>
  );
}