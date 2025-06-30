import {
  RoadmapComponent,
  type RoadmapProps,
} from "@/components/other/roadmap";

const roadmapItems: RoadmapProps[] = [
  {
    title: "core features",
    description: "essential features for form creation and management.",
    status: "inProgress",
  },
  {
    title: "creating/customizing form",
    description: "ability to create and design forms easily.",
    status: "inProgress",
  },
  {
    title: "sharing forms",
    description: "options to share forms with others.",
    status: "inProgress",
  },
  {
    title: "analytics",
    description: "view analytics and responses for forms.",
    status: "notStarted",
  },
  {
    title: "form customization",
    description: "customize forms with themes, logic, and more.",
    status: "notStarted",
  },
];

export default function Roadmap() {
  return (
    <div className="w-full max-w-fit mx-auto flex flex-col items-start justify-start text-left px-12">
      <div className="flex items-start justify-start text-left gap-2 mb-8">
        <h1 className="font-mono text-2xl font-bold tracking-tight">roadmap</h1>
      </div>
      <div className="font-mono text-left">
        <RoadmapComponent items={roadmapItems} />
      </div>
    </div>
  );
}
