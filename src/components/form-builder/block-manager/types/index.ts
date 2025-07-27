// Types
import type { FormBlock, FormField } from '@/lib/database';

export interface BlockManagerProps {
  blocks: FormBlock[];
  selectedBlockId: string | null;
  selectedFieldId: string | null;
  onBlockSelect: (blockId: string | null) => void;
  onFieldSelect: (fieldId: string | null) => void;
  onBlocksUpdate: (blocks: FormBlock[]) => void;
  onBlockAdd: () => void;
  onBlockDelete: (blockId: string) => void;
  onFieldDelete: (fieldId: string) => void;
}

export interface BlockManagerHeaderProps {
  blocksCount: number;
  onBlockAdd: () => void;
}

export interface BlockItemProps {
  block: FormBlock;
  index: number;
  isExpanded: boolean;
  isSelected: boolean;
  isEditing: boolean;
  selectedFieldId: string | null;
  onBlockSelect: (blockId: string | null) => void;
  onFieldSelect: (fieldId: string | null) => void;
  onToggleExpansion: (blockId: string) => void;
  onStartEditing: (block: FormBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onFieldDelete: (fieldId: string) => void;
  canDelete: boolean;
}

export interface BlockEditFormProps {
  title: string;
  description: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export interface BlockHeaderProps {
  block: FormBlock;
  index: number;
  isSelected: boolean;
  isEditing: boolean;
  onBlockSelect: (blockId: string | null) => void;
  onStartEditing: (block: FormBlock) => void;
  onBlockDelete: (blockId: string) => void;
  onToggleExpansion: (blockId: string) => void;
  isExpanded: boolean;
  canDelete: boolean;
}

export interface BlockFieldsListProps {
  fields: FormField[];
  selectedFieldId: string | null;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldDelete: (fieldId: string) => void;
}

export interface FieldItemProps {
  field: FormField;
  isSelected: boolean;
  onFieldSelect: (fieldId: string | null) => void;
  onFieldDelete: (fieldId: string) => void;
}

export interface BlockEditingState {
  editingBlock: string | null;
  editTitle: string;
  editDescription: string;
}

export interface DragEndResult {
  destination: {
    index: number;
  } | null;
  source: {
    index: number;
  };
}
