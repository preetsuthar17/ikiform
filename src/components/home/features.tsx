const features = [
  {
    name: "AI Form Builder",
    description:
      "Generate forms instantly using AI. Just describe your needs and let our AI build your form in seconds.",
    video: "/features-demo/ai-form-builder-demo.mp4",
    bg: "/features-demo/features-bg/01.png",
    id: "ai-builder-feature",
  },
  {
    name: "Intuitive Form Builder",
    description:
      "Drag and drop to create beautiful forms. Customize fields, layout, and design with ease.",
    video: "/features-demo/form-builder-demo.mp4",
    bg: "/features-demo/features-bg/02.png",
    id: "intuitive-form-builder-feature",
  },
  {
    name: "AI-Powered Analytics",
    description:
      "Get instant insights and analytics powered by AI. Visualize responses and trends effortlessly.",
    video: "/features-demo/ai-powered-analytics-demo.mp4",
    bg: "/features-demo/features-bg/03.png",
    id: "ai-powered-analytics-feature",
  },
];

export default function Features() {
  return (
    <section className="flex flex-col items-center justify-center gap-12 md:py-28 py-12 md:px-8 px-4 text-center w-full">
      <div className="max-w-7xl w-full mx-auto flex flex-col gap-18">
        {features.map((feature, idx) => (
          <div
            key={feature.name}
            id={feature.id}
            className={`flex flex-col items-center overflow-hidden p-0 gap-8`}
          >
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 backdrop-blur-sm w-full">
              <h3 className="text-3xl md:text-4xl font-semibold">
                {feature.name}
              </h3>
              <p className="text-md text-muted-foreground">
                {feature.description}
              </p>
            </div>
            <div
              className={`w-full aspect-video md:p-12 p-4 flex items-center justify-center rounded-card overflow-hidden  bg-gradient-to-b`}
              style={{
                backgroundImage: `url(${feature.bg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
              }}
            >
              <video
                src={feature.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-card"
                style={{ position: "relative", zIndex: 1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
