import {
	CheckCircle,
	Eye,
	Globe,
	HelpCircle,
	History,
	Settings,
	Trash2,
	User,
	Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalTitle,
	ModalTrigger,
} from "@/components/ui/modal";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import type { FormSchema } from "@/lib/database";

interface PrepopulationManagerProps {
	schema: FormSchema;
	onSchemaUpdate: (schema: FormSchema) => void;
}

interface GlobalPrepopulationTemplate {
	id: string;
	name: string;
	description: string;
	config: {
		source: "url" | "api" | "profile" | "previous";
		mappings: Array<{
			fieldId: string;
			sourceKey: string;
			fallbackValue?: string;
		}>;
		apiEndpoint?: string;
		apiMethod?: "GET" | "POST";
		requireConsent?: boolean;
	};
}

export function PrepopulationManager({
	schema,
	onSchemaUpdate,
}: PrepopulationManagerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [templates, setTemplates] = useState<GlobalPrepopulationTemplate[]>([]);
	const [selectedTemplate, setSelectedTemplate] = useState<string>("");

	const fieldsWithPrepopulation =
		schema.fields?.filter((field) => field.prepopulation?.enabled) || [];
	const prepopulationSources = Array.from(
		new Set(
			fieldsWithPrepopulation.map((field) => field.prepopulation?.source),
		),
	).filter(Boolean);

	const getSourceIcon = (source: string) => {
		switch (source) {
			case "url":
				return <Globe className="size-3" />;
			case "api":
				return <Zap className="size-3" />;
			case "profile":
				return <User className="size-3" />;
			case "previous":
				return <History className="size-3" />;
			default:
				return <HelpCircle className="size-3" />;
		}
	};

	const bulkEnablePrepopulation = (
		source: "url" | "api" | "profile" | "previous",
	) => {
		if (!schema.fields) return;

		const updatedFields = schema.fields.map((field) => {
			const shouldEnable = ["text", "email", "phone", "address"].includes(
				field.type,
			);

			if (shouldEnable) {
				return {
					...field,
					prepopulation: {
						enabled: true,
						source,
						config: {
							urlParam:
								field.type === "email"
									? "email"
									: field.label.toLowerCase().replace(/\s+/g, "_"),
							fallbackValue: "",
							overwriteExisting: false,
							requireConsent: false,
						},
					},
				};
			}
			return field;
		});

		onSchemaUpdate({
			...schema,
			fields: updatedFields,
		});

		toast.success(`Enabled ${source} prepopulation for compatible fields`);
	};

	const disableAllPrepopulation = () => {
		if (!schema.fields) return;

		const updatedFields = schema.fields.map((field) => ({
			...field,
			prepopulation: field.prepopulation
				? { ...field.prepopulation, enabled: false }
				: undefined,
		}));

		onSchemaUpdate({
			...schema,
			fields: updatedFields,
		});

		toast.success("Disabled prepopulation for all fields");
	};

	const generatePreviewUrl = async () => {
		const baseUrl =
			typeof window !== "undefined"
				? window.location.origin + window.location.pathname
				: "https://yoursite.com/form/123";

		const urlFields = fieldsWithPrepopulation.filter(
			(field) =>
				field.prepopulation?.source === "url" &&
				field.prepopulation.config.urlParam,
		);

		if (urlFields.length === 0) {
			toast.error("No URL parameters configured");
			return;
		}

		const params = new URLSearchParams();
		urlFields.forEach((field) => {
			if (field.prepopulation?.config.urlParam) {
				params.set(
					field.prepopulation.config.urlParam,
					`Sample ${field.label}`,
				);
			}
		});

		const previewUrl = `${baseUrl}?${params.toString()}`;

		const { copyWithToast } = await import("@/lib/utils/clipboard");
		await copyWithToast(
			previewUrl,
			"Preview URL copied to clipboard!",
			"Failed to copy preview URL",
		);
	};

	return (
		<Modal onOpenChange={setIsOpen} open={isOpen}>
			<ModalTrigger asChild>
				<Button className="flex items-center gap-2" variant="outline">
					<Settings className="size-4" />
					Prepopulation Manager
					{fieldsWithPrepopulation.length > 0 && (
						<Badge variant="secondary">{fieldsWithPrepopulation.length}</Badge>
					)}
				</Button>
			</ModalTrigger>

			<ModalContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
				<ModalHeader>
					<ModalTitle className="flex items-center gap-2">
						<Zap className="size-5 text-primary" />
						Prepopulation Manager
					</ModalTitle>
				</ModalHeader>

				<div className="flex flex-col gap-6 p-6">
					<Card className="p-4">
						<h3 className="mb-3 font-medium">Current Prepopulation Status</h3>

						<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3">
								<CheckCircle className="size-4 text-blue-600" />
								<div>
									<div className="font-medium text-blue-900">
										{fieldsWithPrepopulation.length}
									</div>
									<div className="text-blue-700 text-sm">Fields Enabled</div>
								</div>
							</div>

							<div className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 p-3">
								<Zap className="size-4 text-green-600" />
								<div>
									<div className="font-medium text-green-900">
										{prepopulationSources.length}
									</div>
									<div className="text-green-700 text-sm">Data Sources</div>
								</div>
							</div>

							<div className="flex items-center gap-2 rounded-md border border-purple-200 bg-purple-50 p-3">
								<Settings className="size-4 text-purple-600" />
								<div>
									<div className="font-medium text-purple-900">
										{schema.fields?.length || 0}
									</div>
									<div className="text-purple-700 text-sm">Total Fields</div>
								</div>
							</div>
						</div>

						{prepopulationSources.length > 0 && (
							<div className="flex flex-col gap-2">
								<h4 className="font-medium">Active Data Sources:</h4>
								<div className="flex flex-wrap gap-2">
									{prepopulationSources.map((source) => (
										<Badge
											className="flex items-center gap-1"
											key={source}
											variant="outline"
										>
											{getSourceIcon(source!)}
											{source!.toUpperCase()}
										</Badge>
									))}
								</div>
							</div>
						)}

						{fieldsWithPrepopulation.length > 0 && (
							<div className="mt-4 flex flex-col gap-2">
								<h4 className="font-medium">Enabled Fields:</h4>
								<div className="flex flex-col gap-1">
									{fieldsWithPrepopulation.map((field) => (
										<div
											className="flex items-center justify-between rounded border p-2"
											key={field.id}
										>
											<div className="flex items-center gap-2">
												<span className="font-medium">{field.label}</span>
												<Badge
													className="flex items-center gap-1"
													variant="secondary"
												>
													{getSourceIcon(field.prepopulation!.source)}
													{field.prepopulation!.source.toUpperCase()}
												</Badge>
											</div>
											<span className="text-muted-foreground text-sm">
												{field.type}
											</span>
										</div>
									))}
								</div>
							</div>
						)}
					</Card>

					{}
					<Card className="p-4">
						<h3 className="mb-3 font-medium">Bulk Enable Prepopulation</h3>
						<p className="mb-4 text-muted-foreground text-sm">
							Quickly enable prepopulation for all compatible fields using a
							specific data source.
						</p>

						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<Button
								className="flex h-auto items-center gap-2 p-4"
								onClick={() => bulkEnablePrepopulation("url")}
								variant="outline"
							>
								<Globe className="size-5 text-blue-600" />
								<div className="text-left">
									<div className="font-medium">URL Parameters</div>
									<div className="text-muted-foreground text-sm">
										Enable for text, email, phone fields
									</div>
								</div>
							</Button>

							<Button
								className="flex h-auto items-center gap-2 p-4"
								onClick={() => bulkEnablePrepopulation("api")}
								variant="outline"
							>
								<Zap className="size-5 text-purple-600" />
								<div className="text-left">
									<div className="font-medium">External API</div>
									<div className="text-muted-foreground text-sm">
										Setup API endpoints for all fields
									</div>
								</div>
							</Button>

							<Button
								className="flex h-auto items-center gap-2 p-4"
								onClick={() => bulkEnablePrepopulation("profile")}
								variant="outline"
							>
								<User className="size-5 text-green-600" />
								<div className="text-left">
									<div className="font-medium">User Profile</div>
									<div className="text-muted-foreground text-sm">
										Map to user profile data
									</div>
								</div>
							</Button>

							<Button
								className="flex h-auto items-center gap-2 p-4"
								onClick={() => bulkEnablePrepopulation("previous")}
								variant="outline"
							>
								<History className="size-5 text-orange-600" />
								<div className="text-left">
									<div className="font-medium">Previous Submissions</div>
									<div className="text-muted-foreground text-sm">
										Reuse previous form data
									</div>
								</div>
							</Button>
						</div>

						<div className="mt-6 border-t pt-4">
							<div className="flex items-center justify-between">
								<div>
									<h4 className="font-medium">Bulk Actions</h4>
									<p className="text-muted-foreground text-sm">
										Apply actions to all prepopulation settings
									</p>
								</div>
								<div className="flex gap-2">
									{fieldsWithPrepopulation.length > 0 && (
										<Button
											className="flex items-center gap-2"
											onClick={generatePreviewUrl}
											size="sm"
											variant="outline"
										>
											<Eye className="size-4" />
											Preview URL
										</Button>
									)}
									<Button
										className="flex items-center gap-2"
										disabled={fieldsWithPrepopulation.length === 0}
										onClick={disableAllPrepopulation}
										size="sm"
										variant="destructive"
									>
										<Trash2 className="size-4" />
										Disable All
									</Button>
								</div>
							</div>
						</div>
					</Card>

					{}
					<Card className="p-4">
						<h3 className="mb-3 font-medium">Global Prepopulation Settings</h3>

						<div className="flex flex-col gap-4">
							<div className="flex items-center justify-between">
								<div>
									<Label>Enable Prepopulation Analytics</Label>
									<p className="text-muted-foreground text-sm">
										Track prepopulation success rates and performance
									</p>
								</div>
								<Switch />
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label>Cache API Responses</Label>
									<p className="text-muted-foreground text-sm">
										Improve performance by caching API data for 5 minutes
									</p>
								</div>
								<Switch defaultChecked />
							</div>

							<div className="flex items-center justify-between">
								<div>
									<Label>Privacy Mode</Label>
									<p className="text-muted-foreground text-sm">
										Require user consent for all prepopulation by default
									</p>
								</div>
								<Switch />
							</div>

							<div className="flex flex-col gap-2">
								<Label>Default Consent Message</Label>
								<Textarea
									placeholder="We'd like to pre-fill some fields with your information to save you time. Is that okay?"
									rows={2}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label>API Request Timeout (seconds)</Label>
								<Input defaultValue="10" max="30" min="5" type="number" />
							</div>
						</div>
					</Card>
				</div>
			</ModalContent>
		</Modal>
	);
}
