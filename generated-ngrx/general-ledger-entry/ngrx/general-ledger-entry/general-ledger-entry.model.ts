import { BaseEntity } from '../../base-entity/base-entity.model';

export interface GeneralLedgerEntry extends BaseEntity {
  credit?: number;
  debit?: number;
  description?: string;
  entryDate?: string;
  reference?: string;
  runningBalance?: number;
}

