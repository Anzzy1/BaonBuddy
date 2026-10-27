'use client';

import Icon from '@/components/Icon';
import { isIOSUI } from '@/lib/platform';

interface SheetProps {
  title: string;
  sub?: string;
  label?: string;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  children: React.ReactNode;
  // Drawn on top of the sheet, outside its scroll area (e.g. a confirm prompt)
  overlay?: React.ReactNode;
}

// Shared modal sheet: same look as Settings, with the iOS scrim when running in the iOS shell
export default function Sheet({ title, sub, label, onClose, onSubmit, children, overlay }: SheetProps) {
  const Body = onSubmit ? 'form' : 'div';
  return (
    <dialog open className="fixed inset-0 z-50" aria-label={label || title} onKeyDown={e => e.key === 'Escape' && onClose()}>
      {isIOSUI() && <div className="ios-scrim" onClick={onClose} aria-hidden />}
      <Body className="sheet" onSubmit={onSubmit} noValidate={onSubmit ? true : undefined}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="card-title">{title}</h3>
            {sub && <p className="text-sm text-muted mt-1">{sub}</p>}
          </div>
          <button type="button" className="icon-btn shrink-0" onClick={onClose} aria-label="Close">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </Body>
      {overlay}
    </dialog>
  );
}
