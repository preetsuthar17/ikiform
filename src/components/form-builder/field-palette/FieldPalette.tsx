import { CompactPalette, FullPalette } from './components';

import type { FieldPaletteProps } from './types';

export function FieldPalette({
  onAddField,
  compact = false,
  formSchema,
  onSchemaUpdate,
}: FieldPaletteProps) {
  return compact ? (
    <CompactPalette onAddField={onAddField} />
  ) : (
    <FullPalette
      formSchema={formSchema}
      onAddField={onAddField}
      onSchemaUpdate={onSchemaUpdate}
    />
  );
}
