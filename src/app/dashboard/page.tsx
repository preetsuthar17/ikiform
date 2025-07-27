'use client';
import { FormsManagement } from '@/components/dashboard/forms-management';
import { ProfileCard } from '@/components/dashboard/profile-card/ProfileCard';

export default function DashboardPage() {
  return (
    <section className="mx-auto w-full max-w-[95%] px-6">
      <div className="flex flex-col gap-8">
        <ProfileCard />
        <FormsManagement />
      </div>
    </section>
  );
}
