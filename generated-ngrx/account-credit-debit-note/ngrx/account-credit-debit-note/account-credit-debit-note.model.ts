import { BaseEntity } from '../../base-entity/base-entity.model';
import { ApprovalStatus } from '@store/entities/approval-flow/approval-pocess-stage/approval-pocess-stage.model'
import { Client } from '@store/entities/client/client/client.model'
import { ApprovalProcessStage } from '@store/entities/approval-flow/approval-pocess-stage/approval-pocess-stage.model'
import { Role } from '@store/entities/user-management/role/role.model'
import { User } from '@store/entities/user-management/user/user.model'
import { Division } from '@store/entities/hrm/settings/division/division.model'
import { FinancialYear } from '@store/entities/planning/financial-year/financial-year.model'
import { AccountInvoice } from '@store/entities/accounts/account-invoice/account-invoice.model'
import { ChartOfAccount } from '@store/entities/accounts/chart-of-account/chart-of-account.model'
import { RevenueBudgetItem } from '@store/entities/budget/revenue-budget/revenue-budget.model'

export interface AccountCreditDebitNote extends BaseEntity {
  amountApplied?: number;
  approvalStatus?: ApprovalStatus;
  balance?: number;
  client?: Client;
  contentEditable?: boolean;
  currentApprovalStage?: ApprovalProcessStage;
  currentApprovalStageAssignedDate?: string;
  currentAssignedGroup?: Role;
  currentAssignedUserAccount?: User;
  department?: Division;
  description?: string;
  finalApprovedBy?: User;
  finalApprovedByUsername?: string;
  finalApprovedDate?: string;
  financialYear?: FinancialYear;
  invoice?: AccountInvoice;
  isApprovalCompleted?: boolean;
  items?: AccountCreditDebitNoteItem;
  migrated?: boolean;
  noteDate?: string;
  noteNumber?: string;
  noteType?: CreditDebitNoteType;
  post?: Division;
  postedAt?: string;
  postedBy?: number;
  processName?: string;
  reason?: string;
  receivableAccount?: ChartOfAccount;
  referenceNumber?: string;
  reversalReason?: string;
  reversedAt?: string;
  reversedBy?: number;
  status?: CreditDebitNoteStatus;
  systemNumber?: string;
  totalAmount?: number;
}

export interface AccountCreditDebitNoteItem extends BaseEntity {
  account?: ChartOfAccount;
  amount?: number;
  description?: string;
  migrated?: boolean;
  note?: AccountCreditDebitNote;
  quantity?: number;
  revenueBudgetItem?: RevenueBudgetItem;
  unitPrice?: number;
}

export interface CreditDebitNoteDtoInput {
  description?: string;
  invoiceUid: string;
  items: CreditDebitNoteItemDtoInput;
  noteDate: string;
  noteType: CreditDebitNoteType;
  reason?: string;
  referenceNumber?: string;
  uid?: string;
}

export interface CreditDebitNoteItemDtoInput {
  accountUid: string;
  description: string;
  quantity?: number;
  revenueBudgetItemUid?: string;
  uid?: string;
  unitPrice?: number;
}

export enum CreditDebitNoteStatus {
  APPLIED = 'APPLIED',
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  REVERSED = 'REVERSED',
}
