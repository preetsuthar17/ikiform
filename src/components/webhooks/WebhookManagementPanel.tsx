import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import {
  useWebhookManagement,
  type WebhookConfig,
} from './hooks/useWebhookManagement';
import { TestWebhookDialog } from './TestWebhookDialog';
import { WebhookFormModal } from './WebhookFormModal';
import { WebhookList } from './WebhookList';
import { WebhookLogDrawer } from './WebhookLogDrawer';

export function WebhookManagementPanel({ formId }: { formId?: string }) {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(
    null
  );
  const [logDrawerOpen, setLogDrawerOpen] = useState(false);
  const [logWebhookId, setLogWebhookId] = useState<string | null>(null);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [testingWebhook, setTestingWebhook] = useState<WebhookConfig | null>(
    null
  );
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

  function handleTest(webhook: WebhookConfig) {
    setTestingWebhook(webhook);
    setTestDialogOpen(true);
  }

  function handleViewLogs(webhook: WebhookConfig) {
    setLogWebhookId(webhook.id);
    setLogDrawerOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">Webhook Endpoints</p>
          <p className="text-muted-foreground text-xs">
            Configure webhooks to receive form submissions
          </p>
        </div>
        <Button
          disabled={loading}
          loading={loading}
          onClick={handleAdd}
          size="sm"
          variant="default"
        >
          {loading ? 'Loading' : 'Add Webhook'}
        </Button>
      </div>

      <WebhookList
        loading={loading}
        onDelete={deleteWebhook}
        onEdit={handleEdit}
        onTest={handleTest}
        onToggleEnabled={handleToggleEnabled}
        onViewLogs={handleViewLogs}
        webhooks={webhooks}
      />

      <WebhookFormModal
        initialWebhook={
          editingWebhook
            ? {
                ...editingWebhook,
                headers: editingWebhook.headers ?? {},
                payloadTemplate: editingWebhook.payloadTemplate ?? '',
              }
            : undefined
        }
        loading={loading}
        onClose={() => {
          setModalOpen(false);
          setEditingWebhook(null);
        }}
        onSave={handleSave}
        open={modalOpen}
      />

      <WebhookLogDrawer
        onClose={() => setLogDrawerOpen(false)}
        open={logDrawerOpen}
        webhookId={logWebhookId}
      />

      <TestWebhookDialog
        onClose={() => {
          setTestDialogOpen(false);
          setTestingWebhook(null);
        }}
        open={testDialogOpen}
        webhook={testingWebhook}
      />
    </div>
  );
}
