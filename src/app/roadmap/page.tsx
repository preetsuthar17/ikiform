import {
  RoadmapComponent,
  type RoadmapProps,
} from '@/components/other/roadmap';

const roadmapItems: RoadmapProps[] = [
  {
    title: 'core features',
    description: 'essential features for form creation and management.',
    status: 'completed',
  },
  {
    title: 'creating/customizing form',
    description: 'ability to create and design forms easily.',
    status: 'completed',
  },
  {
    title: 'sharing forms',
    description: 'options to share forms with others.',
    status: 'completed',
  },
  {
    title: 'analytics',
    description: 'view analytics and responses for forms.',
    status: 'completed',
  },
  {
    title: 'ai features',
    description: 'integrate AI for form creations and analytics.',
    status: 'completed',
  },
  {
    title: 'webhooks',
    description: 'set up webhooks for real-time notifications.',
    status: 'planned',
  },
  {
    title: 'form customization',
    description: 'customize forms with themes, logic, and more.',
    status: 'notStarted',
  },
  {
    title: 'integrations',
    description: 'connect with other tools and services.',
    status: 'notStarted',
  },
];

export default function Roadmap() {
  return (
    <div className="mx-auto flex w-full max-w-fit flex-col items-start justify-start px-12 text-left">
      <div className="mb-8 flex items-start justify-start gap-2 text-left">
        <h1 className="font-bold font-mono text-2xl tracking-tight">roadmap</h1>
      </div>
      <div className="text-left font-mono">
        <RoadmapComponent items={roadmapItems} />
      </div>
    </div>
  );
}
