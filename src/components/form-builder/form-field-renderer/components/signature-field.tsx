"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SignatureFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

const CANVAS_HEIGHT = 120;

export function SignatureField({
	value,
	onChange,
	disabled,
}: SignatureFieldProps) {
	const t = useTranslations("product.formBuilder.fieldRenderer.signature");
	const signatureRef = useRef<SignatureCanvas>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [canvasWidth, setCanvasWidth] = useState(400);
	const [isLoading, setIsLoading] = useState(true);

	const updateCanvasWidth = () => {
		if (containerRef.current) {
			setCanvasWidth(containerRef.current.offsetWidth);
		}
	};

	useEffect(() => {
		updateCanvasWidth();
		window.addEventListener("resize", updateCanvasWidth);
		return () => window.removeEventListener("resize", updateCanvasWidth);
	}, []);

	useEffect(() => {
		if (value && signatureRef.current && signatureRef.current.isEmpty()) {
			signatureRef.current.fromDataURL(value);
		} else if (!value && signatureRef.current) {
			signatureRef.current.clear();
		}
		setIsLoading(false);
	}, [value, canvasWidth]);

	const handleSignatureEnd = () => {
		if (signatureRef.current) {
			const dataUrl = signatureRef.current
				.getTrimmedCanvas()
				.toDataURL("image/png");
			onChange(dataUrl);
		}
	};

	const handleClearSignature = () => {
		signatureRef.current?.clear();
		onChange("");
	};

	const handleEditSignature = () => {
		if (signatureRef.current) {
			signatureRef.current.clear();
			onChange("");
		}
	};

	if (isLoading) {
		return <SignatureFieldSkeleton />;
	}

	return (
		<div className="flex w-full flex-col gap-3">
			<div
				className="relative w-full overflow-hidden rounded-md border-2 border-muted border-dashed bg-background"
				ref={containerRef}
			>
				<SignatureCanvas
					canvasProps={{
						width: canvasWidth,
						height: CANVAS_HEIGHT,
						className: "block",
					}}
					onEnd={disabled ? undefined : handleSignatureEnd}
					penColor="#000000"
					ref={signatureRef}
				/>
				{!value && (
					<div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground">
						{t("drawHere")}
					</div>
				)}
			</div>
			<div className="flex gap-2">
				<Button
					disabled={disabled}
					onClick={handleClearSignature}
					size="sm"
					type="button"
					variant="outline"
				>
					{t("clear")}
				</Button>
			</div>
			{value && (
				<div className="flex flex-col gap-2">
					<span className="font-medium text-foreground text-sm">
						{t("preview")}
					</span>
					<div className="relative w-full overflow-hidden rounded-md border bg-background">
						<Image
							alt={t("previewAlt")}
							className="max-h-full max-w-full object-contain"
							height={CANVAS_HEIGHT}
							src={value}
							width={canvasWidth}
						/>
					</div>
				</div>
			)}
		</div>
	);
}

function SignatureFieldSkeleton() {
	return (
		<div className="flex w-full flex-col gap-2">
			<div className="relative w-full overflow-hidden rounded-md border-2 border-muted border-dashed bg-background">
				<Skeleton className="h-[120px] w-full" />
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center text-muted-foreground">
					<Skeleton className="size-40" />
				</div>
			</div>
			<div className="flex gap-2">
				<Skeleton className="h-8 w-16" />
				<Skeleton className="h-8 w-12" />
			</div>
		</div>
	);
}
