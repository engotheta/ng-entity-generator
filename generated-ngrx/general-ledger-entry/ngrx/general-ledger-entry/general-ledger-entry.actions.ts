import { GeneralLedgerEntry, GeneralLedgerEntryDtoInput } from './general-ledger-entry.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const GeneralLedgerEntryActions = createActionGroup({
  source: 'GeneralLedgerEntry/API',
  events: {
  'Load General Ledger Entries': props<{ generalLedgerEntries: GeneralLedgerEntry[] }>(),
  'Add General Ledger Entry': props<{ generalLedgerEntry: GeneralLedgerEntry }>(),
  'Upsert General Ledger Entry': props<{ generalLedgerEntry: GeneralLedgerEntry }>(),
  'Add General Ledger Entries': props<{ generalLedgerEntries: GeneralLedgerEntry[] }>(),
  'Upsert General Ledger Entries': props<{ generalLedgerEntries: GeneralLedgerEntry[] }>(),
  'Update General Ledger Entry': props<{ generalLedgerEntry: Update<GeneralLedgerEntry> }>(),
  'Update General Ledger Entries': props<{ generalLedgerEntries: Update<GeneralLedgerEntry>[] }>(),
  'Delete General Ledger Entry': props<{ id: number }>(),
  'Delete General Ledger Entries': props<{ ids: number[] }>(),
  'Clear General Ledger Entry': emptyProps(),
  'Clear General Ledger Entries': emptyProps(),

    // API
  },
});
