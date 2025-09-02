import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface InboundWebhookMapping {
  id: string;
  endpoint: string;
  targetFormId: string;
  mappingRules: Record<string, string>;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useInboundWebhookManagement() {
  const [mappings, setMappings] = useState<InboundWebhookMapping[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMappings() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/webhook/inbound");
      if (!res.ok) throw new Error("Failed to fetch inbound webhooks");
      const data = await res.json();
      setMappings(data);
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Failed to fetch inbound webhooks");
    } finally {
      setLoading(false);
    }
  }

  async function createMapping(mapping: Partial<InboundWebhookMapping>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/webhook/inbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapping),
      });
      if (!res.ok) throw new Error("Failed to create inbound webhook");
      toast.success("Inbound webhook created!");
      await fetchMappings();
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Failed to create inbound webhook");
    } finally {
      setLoading(false);
    }
  }

  async function updateMapping(
    id: string,
    mapping: Partial<InboundWebhookMapping>
  ) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/webhook/inbound/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapping),
      });
      if (!res.ok) throw new Error("Failed to update inbound webhook");
      toast.success("Inbound webhook updated!");
      await fetchMappings();
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Failed to update inbound webhook");
    } finally {
      setLoading(false);
    }
  }

  async function deleteMapping(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/webhook/inbound/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete inbound webhook");
      toast.success("Inbound webhook deleted!");
      await fetchMappings();
    } catch (e: any) {
      setError(e.message);
      toast.error(e.message || "Failed to delete inbound webhook");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMappings();
  }, []);

  return {
    mappings,
    loading,
    error,
    fetchMappings,
    createMapping,
    updateMapping,
    deleteMapping,
  };
}
