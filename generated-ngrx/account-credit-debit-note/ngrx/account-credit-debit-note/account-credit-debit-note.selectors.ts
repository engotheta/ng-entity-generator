import { createSelector } from '@ngrx/store';
import { accountCreditDebitNotesFeatureKey } from './account-credit-debit-note.reducer';
import * as fromAccountCreditDebitNote from './account-credit-debit-note.reducer';
import { AppState } from '../../../index';
import { AccountCreditDebitNote } from './account-credit-debit-note.model';
import { formatDates } from '@shared/data/data.helpers';

export const currentAccountCreditDebitNotesState = (state: AppState) => state[accountCreditDebitNotesFeatureKey];

export const selectAccountCreditDebitNoteFromReducer = createSelector(
  currentAccountCreditDebitNotesState,
  fromAccountCreditDebitNote.selectAll
);

export const selectAccountCreditDebitNotes = createSelector(selectAccountCreditDebitNoteFromReducer, (items:AccountCreditDebitNote[]) => {
  return items?.map((item:AccountCreditDebitNote) => mapAccountCreditDebitNote(item));
});

export const mapAccountCreditDebitNote = (item: AccountCreditDebitNote) => {
  return {
    ...item,
    ...formatDates(item), // adds createdAtMod,...etc,
    activeMod: item?.active ? 'Active' : 'In Active',
  };
};

export const selectAccountCreditDebitNoteById = (id: number) =>
  createSelector(selectAccountCreditDebitNotes, items => items.find(item => item.id === id));

export const selectAccountCreditDebitNoteByUid = (uid: string) =>
  createSelector(selectAccountCreditDebitNotes, items => items.find(item => item.uid === uid));
