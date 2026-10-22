'use client';

import Icon from '@/components/Icon';
import { Expense, catById, peso } from '@/lib/budget';

interface ExpenseRowProps {
  e: Expense;
  isNew?: boolean;
  out?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (e: Expense) => void;
}

export default function ExpenseRow({ e, isNew, out, onDelete, onEdit }: ExpenseRowProps) {
  const cat = catById(e.cat);
  return (
    <div className={`row ${isNew ? 'is-new' : ''} ${out ? 'out' : ''}`} style={{ '--c': cat.color, '--g': cat.grad } as React.CSSProperties}>
      <div className="ic"><Icon name={cat.icon} /></div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{e.note || cat.label}</p>
        <p className="text-[13px] text-muted mt-0.5 truncate">{cat.label}{out ? ', outside this period' : ''}</p>
      </div>
      <p className="font-display font-bold text-lg tracking-tight tnum whitespace-nowrap">−{peso(e.amount)}</p>
      {onEdit && (
        <button type="button" className="del edit" onClick={() => onEdit(e)} aria-label={`Edit ${e.note || cat.label}`}>
          <Icon name="pencil" />
        </button>
      )}
      {onDelete && (
        <button type="button" className="del" onClick={() => onDelete(e.id)} aria-label={`Delete ${e.note || cat.label}`}>
          <Icon name="trash-2" />
        </button>
      )}
    </div>
  );
}
