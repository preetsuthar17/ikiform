import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full px-20 text-center">
      <h1 className="text-xl font-medium mb-2">Login Successful! 🥳</h1>
      <Link href="/dashboard" className="text-blue-600 underline">
        Go to Dashboard
      </Link>
    </div>
  );
}
