export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <div className="text-2xl font-semibold text-destructive">
        Authentication Error
      </div>
      <div className="text-muted-foreground text-center max-w-md">
        There was an error during the authentication process. Please try signing
        in again.
      </div>
      <a
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-ele hover:bg-primary/90 transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}
