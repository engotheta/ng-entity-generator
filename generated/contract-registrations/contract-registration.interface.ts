import { User } from '@routes/auth/auth.interface'

export interface ContractRegistration {
  active?: boolean;
  amount?: number;
  contractDate?: string;
  contractManager?: string;
  contractNumber?: string;
  contractType?: ContractType;
  createdAt?: string;
  createdBy?: User;
  deletedAt?: string;
  deletedBy?: number;
  department?: Department;
  duration?: number;
  endDate?: string;
  executionStatus?: ContractExecutionStatus;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  name?: string;
  serviceProvider?: string;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export enum ContractExecutionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
}
export enum ContractType {
  ADDENDUM = 'ADDENDUM',
  MoU = 'MoU',
  NON_PROCUREMENT = 'NON_PROCUREMENT',
  PROCUREMENT = 'PROCUREMENT',
}
