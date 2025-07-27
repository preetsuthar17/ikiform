// Components
import { CompactPalette, FullPalette } from './components';

// Types
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
