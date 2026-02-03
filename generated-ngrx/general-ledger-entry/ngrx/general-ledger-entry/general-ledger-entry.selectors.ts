import { createSelector } from '@ngrx/store';
import { generalLedgerEntriesFeatureKey } from './general-ledger-entry.reducer';
import * as fromGeneralLedgerEntry from './general-ledger-entry.reducer';
import { AppState } from '../../../index';
import { GeneralLedgerEntry } from './general-ledger-entry.model';
import { formatDates } from '@shared/data/data.helpers';

export const currentGeneralLedgerEntriesState = (state: AppState) => state[generalLedgerEntriesFeatureKey];

export const selectGeneralLedgerEntryFromReducer = createSelector(
  currentGeneralLedgerEntriesState,
  fromGeneralLedgerEntry.selectAll
);

export const selectGeneralLedgerEntries = createSelector(selectGeneralLedgerEntryFromReducer, (items:GeneralLedgerEntry[]) => {
  return items?.map((item:GeneralLedgerEntry) => mapGeneralLedgerEntry(item));
});

export const mapGeneralLedgerEntry = (item: GeneralLedgerEntry) => {
  return {
    ...item,
    ...formatDates(item), // adds createdAtMod,...etc,
    activeMod: item?.active ? 'Active' : 'In Active',
  };
};

export const selectGeneralLedgerEntryById = (id: number) =>
  createSelector(selectGeneralLedgerEntries, items => items.find(item => item.id === id));

export const selectGeneralLedgerEntryByUid = (uid: string) =>
  createSelector(selectGeneralLedgerEntries, items => items.find(item => item.uid === uid));
