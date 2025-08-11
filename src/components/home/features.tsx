import { OptimizedImage } from "../other/optimized-image";

const features = [
  {
    name: "AI Form Builder",
    description:
      "Generate forms instantly using AI. Just describe your needs and let our AI build your form in seconds.",
    video:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXign9LzlJhGEK7MOW2HtS8VrgBIdbz6GCRw3QsY1",
    bg: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignPZD9G8W5N7VbwqPstFU0fyT6Hxu3QEav8ckM",
    id: "ai-builder-feature",
  },
  {
    name: "Intuitive Form Builder",
    description:
      "Drag and drop to create beautiful forms. Customize fields, layout, and design with ease.",
    video:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignHpXfl2SkSqKmkIdQ5AiYXwezrn1sLTg2DCWc",
    bg: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignSP3QW1Hngdl5e9VoXjF4Dcsz3U6nhiRQCNx1",
    id: "intuitive-form-builder-feature",
  },
  {
    name: "AI-Powered Analytics",
    description:
      "Get instant insights and analytics powered by AI. Visualize responses and trends effortlessly.",
    video:
      "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignsNKhM5BuCRZ4q0fNIjAHEtS8p6bOXBvLzrKa",
    bg: "https://av5on64jc4.ufs.sh/f/jYAIyA6pXignRgOlE1vEfXweUJ69CKsLboN1IaMcAjVlh0nH",
    id: "ai-powered-analytics-feature",
  },
];

export default function Features() {
  return (
    <section className="flex w-full flex-col items-center justify-center gap-12 px-4 py-12 text-center md:px-8 md:py-28">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-18">
        {features.map((feature, idx) => (
          <div
            className={"flex flex-col items-center gap-8 overflow-hidden p-0"}
            id={feature.id}
            key={feature.name}
          >
            <div className="flex w-full flex-col items-center justify-center gap-3 px-6 py-8 backdrop-blur-sm">
              <h2 className="font-semibold text-3xl md:text-4xl">
                {feature.name}
              </h2>
              <p className="text-md text-muted-foreground">
                {feature.description}
              </p>
            </div>
            <div
              className={
                "flex aspect-video w-full items-center justify-center overflow-hidden rounded-card bg-gradient-to-b p-4 md:p-12 shadow-[inset_0px_-24px_66px_-11px_hsl(var(--hu-home-card-bg),0.1)]"
              }
              style={{
                position: "relative",
              }}
            >
              <video
                autoPlay
                className="relative z-10 h-full w-full rounded-card object-cover"
                loop
                muted
                playsInline
                src={feature.video}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
