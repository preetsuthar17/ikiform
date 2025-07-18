import { useState } from "react";
import { WebhookList } from "./WebhookList";
import { WebhookFormModal } from "./WebhookFormModal";
import { WebhookLogDrawer } from "./WebhookLogDrawer";
import {
  useWebhookManagement,
  WebhookConfig,
} from "./hooks/useWebhookManagement";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function WebhookManagementPanel({ formId }: { formId?: string }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(
    null,
  );
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [logWebhookId, setLogWebhookId] = useState<string | null>(null);
  const {
    webhooks,
    loading,
    error,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    fetchWebhooks,
  } = useWebhookManagement({ formId });

  function handleAdd() {
    setEditingWebhook(null);
    setModalOpen(true);
  }

  async function handleSave(webhook: Partial<WebhookConfig>) {
    const accountId = user?.id;
    if (editingWebhook) {
      await updateWebhook(editingWebhook.id, {
        ...webhook,
        formId,
        accountId,
      } as any);
    } else {
      await createWebhook({ ...webhook, formId, accountId } as any);
    }
    setModalOpen(false);
    setEditingWebhook(null);
    fetchWebhooks();
  }

  function handleEdit(webhook: WebhookConfig) {
    setEditingWebhook(webhook);
    setModalOpen(true);
  }

  async function handleToggleEnabled(webhook: WebhookConfig) {
    const accountId = user?.id;
    await updateWebhook(webhook.id, {
      enabled: !webhook.enabled,
      formId,
      accountId,
    } as any);
    fetchWebhooks();
  }

  async function handleTest(webhook: WebhookConfig) {
    try {
      const res = await fetch(`/api/webhook/${webhook.id}/test`, {
        method: "POST",
      });
      const data = await res.json();
      alert(data.message || "Test sent");
    } catch (e) {
      alert("Test failed");
    }
  }

  function handleViewLogs(webhook: WebhookConfig) {
    setLogWebhookId(webhook.id);
    setLogDrawerOpen(true);
  }

  return (
    <section className="p-4 max-w-3xl mx-auto">
      <header className="mb-6 flex items-center justify-center">
        <Button
          variant="default"
          onClick={handleAdd}
          disabled={loading}
          loading={loading}
        >
          {loading ? "Loading" : "Add Webhook"}
        </Button>
      </header>
      <WebhookList
        webhooks={webhooks}
        loading={loading}
        onEdit={handleEdit}
        onDelete={deleteWebhook}
        onToggleEnabled={handleToggleEnabled}
        onTest={handleTest}
        onViewLogs={handleViewLogs}
      />
      <WebhookFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingWebhook(null);
        }}
        initialWebhook={
          editingWebhook
            ? {
                ...editingWebhook,
                headers: editingWebhook.headers ?? {},
                payloadTemplate: editingWebhook.payloadTemplate ?? "",
              }
            : undefined
        }
        onSave={handleSave}
        loading={loading}
      />
      <WebhookLogDrawer
        webhookId={logWebhookId}
        open={logDrawerOpen}
        onClose={() => setLogDrawerOpen(false)}
      />
    </section>
  );
}
