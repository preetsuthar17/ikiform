import Link from "next/link";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-20 text-center">
      <h1 className="text-xl font-medium mb-2">Something went wrong! 😢</h1>
      <Link href="/" className="text-blue-600 underline">
        Return Home
      </Link>
    </div>
  );
}
