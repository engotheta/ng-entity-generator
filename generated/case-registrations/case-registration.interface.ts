import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface CaseRegistration {
  active?: boolean;
  amount?: number;
  createdAt?: string;
  createdBy?: User;
  dateOfSchedules?: string;
  decistion?: string;
  deletedAt?: string;
  deletedBy?: number;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  name?: string;
  natureOfCase?: CaseNature;
  place?: SubWard;
  responsibleInstitution?: string;
  responsibleOfficer?: User;
  responsibleUnit?: Department;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  year?: number;
}

export interface CaseRegistrationDtoInput {
  amount?: number;
  attachments?: AttachmentDtoInput[];
  dateOfSchedules?: string;
  decision?: string;
  name?: string;
  natureOfCase?: CaseNature;
  placeUid?: string;
  responsibleDepartmentUid?: string;
  responsibleInstitution?: string;
  responsibleOfficerUid?: string;
  uid?: string;
  year?: number;
}

export enum CaseNature {
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
}
