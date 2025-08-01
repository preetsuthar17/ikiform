import React from 'react';

import { RadioGroup, RadioItem } from '@/components/ui/radio';

import type { BaseFieldProps } from '../types';

import { getErrorRingClasses } from '../utils';
import { sanitizeOptions } from '../utils/sanitizeOptions';

export function RadioField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const errorRingClasses = getErrorRingClasses(error);
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
    <RadioGroup
      className={`flex gap-2 ${errorRingClasses}`}
      disabled={disabled || loading}
      onValueChange={onChange}
      value={value || ''}
    >
      {fetchError && <div className="p-2 text-red-500">{fetchError}</div>}
      {options.map((option, index) => {
        if (typeof option === 'string') {
          return (
            <RadioItem
              disabled={disabled || loading}
              id={`${field.id}-${index}`}
              key={index}
              label={option}
              value={option}
            />
          );
        }
        if (option && typeof option === 'object' && option.value) {
          return (
            <RadioItem
              disabled={disabled || loading}
              id={`${field.id}-${index}`}
              key={index}
              label={option.label || option.value}
              value={option.value}
            />
          );
        }
        return null;
      })}
    </RadioGroup>
  );
}
