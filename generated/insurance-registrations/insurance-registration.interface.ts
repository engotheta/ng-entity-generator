import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface InsuranceRegistration {
  active?: boolean;
  coverage?: string;
  createdAt?: string;
  createdBy?: User;
  deletedAt?: string;
  deletedBy?: number;
  department?: Department;
  duration?: number;
  endDate?: string;
  id?: number;
  insuranceType?: InsuranceType;
  isDeleted?: boolean;
  migrated?: boolean;
  nameOfAsset?: string;
  startDate?: string;
  statusOfIncident?: string;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  value?: number;
}

export interface InsuranceRegistrationDtoInput {
  attachments?: AttachmentDtoInput[];
  coverage?: string;
  duration?: number;
  endDate?: string;
  insuranceType?: InsuranceType;
  nameOfAsset?: string;
  startDate?: string;
  statusOfIncident?: string;
  uid?: string;
  value?: number;
}

export enum InsuranceType {
  COMPREHENSIVE = 'COMPREHENSIVE',
  THIRD_PART = 'THIRD_PART',
}
