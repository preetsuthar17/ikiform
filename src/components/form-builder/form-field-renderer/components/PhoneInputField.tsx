import type React from 'react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { validatePhoneNumber } from '@/lib/validation/phone-validation';
import type { BaseFieldProps } from '../types';
import { getBaseClasses } from '../utils';

export function PhoneInputField({
  field,
  value,
  onChange,
  error,
  disabled,
}: BaseFieldProps) {
  const baseClasses = getBaseClasses(field, error);
  const [inputValue, setInputValue] = useState(value || '');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onChange(e.target.value);
  };

  const handleBlur = () => {
    setIsValidating(true);
  };

  const validation = validatePhoneNumber(inputValue);
  const errorMessage =
    error || (isValidating && !validation.isValid ? validation.message : '');

  return (
    <div className="flex flex-col gap-2">
      <Input
        className={`flex gap-2 ${baseClasses}`}
        disabled={disabled}
        id={field.id}
        onBlur={handleBlur}
        onChange={handleInputChange}
        placeholder={field.placeholder || 'Enter phone number'}
        type="tel"
        value={inputValue}
      />
      {errorMessage && (
        <span className="text-destructive text-xs">{errorMessage}</span>
      )}
    </div>
  );
}
