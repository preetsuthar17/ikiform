import Link from "next/link";

export default async function Success({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}) {
  const params = await searchParams;
  const checkoutId = params.checkoutId as string | undefined;

  if (!checkoutId) {
    return <div>Checkout ID not found</div>;
  }

  return (
    <div className="text-center text-muted-foreground space-y-3">
      <p>Checkout successful! ID: {checkoutId}</p>
      <Link href="/dashboard" className="text-foreground underline">
        Go to dashboard
      </Link>
    </div>
  );
}
