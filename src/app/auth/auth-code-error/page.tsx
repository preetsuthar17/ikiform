export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <div className="font-semibold text-2xl text-destructive">
        Authentication Error
      </div>
      <div className="max-w-md text-center text-muted-foreground">
        There was an error during the authentication process. Please try signing
        in again.
      </div>
      <a
        className="rounded-ele bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        href="/"
      >
        Return Home
      </a>
    </div>
  );
}
