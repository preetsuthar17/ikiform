import { type NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage/supabase-storage";

const ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/bmp",
	"image/svg+xml",
	"video/mp4",
	"video/mpeg",
	"video/quicktime",
	"video/x-msvideo",
	"video/webm",
	"audio/mpeg",
	"audio/wav",
	"audio/ogg",
	"audio/mp3",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	"text/plain",
	"text/csv",
	"application/json",
	"application/zip",
	"application/x-rar-compressed",
	"application/x-7z-compressed",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const formId = formData.get("formId") as string;
		const fieldId = formData.get("fieldId") as string;
		const submissionId = formData.get("submissionId") as string | null;

		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		if (!(formId && fieldId)) {
			return NextResponse.json(
				{ error: "Form ID and Field ID are required" },
				{ status: 400 }
			);
		}

		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			return NextResponse.json(
				{ error: `File type '${file.type}' is not allowed` },
				{ status: 400 }
			);
		}

		if (file.size > MAX_FILE_SIZE) {
			return NextResponse.json(
				{
					error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds limit (50MB)`,
				},
				{ status: 400 }
			);
		}

		if (
			file.name.includes("..") ||
			file.name.includes("/") ||
			file.name.includes("\\")
		) {
			return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
		}

		const result = await uploadFile(
			file,
			formId,
			fieldId,
			submissionId || undefined
		);

		return NextResponse.json({
			success: true,
			file: {
				id: result.id,
				name: file.name,
				size: file.size,
				type: file.type,
				url: result.path,
				signedUrl: result.signedUrl,
			},
		});
	} catch (error) {
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : "Upload failed" },
			{ status: 500 }
		);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const filePath = searchParams.get("path");

		if (!filePath) {
			return NextResponse.json(
				{ error: "File path is required" },
				{ status: 400 }
			);
		}

		const { deleteFile } = await import("@/lib/storage/supabase-storage");
		await deleteFile(filePath);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Delete error:", error);
		return NextResponse.json({ error: "Delete failed" }, { status: 500 });
	}
}
