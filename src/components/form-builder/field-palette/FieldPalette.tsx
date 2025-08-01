import { CompactPalette, FullPalette } from './components';

import type { FieldPaletteProps } from './types';

export function FieldPalette({
  onAddField,
  compact = false,
}: FieldPaletteProps) {
  return compact ? (
    <CompactPalette onAddField={onAddField} />
  ) : (
    <FullPalette onAddField={onAddField} />
  );
}
