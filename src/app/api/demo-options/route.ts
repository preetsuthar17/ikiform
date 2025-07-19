import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Example: switch format by query param
  const format = new URL(req.url).searchParams.get("format") || "array";

  if (format === "array") {
    // Array of strings
    return NextResponse.json(["Apple", "Banana", "Cherry"]);
  }

  if (format === "object-array") {
    // Array of objects
    return NextResponse.json([
      { value: "apple", label: "Apple" },
      { value: "banana", label: "Banana" },
      { value: "cherry", label: "Cherry" },
    ]);
  }
  if (format === "object") {
    // Object with options array
    return NextResponse.json({
      options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
      ],
    });
  }
  // Default fallback
  return NextResponse.json(["Apple", "Banana", "Cherry"]);
}
