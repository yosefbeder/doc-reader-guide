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
  const imageClasses = `w-5/6 aspect-[16/10] max-md:w-full rounded-md max-md:rounded-none ${reverse ? "ml-auto" : ""}`;
  const textContainerClasses = `md:absolute md:bottom-0 ${reverse ? "md:left-0" : "md:right-0"} flex flex-col gap-2 p-4 md:w-1/2 w-full layer-2 rounded-md max-md:shadow-none max-md:rounded-none max-md:dark:bg-transparent`;

  return (
    <article className="relative max-w-screen-md w-full mx-auto md:pb-10 max-md:pb-0 max-md:layer-2 max-md:rounded-md max-md:overflow-hidden">
      {/* Light Mode Image */}
      <Image
        src={lightScreenshot}
        alt={`${title} screenshot (light mode)`}
        width={1200}
        height={750}
        className={`${imageClasses} dark:hidden`}
      />
      {/* Dark Mode Image */}
      <Image
        src={darkScreenshot}
        alt={`${title} screenshot (dark mode)`}
        width={1200}
        height={750}
        className={`${imageClasses} hidden dark:block`}
      />

      <div className={textContainerClasses}>
        <h3 className="my-0">{title}</h3>
        <p className="my-0">{description}</p>
      </div>
    </article>
  );
}