import { BaseEntity } from '../../base-entity/base-entity.model';

export interface GeneralLedgerEntryDto {
  credit?: number;
  debit?: number;
  description?: string;
  entryDate?: string;
  reference?: string;
  runningBalance?: number;
}

