import { useState } from "react";
import { InboundWebhookFormModal } from "./InboundWebhookFormModal";
import {
  useInboundWebhookManagement,
  InboundWebhookMapping,
} from "./hooks/useInboundWebhookManagement";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

function InboundWebhookDocsDrawer({
  mapping,
  open,
  onClose,
}: {
  mapping: InboundWebhookMapping | null;
  open: boolean;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  if (!open || !mapping) return null;
  const samplePayload = Object.keys(mapping.mappingRules).reduce(
    (acc, ext) => {
      acc[ext] = `example_${ext}`;
      return acc;
    },
    {} as Record<string, string>,
  );
  function handleCopy(text: string, type: string) {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 1200);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black bg-opacity-40">
      <Card className="bg-white rounded-t-lg md:rounded-lg shadow-lg w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </Button>
        <h3 className="text-xl font-bold mb-4">
          Inbound Webhook Documentation
        </h3>
        <div className="mb-2">
          <b>Endpoint:</b>
          <div className="flex items-center gap-2">
            <Input
              className="bg-gray-100 cursor-not-allowed text-xs mt-1 flex-1"
              value={mapping.endpoint}
              readOnly
              disabled
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleCopy(mapping.endpoint, "endpoint")}
            >
              {copied === "endpoint" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <b>Sample Payload:</b>
          <div className="flex items-center gap-2">
            <pre className="bg-gray-100 rounded p-2 text-xs mt-1 flex-1">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                handleCopy(JSON.stringify(samplePayload, null, 2), "payload")
              }
            >
              {copied === "payload" ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <b>Security:</b>
          <ul className="list-disc ml-6 text-xs">
            <li>Use a secret or token for authentication if enabled.</li>
            <li>Requests without valid authentication will be rejected.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}

export function InboundWebhookList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMapping, setEditingMapping] =
    useState<InboundWebhookMapping | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const [docsMapping, setDocsMapping] = useState<InboundWebhookMapping | null>(
    null,
  );
  const {
    mappings,
    loading,
    createMapping,
    updateMapping,
    deleteMapping,
    fetchMappings,
  } = useInboundWebhookManagement();

  function handleAdd() {
    setEditingMapping(null);
    setModalOpen(true);
  }

  async function handleSave(mapping: Partial<InboundWebhookMapping>) {
    if (editingMapping) {
      await updateMapping(editingMapping.id, mapping);
    } else {
      await createMapping(mapping);
    }
    setModalOpen(false);
    setEditingMapping(null);
    fetchMappings();
  }

  function handleEdit(mapping: InboundWebhookMapping) {
    setEditingMapping(mapping);
    setModalOpen(true);
  }

  async function handleDelete(id: string) {
    await deleteMapping(id);
    fetchMappings();
  }

  function handleViewDocs(mapping: InboundWebhookMapping) {
    setDocsMapping(mapping);
    setDocsOpen(true);
  }

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inbound Webhooks</h2>
        <Button variant="default" onClick={handleAdd} disabled={loading}>
          {loading ? "Loading..." : "Add Inbound Webhook"}
        </Button>
      </header>
      {loading ? (
        <div className="text-center py-8">Loading inbound webhooks...</div>
      ) : !mappings.length ? (
        <div className="text-center py-8 text-gray-500">
          No inbound webhooks found.
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <ul className="space-y-4">
            {mappings.map((webhook) => (
              <Card
                key={webhook.id}
                className="rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="font-mono text-sm text-gray-700 break-all">
                    {webhook.endpoint}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Target Form:{" "}
                    <span className="font-semibold">
                      {webhook.targetFormId}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Mapping:{" "}
                    {Object.entries(webhook.mappingRules)
                      .map(([ext, form]) => `${ext} → ${form}`)
                      .join(", ")}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Status:{" "}
                    {webhook.enabled ? (
                      <span className="text-green-600 font-semibold">
                        Enabled
                      </span>
                    ) : (
                      <span className="text-gray-400">Disabled</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(webhook)}
                    disabled={loading}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(webhook.id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDocs(webhook)}
                    disabled={loading}
                  >
                    View Docs
                  </Button>
                </div>
              </Card>
            ))}
          </ul>
        </ScrollArea>
      )}
      <InboundWebhookFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMapping(null);
        }}
        initialMapping={editingMapping || undefined}
        onSave={handleSave}
        loading={loading}
      />
      <InboundWebhookDocsDrawer
        mapping={docsMapping}
        open={docsOpen}
        onClose={() => setDocsOpen(false)}
      />
    </section>
  );
}
