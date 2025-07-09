"use client";
import { ProfileCard } from "@/components/dashboard/profile-card/ProfileCard";
import { FormsManagement } from "@/components/dashboard/forms-management";

export default function DashboardPage() {
  return (
    <section className="max-w-[95%] mx-auto w-full px-6">
      <div className="flex flex-col gap-8">
        <ProfileCard />
        <FormsManagement />
      </div>
    </section>
  );
}
