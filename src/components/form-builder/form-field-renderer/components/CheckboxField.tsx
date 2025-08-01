import React from 'react';

import { Checkbox } from '@/components/ui/checkbox';

import type { BaseFieldProps } from '../types';
import { sanitizeOptions } from '../utils/sanitizeOptions';

export function CheckboxField({
  field,
  value,
  onChange,
  disabled,
}: BaseFieldProps) {
  const [apiOptions, setApiOptions] = React.useState<Array<
    string | { value: string; label?: string }
  > | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [fetchError, setFetchError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (field.optionsApi) {
      setLoading(true);
      fetch(field.optionsApi)
        .then((res) => res.json())
        .then((data) => {
          let options: Array<any> = [];
          if (Array.isArray(data)) {
            options = data;
          } else if (Array.isArray(data.options)) {
            options = data.options;
          }

          if (field.valueKey || field.labelKey) {
            options = options.map((item: any) => {
              return {
                value: field.valueKey ? item[field.valueKey] : item.value,
                label: field.labelKey
                  ? item[field.labelKey]
                  : item.label || item.value,
              };
            });
          }
          setApiOptions(sanitizeOptions(options));
          setLoading(false);
        })
        .catch((err) => {
          setFetchError('Failed to fetch options');
          setLoading(false);
        });
    } else {
      setApiOptions(null);
    }
  }, [field.optionsApi, field.valueKey ?? '', field.labelKey ?? '']);

  const options = apiOptions ?? field.options ?? [];

  return (
    <div className="flex flex-col gap-2">
      {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
      {options.map((option, index) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel =
          typeof option === 'string' ? option : option.label || option.value;
        return (
          <Checkbox
            checked={(value || []).includes(optionValue)}
            disabled={disabled || loading}
            id={`${field.id}-${index}`}
            key={index}
            label={optionLabel}
            onCheckedChange={(checked) => {
              const currentValues = value || [];
              if (checked) {
                onChange([...currentValues, optionValue]);
              } else {
                onChange(
                  currentValues.filter((v: string) => v !== optionValue)
                );
              }
            }}
          />
        );
      })}
    </div>
  );
}
