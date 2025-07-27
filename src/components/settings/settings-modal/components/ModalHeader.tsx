// External imports

import { X } from 'lucide-react';
import React from 'react';

// Internal imports
import { Button } from '@/components/ui/button';

interface ModalHeaderProps {
  onClose: () => void;
}

export function ModalHeader({ onClose }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="font-semibold text-lg">Settings</h1>
    </div>
  );
}
