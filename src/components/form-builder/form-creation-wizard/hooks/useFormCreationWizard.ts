// Type imports
import { useState } from 'react';
import type { FormType } from '../types';

export const useFormCreationWizard = () => {
  const [selectedType, setSelectedType] = useState<FormType | null>(null);

  const selectType = (type: FormType) => {
    setSelectedType(type);
  };

  const resetSelection = () => {
    setSelectedType(null);
  };

  return {
    selectedType,
    selectType,
    resetSelection,
  };
};
