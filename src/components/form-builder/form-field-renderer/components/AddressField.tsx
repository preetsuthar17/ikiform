import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import type { BaseFieldProps } from '../types';
import { getBaseClasses } from '../utils';

const addressFields = [
  { key: 'line1', label: 'Address Line 1', required: true },
  { key: 'line2', label: 'Address Line 2', required: false },
  { key: 'city', label: 'City', required: true },
  { key: 'state', label: 'State', required: true },
  { key: 'zip', label: 'Zip Code', required: true },
  { key: 'country', label: 'Country', required: true },
];

export function AddressField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);
  const [address, setAddress] = useState(value || {});

  useEffect(() => {
    setAddress(value || {});
  }, [value]);

  const handleChange = (key: string, val: string) => {
    const updated = { ...address, [key]: val };
    setAddress(updated);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2">
      {addressFields.map((f) => (
        <Input
          className={`flex gap-2 ${baseClasses}`}
          disabled={disabled}
          id={`${field.id}-${f.key}`}
          key={f.key}
          onChange={(e) => handleChange(f.key, e.target.value)}
          placeholder={f.label}
          required={f.required}
          value={address[f.key] || ''}
        />
      ))}
      {error && <span className="text-destructive text-xs">{error}</span>}
    </div>
  );
}
