
export interface AgreementAddendum {
  addendumNumber?: string;
  createdAt?: string;
  reasons?: string;
  status?: string;
  updatedAt?: string;
  uuid?: string;
  versionNumber?: number;
}

export interface AgreementAddendumRequestInput {
  actionType: AddendumAction;
  agreementUid: string;
  reason: string;
  status: AddendumStatus;
  uuid?: string;
}

export interface AttachmentConfigResponse {
  active?: boolean;
  attachmentType?: AttachmentType;
  description?: string;
  entityType?: EntityType;
  label?: string;
  maxFiles?: number;
  uuid?: string;
}

export interface AttachmentType {
  active?: boolean;
  code?: string;
  description?: string;
  name?: string;
}

export enum AddendumAction {
  ADD = 'ADD',
  MODIFY = 'MODIFY',
}
export enum AddendumStatus {
  APPROVED = 'APPROVED',
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
}
export enum EntityType {
  ACADEMIC_CERTIFICATION = 'ACADEMIC_CERTIFICATION',
  ADDENDUM = 'ADDENDUM',
  AGREEMENT = 'AGREEMENT',
  CASE = 'CASE',
  COMPANY_LOGO = 'COMPANY_LOGO',
  CONTRACT = 'CONTRACT',
  INCOMING = 'INCOMING',
  MEETING_AGENDA = 'MEETING_AGENDA',
  NOTICE_REPORT_CAUSE_OF_ACTION = 'NOTICE_REPORT_CAUSE_OF_ACTION',
  OPINION = 'OPINION',
  PROFILE_PIC_ATT = 'PROFILE_PIC_ATT',
  PROFILE_PIC_PUBLIC = 'PROFILE_PIC_PUBLIC',
  PROFILE_PIC_STAFF = 'PROFILE_PIC_STAFF',
  PUBLICATION = 'PUBLICATION',
  RESEARCH = 'RESEARCH',
  SIGNATURE = 'SIGNATURE',
  SITE = 'SITE',
}
