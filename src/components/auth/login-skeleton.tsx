import { Skeleton } from '@/components/ui/skeleton';

export function LoginSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <div className="rounded-xl bg-white p-6 shadow-md border space-y-6">
          {/* Title and subtitle */}
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-6 w-32" />
            <Skeleton className="mx-auto h-4 w-24" />
          </div>

          {/* Email and password fields */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Login button */}
          <Skeleton className="h-10 w-full" />

          {/* Forgot password */}
          <div className="flex justify-end">
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-muted-foreground/20" />
            <Skeleton className="h-4 w-8" />
            <div className="flex-1 h-px bg-muted-foreground/20" />
          </div>

          {/* Social login buttons */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>

          {/* Signup link */}
          <div className="text-center">
            <Skeleton className="mx-auto h-4 w-40" />
          </div>
        </div>
        {/* Terms and privacy */}
        <div className="mt-4 text-center">
          <Skeleton className="mx-auto h-3 w-48" />
        </div>
      </div>
    </div>
  );
}
