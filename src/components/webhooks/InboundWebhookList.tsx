import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  type InboundWebhookMapping,
  useInboundWebhookManagement,
} from './hooks/useInboundWebhookManagement';
import { InboundWebhookFormModal } from './InboundWebhookFormModal';

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
  if (!(open && mapping)) return null;
  const samplePayload = Object.keys(mapping.mappingRules).reduce(
    (acc, ext) => {
      acc[ext] = `example_${ext}`;
      return acc;
    },
    {} as Record<string, string>
  );
  async function handleCopy(text: string, type: string) {
    const { copyToClipboard } = await import('@/lib/utils/clipboard');
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(type);
      setTimeout(() => setCopied(null), 1200);
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40 md:items-center">
      <Card className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-lg bg-white p-6 shadow-lg md:rounded-lg">
        <Button
          aria-label="Close"
          className="absolute top-2 right-2"
          onClick={onClose}
          size="sm"
          variant="ghost"
        >
          &times;
        </Button>
        <h3 className="mb-4 font-bold text-xl">
          Inbound Webhook Documentation
        </h3>
        <div className="mb-2">
          <b>Endpoint:</b>
          <div className="flex items-center gap-2">
            <Input
              className="mt-1 flex-1 cursor-not-allowed bg-gray-100 text-xs"
              disabled
              readOnly
              value={mapping.endpoint}
            />
            <Button
              onClick={() => handleCopy(mapping.endpoint, 'endpoint')}
              size="sm"
              variant="outline"
            >
              {copied === 'endpoint' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <b>Sample Payload:</b>
          <div className="flex items-center gap-2">
            <pre className="mt-1 flex-1 rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(samplePayload, null, 2)}
            </pre>
            <Button
              onClick={() =>
                handleCopy(JSON.stringify(samplePayload, null, 2), 'payload')
              }
              size="sm"
              variant="outline"
            >
              {copied === 'payload' ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
        <div className="mb-2">
          <b>Security:</b>
          <ul className="ml-6 list-disc text-xs">
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
    null
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
    <section className="mx-auto max-w-3xl p-4">
      <header className="mb-6 flex items-center justify-between">
        <h2 className="font-bold text-2xl">Inbound Webhooks</h2>
        <Button disabled={loading} onClick={handleAdd} variant="default">
          {loading ? 'Loading...' : 'Add Inbound Webhook'}
        </Button>
      </header>
      {loading ? (
        <div className="py-8 text-center">Loading inbound webhooks...</div>
      ) : mappings.length ? (
        <ScrollArea className="max-h-[60vh]">
          <ul className="flex flex-col gap-4">
            {mappings.map((webhook) => (
              <Card
                className="flex flex-col gap-4 rounded-lg p-4 shadow md:flex-row md:items-center md:justify-between"
                key={webhook.id}
              >
                <div>
                  <div className="break-all font-mono text-gray-700 text-sm">
                    {webhook.endpoint}
                  </div>
                  <div className="mt-1 text-gray-500 text-xs">
                    Target Form:{' '}
                    <span className="font-semibold">
                      {webhook.targetFormId}
                    </span>
                  </div>
                  <div className="mt-1 text-gray-500 text-xs">
                    Mapping:{' '}
                    {Object.entries(webhook.mappingRules)
                      .map(([ext, form]) => `${ext} → ${form}`)
                      .join(', ')}
                  </div>
                  <div className="mt-2 text-gray-500 text-xs">
                    Status:{' '}
                    {webhook.enabled ? (
                      <span className="font-semibold text-green-600">
                        Enabled
                      </span>
                    ) : (
                      <span className="text-gray-400">Disabled</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    disabled={loading}
                    onClick={() => handleEdit(webhook)}
                    size="sm"
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => handleDelete(webhook.id)}
                    size="sm"
                    variant="destructive"
                  >
                    Delete
                  </Button>
                  <Button
                    disabled={loading}
                    onClick={() => handleViewDocs(webhook)}
                    size="sm"
                    variant="outline"
                  >
                    View Docs
                  </Button>
                </div>
              </Card>
            ))}
          </ul>
        </ScrollArea>
      ) : (
        <div className="py-8 text-center text-gray-500">
          No inbound webhooks found.
        </div>
      )}
      <InboundWebhookFormModal
        initialMapping={editingMapping || undefined}
        loading={loading}
        onClose={() => {
          setModalOpen(false);
          setEditingMapping(null);
        }}
        onSave={handleSave}
        open={modalOpen}
      />
      <InboundWebhookDocsDrawer
        mapping={docsMapping}
        onClose={() => setDocsOpen(false)}
        open={docsOpen}
      />
    </section>
  );
}
