import { createSelector } from '@ngrx/store';
import { generalLedgerEntryDtosFeatureKey } from './general-ledger-entry-dto.reducer';
import * as fromGeneralLedgerEntryDto from './general-ledger-entry-dto.reducer';
import { AppState } from '../../../index';
import { GeneralLedgerEntryDto } from './general-ledger-entry-dto.model';
import { formatDates } from '@shared/data/data.helpers';

export const currentGeneralLedgerEntryDtosState = (state: AppState) => state[generalLedgerEntryDtosFeatureKey];

export const selectGeneralLedgerEntryDtoFromReducer = createSelector(
  currentGeneralLedgerEntryDtosState,
  fromGeneralLedgerEntryDto.selectAll
);

export const selectGeneralLedgerEntryDtos = createSelector(selectGeneralLedgerEntryDtoFromReducer, (items:GeneralLedgerEntryDto[]) => {
  return items?.map((item:GeneralLedgerEntryDto) => mapGeneralLedgerEntryDto(item));
});

export const mapGeneralLedgerEntryDto = (item: GeneralLedgerEntryDto) => {
  return {
    ...item,
    ...formatDates(item), // adds createdAtMod,...etc,
    activeMod: item?.active ? 'Active' : 'In Active',
  };
};

export const selectGeneralLedgerEntryDtoById = (id: number) =>
  createSelector(selectGeneralLedgerEntryDtos, items => items.find(item => item.id === id));

export const selectGeneralLedgerEntryDtoByUid = (uid: string) =>
  createSelector(selectGeneralLedgerEntryDtos, items => items.find(item => item.uid === uid));
