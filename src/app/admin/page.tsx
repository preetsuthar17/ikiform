import { redirect } from 'next/navigation';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { createClient } from '@/utils/supabase/server';

const FOUNDER_USER_ID = '2be7479a-bf3c-4951-ab71-65bb148b235c';

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.id !== FOUNDER_USER_ID) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background max-w-7xl px-4 mx-auto w-full">
      <AdminDashboard />
    </div>
  );
}
