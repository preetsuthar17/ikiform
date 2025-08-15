'use client';

import { Gift, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader } from '@/components/ui';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

export default function RedeemClient() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !user && !authLoading) {
      sessionStorage.setItem('redirectAfterLogin', '/redeem');
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center px-4">
        <Card className="flex w-full max-w-md flex-col gap-6">
          <CardHeader className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to redeem codes. Please login and come
              back.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild className="w-full">
              <Link href="/login">Login to Continue</Link>
            </Button>
            <Button asChild className="w-full" variant="outline">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Please enter a redemption code' });
      return;
    }

    setIsRedeeming(true);
    setMessage(null);

    try {
      const response = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: result.message || 'Code redeemed successfully!',
        });
        setCode('');
      } else {
        setMessage({
          type: 'error',
          text: result.message || 'Failed to redeem code',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="flex w-full max-w-md flex-col gap-6">
        <CardHeader className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Gift className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Redeem Code</CardTitle>
          <CardDescription>
            Enter your redemption code below to claim your reward.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form className="flex flex-col gap-4" onSubmit={handleRedeem}>
            <div className="flex flex-col gap-2">
              <label className="font-medium text-sm" htmlFor="code">
                Redemption Code
              </label>
              <Input
                className="uppercase"
                disabled={isRedeeming}
                id="code"
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter your code here"
                type="text"
                value={code}
              />
            </div>

            {message && (
              <Alert
                dismissible
                onDismiss={() => setMessage(null)}
                variant={message.type === 'error' ? 'destructive' : 'success'}
              >
                {message.text}
              </Alert>
            )}

            <div className="flex w-full flex-col justify-center gap-2">
              <Button
                className="w-full"
                disabled={isRedeeming || !code.trim()}
                loading={isRedeeming}
                type="submit"
              >
                {!isRedeeming && 'Redeem Code'}
              </Button>
              <Button asChild className="w-full" variant="ghost">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
