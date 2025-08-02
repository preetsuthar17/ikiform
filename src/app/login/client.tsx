'use client';

import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaGithub } from 'react-icons/fa6';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import { createClient } from '@/utils/supabase/client';

export default function LoginForm() {
  const { user } = useAuth();

  if (user) {
    redirect('/dashboard');
  }

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    toast(`Redirecting to ${provider === 'google' ? 'Google' : 'GitHub'}...`);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Card className="flex w-full max-w-sm flex-col items-center justify-center gap-6 text-center shadow-md/2">
          <CardHeader>
            <div className="flex-shrink-0">
              <Link href="/">
                <span
                  className={
                    'flex items-center justify-center gap-2 font-semibold text-3xl tracking-tight'
                  }
                >
                  <Image
                    alt="Ikiform Logo"
                    height={40}
                    src="/favicon.ico"
                    width={40}
                  />
                  <span className="text-black">Ikiform</span>
                </span>
              </Link>
            </div>
          </CardHeader>
          <Separator className="opacity-10" />
          <CardContent className="w-full">
            <Button
              className="flex w-full items-center gap-2 font-medium"
              onClick={() => handleOAuthLogin('google')}
              size="lg"
              variant="secondary"
            >
              <FcGoogle size={22} />
              Login with Google
            </Button>
            <Button
              className="flex w-full items-center gap-2 font-medium"
              onClick={() => handleOAuthLogin('github')}
              size="lg"
              variant="secondary"
            >
              <FaGithub size={22} />
              Login with GitHub
            </Button>
          </CardContent>
        </Card>
        <div className="text-center text-muted-foreground text-sm">
          <p>
            By signing up, you agree our{' '}
            <Link
              className="text-muted-foreground underline"
              href="/legal/terms"
              target="_blank"
            >
              Terms of Services
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
