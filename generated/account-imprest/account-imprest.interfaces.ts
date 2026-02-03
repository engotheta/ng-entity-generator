import { BaseEntity } from '../../base-entity/base-entity.model';
import { Role } from '@store/features/settings/roles/role.interface'
import { User } from '@store/features/portal/profile/profile.interface'

export interface AccountImprest extends BaseEntity {
  advanceAccount?: ChartOfAccount;
  amount?: number;
  approvalStatus?: ApprovalStatus;
  balance?: number;
  bankAccount?: BankAccount;
  contentEditable?: boolean;
  currentApprovalStage?: ApprovalProcessStage;
  currentApprovalStageAssignedDate?: string;
  currentAssignedGroup?: Role;
  currentAssignedUserAccount?: User;
  department?: Division;
  description?: string;
  dueDate?: string;
  finalApprovedBy?: User;
  finalApprovedByUsername?: string;
  finalApprovedDate?: string;
  financialYear?: FinancialYear;
  holderClient?: Client;
  holderEmployee?: Employee;
  isApprovalCompleted?: boolean;
  items?: AccountImprestLineItem;
  migrated?: boolean;
  post?: Division;
  processName?: string;
  referenceNumber?: string;
  requestDate?: string;
  retiredAmount?: number;
  retirements?: AccountImprestRetirement;
  status?: ImprestStatus;
  systemNumber?: string;
  title?: string;
}

export interface AccountImprestLineItem extends BaseEntity {
  account?: ChartOfAccount;
  amount?: number;
  description?: string;
  imprest?: AccountImprest;
  migrated?: boolean;
  quantity?: number;
  unitCost?: number;
}

export interface AccountImprestDtoInput {
  advanceAccountUid: string;
  amount: number;
  bankAccountUid: string;
  description?: string;
  dueDate?: string;
  financialYearUid: string;
  holderClientUid?: string;
  holderEmployeeUid?: string;
  items: ImprestLineItemDtoInput;
  referenceNumber: string;
  requestDate: string;
  title: string;
  uid?: string;
}

export interface ImprestLineItemDtoInput {
  chartOfAccountUid: string;
  description: string;
  quantity: number;
  uid?: string;
  unitCost: number;
}

export interface ImprestOutstandingDto {
  amount?: number;
  balance?: number;
  daysOverdue: number;
  dueDate?: string;
  holder?: string;
  imprestUid?: string;
  referenceNumber?: string;
  requestDate?: string;
  retiredAmount?: number;
  title?: string;
}

export enum ImprestStatus {
  AWAITING_RETIREMENT = 'AWAITING_RETIREMENT',
  DRAFT = 'DRAFT',
  POSTED = 'POSTED',
  RETIRED = 'RETIRED',
  REVERSED = 'REVERSED',
}
