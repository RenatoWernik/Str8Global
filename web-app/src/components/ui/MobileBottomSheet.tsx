'use client';

import { Drawer } from 'vaul';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface MobileBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  snapPoints?: number[];
  title?: string;
  onClose?: () => void;
}

export function MobileBottomSheet({
  open,
  onOpenChange,
  children,
  snapPoints,
  title,
  onClose,
}: MobileBottomSheetProps) {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
    onOpenChange(false);
  };

  // Ensure body scroll is locked when sheet is open
  // vaul handles this automatically via portal, but adding explicit handling
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [open]);

  return (
    <Drawer.Root
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />

        <Drawer.Content
          className="fixed bottom-0 left-0 right-0 z-[100] flex flex-col max-h-[90dvh] bg-black/95 backdrop-blur-xl border border-white/10 rounded-t-3xl"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {/* Drag handle area */}
          <div className="flex items-center justify-center pt-3 pb-2">
            <Drawer.Handle className="w-12 h-1.5 rounded-full bg-white/20" />
          </div>

          {/* Header with title (required by Radix for accessibility) */}
          {title ? (
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <Drawer.Title className="text-xl font-bold text-white">{title}</Drawer.Title>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>
          ) : (
            <Drawer.Title className="sr-only">Calendário</Drawer.Title>
          )}

          {/* Content area with scroll */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-white/10">
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
