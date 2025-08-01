import { ScrollArea } from '@/components/ui/scroll-area';

import { FIELD_TYPES, PALETTE_CONFIG } from '../constants';

import type { FieldPaletteProps } from '../types';
import { CompactFieldItem } from './CompactFieldItem';

export function CompactPalette({
  onAddField,
}: Pick<FieldPaletteProps, 'onAddField'>) {
  return (
    <ScrollArea className="max-h-[60vh] p-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {FIELD_TYPES.map((fieldType) => (
          <CompactFieldItem
            fieldType={fieldType}
            key={fieldType.type}
            onAddField={onAddField}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
