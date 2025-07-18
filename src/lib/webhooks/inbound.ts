import { createAdminClient } from "@/utils/supabase/admin";

export interface InboundWebhookMapping {
  id: string;
  endpoint: string;
  targetFormId: string;
  mappingRules: Record<string, string>;
  secret?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

function mapInboundMappingRow(row: any): InboundWebhookMapping {
  const { created_at, updated_at, target_form_id, mapping_rules, ...rest } =
    row;
  return {
    ...rest,
    targetFormId: target_form_id,
    mappingRules: mapping_rules,
    createdAt: created_at,
    updatedAt: updated_at,
  };
}

export async function createInboundMapping(
  data: Partial<InboundWebhookMapping>,
): Promise<InboundWebhookMapping> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const insertData = {
    ...data,
    target_form_id: data.targetFormId,
    mapping_rules: data.mappingRules,
    created_at: now,
    updated_at: now,
  };
  delete insertData.targetFormId;
  delete insertData.mappingRules;
  const { data: result, error } = await supabase
    .from("inbound_webhook_mappings")
    .insert([insertData])
    .select()
    .single();
  if (error || !result)
    throw new Error(error?.message || "Failed to create inbound mapping");
  return mapInboundMappingRow(result);
}

export async function getInboundMappings({
  targetFormId,
}: { targetFormId?: string } = {}): Promise<InboundWebhookMapping[]> {
  const supabase = createAdminClient();
  let query = supabase.from("inbound_webhook_mappings").select("*");
  if (targetFormId) query = query.eq("target_form_id", targetFormId);
  query = query.order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return Array.isArray(data) ? data.map(mapInboundMappingRow) : [];
}

export async function updateInboundMapping(
  id: string,
  data: Partial<InboundWebhookMapping>,
): Promise<InboundWebhookMapping> {
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const updateData = {
    ...data,
    target_form_id: data.targetFormId,
    mapping_rules: data.mappingRules,
    updated_at: now,
  };
  delete updateData.targetFormId;
  delete updateData.mappingRules;
  const { data: result, error } = await supabase
    .from("inbound_webhook_mappings")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();
  if (error || !result)
    throw new Error(error?.message || "Failed to update inbound mapping");
  return mapInboundMappingRow(result);
}

export async function deleteInboundMapping(id: string): Promise<void> {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("inbound_webhook_mappings")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}
