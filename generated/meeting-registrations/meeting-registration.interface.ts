import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface MeetingRegistration {
  active?: boolean;
  category?: MeetingCategory;
  conductedDate?: string;
  confirmationDate?: string;
  createdAt?: string;
  createdBy?: User;
  deletedAt?: string;
  deletedBy?: number;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  minuteStatus?: MinuteStatus;
  name?: string;
  uid?: string;
  upcomingSchedule?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export interface MeetingRegistrationDtoInput {
  attachments?: AttachmentDtoInput[];
  category?: MeetingCategory;
  conductedDate?: string;
  confirmationDate?: string;
  minuteStatus?: MinuteStatus;
  name?: string;
  uid?: string;
  upcomingSchedule?: string;
}

export enum MinuteStatus {
  APPROVED = 'APPROVED',
  DRAFT = 'DRAFT',
}
export enum MeetingCategory {
  AGM = 'AGM',
  EXTRAORDINARY = 'EXTRAORDINARY',
  ORDINARY = 'ORDINARY',
}
