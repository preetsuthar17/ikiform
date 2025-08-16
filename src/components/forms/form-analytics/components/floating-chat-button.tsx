import Image from 'next/image';
import type React from 'react';

import { Button } from '@/components/ui/button';

import type { FloatingChatButtonProps } from '../types';

export const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="cursor-pointer">
      <Button
        className="fixed right-5 bottom-5 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-ele border border-border bg-transparent transition-all duration-200 hover:bg-transparent"
        onClick={onClick}
        size="icon"
      >
        <Image
          alt="Ikiform"
          className={'pointer-events-none cursor-pointer rounded-ele'}
          height={100}
          src="/logo.svg"
          width={100}
        />
      </Button>
    </div>
  );
};
