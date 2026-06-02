import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface LicenceRegistration {
  active?: boolean;
  condition?: string;
  createdAt?: string;
  createdBy?: User;
  deletedAt?: string;
  deletedBy?: number;
  department?: Department;
  duration?: number;
  expirationDate?: string;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  name?: string;
  renewalRequirement?: string;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export interface LicenceRegistrationDtoInput {
  attachments?: AttachmentDtoInput[];
  condition?: string;
  departmentUid?: number;
  duration?: number;
  expirationDate?: string;
  name?: string;
  renewalRequirement?: string;
  uid?: string;
}

