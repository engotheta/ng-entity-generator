import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface PolicyRegistration {
  active?: boolean;
  applicability?: PolicyApplicability;
  createdAt?: string;
  createdBy?: User;
  dateOfReview?: string;
  deletedAt?: string;
  deletedBy?: number;
  department?: Department;
  endorsementDate?: string;
  expirationDate?: string;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  name?: string;
  reviewStatus?: PolicyReviewStatus;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export interface PolicyRegistrationDtoInput {
  applicability?: PolicyApplicability;
  attachments?: AttachmentDtoInput[];
  dateOfReview?: string;
  departmentUid?: number;
  endorsementDate?: string;
  expirationDate?: string;
  name?: string;
  reviewStatus?: PolicyReviewStatus;
  uid?: string;
}

export enum PolicyReviewStatus {
  GOOD = 'GOOD',
  POOR = 'POOR',
}
export enum PolicyApplicability {
  AUDITOR = 'AUDITOR',
  BOARD_MEMBER = 'BOARD_MEMBER',
  CUSTOMER = 'CUSTOMER',
  STAFF = 'STAFF',
}
