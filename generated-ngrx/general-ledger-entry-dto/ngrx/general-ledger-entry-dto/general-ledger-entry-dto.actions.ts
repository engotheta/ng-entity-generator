import { GeneralLedgerEntryDto, GeneralLedgerEntryDtoDtoInput } from './general-ledger-entry-dto.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const GeneralLedgerEntryDtoActions = createActionGroup({
  source: 'GeneralLedgerEntryDto/API',
  events: {
  'Load General Ledger Entry Dtos': props<{ generalLedgerEntryDtos: GeneralLedgerEntryDto[] }>(),
  'Add General Ledger Entry Dto': props<{ generalLedgerEntryDto: GeneralLedgerEntryDto }>(),
  'Upsert General Ledger Entry Dto': props<{ generalLedgerEntryDto: GeneralLedgerEntryDto }>(),
  'Add General Ledger Entry Dtos': props<{ generalLedgerEntryDtos: GeneralLedgerEntryDto[] }>(),
  'Upsert General Ledger Entry Dtos': props<{ generalLedgerEntryDtos: GeneralLedgerEntryDto[] }>(),
  'Update General Ledger Entry Dto': props<{ generalLedgerEntryDto: Update<GeneralLedgerEntryDto> }>(),
  'Update General Ledger Entry Dtos': props<{ generalLedgerEntryDtos: Update<GeneralLedgerEntryDto>[] }>(),
  'Delete General Ledger Entry Dto': props<{ id: number }>(),
  'Delete General Ledger Entry Dtos': props<{ ids: number[] }>(),
  'Clear General Ledger Entry Dto': emptyProps(),
  'Clear General Ledger Entry Dtos': emptyProps(),

    // API
  },
});
