import Link from "next/link";
import Script from "next/script";

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
    <>
      <Script id="google-ads-conversion" strategy="afterInteractive">
        {`
          gtag('event', 'conversion', {
              'send_to': 'AW-16554309213/GGsACJHg9KwZEN3s2tU9',
              'value': 1.0,
              'currency': 'USD',
              'transaction_id': '${checkoutId || ""}'
          });
        `}
      </Script>
      <div className="flex flex-col gap-3 text-center text-muted-foreground">
        <p>Checkout successful! ID: {checkoutId}</p>
        <Link className="text-foreground underline" href="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </>
  );
}
