import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/database.types";
import { createAdminClient } from "@/utils/supabase/admin";

type InboundWebhookMappingRow =
	Database["public"]["Tables"]["inbound_webhook_mappings"]["Row"];
type InboundWebhookMappingInsert =
	Database["public"]["Tables"]["inbound_webhook_mappings"]["Insert"];
type InboundWebhookMappingUpdate =
	Database["public"]["Tables"]["inbound_webhook_mappings"]["Update"];

export interface InboundWebhookMapping {
	id: string;
	endpoint: string;
	targetFormId: string;
	mappingRules: Record<string, string>;
	secret?: string | null;
	enabled: boolean;
	createdAt: string;
	updatedAt: string;
}

function mapInboundMappingRow(
	row: InboundWebhookMappingRow
): InboundWebhookMapping {
	const { created_at, updated_at, target_form_id, mapping_rules, ...rest } =
		row;
	return {
		...rest,
		targetFormId: target_form_id,
		mappingRules: mapping_rules as Record<string, string>,
		createdAt: created_at,
		updatedAt: updated_at,
	};
}

export async function createInboundMapping(
	data: Partial<InboundWebhookMapping>
): Promise<InboundWebhookMapping> {
	const supabase = createAdminClient() as SupabaseClient<Database>;
	const now = new Date().toISOString();

	if (!(data.endpoint && data.targetFormId)) {
		throw new Error("endpoint and targetFormId are required");
	}

	const insertData: InboundWebhookMappingInsert = {
		endpoint: data.endpoint,
		target_form_id: data.targetFormId,
		mapping_rules: data.mappingRules || {},
		secret: data.secret || null,
		enabled: data.enabled ?? true,
		created_at: now,
		updated_at: now,
	};

	const { data: result, error } = await supabase
		.from("inbound_webhook_mappings")
		.insert([insertData] as any)
		.select()
		.single();
	if (error || !result)
		throw new Error(error?.message || "Failed to create inbound mapping");
	return mapInboundMappingRow(result);
}

export async function getInboundMappings({
	targetFormId,
}: {
	targetFormId?: string;
} = {}): Promise<InboundWebhookMapping[]> {
	const supabase = createAdminClient() as SupabaseClient<Database>;
	let query = supabase.from("inbound_webhook_mappings").select("*");
	if (targetFormId) query = query.eq("target_form_id", targetFormId);
	query = query.order("created_at", { ascending: false });
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return Array.isArray(data) ? data.map(mapInboundMappingRow) : [];
}

export async function updateInboundMapping(
	id: string,
	data: Partial<InboundWebhookMapping>
): Promise<InboundWebhookMapping> {
	const supabase = createAdminClient() as SupabaseClient<Database>;
	const now = new Date().toISOString();

	const updateData: InboundWebhookMappingUpdate = {
		endpoint: data.endpoint,
		target_form_id: data.targetFormId,
		mapping_rules: data.mappingRules,
		secret: data.secret || null,
		enabled: data.enabled,
		updated_at: now,
	};

	const { data: result, error } = await (
		supabase.from("inbound_webhook_mappings") as any
	)
		.update(updateData)
		.eq("id", id)
		.select()
		.single();
	if (error || !result)
		throw new Error(error?.message || "Failed to update inbound mapping");
	return mapInboundMappingRow(result);
}

export async function deleteInboundMapping(id: string): Promise<void> {
	const supabase = createAdminClient() as SupabaseClient<Database>;
	const { error } = await supabase
		.from("inbound_webhook_mappings")
		.delete()
		.eq("id", id);
	if (error) throw new Error(error.message);
}
