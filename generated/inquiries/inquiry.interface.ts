import { User } from '@routes/auth/auth.interface'
import { AttachmentDtoInput } from '@shared/components/generic-form/attachment/attachment.interface'

export interface Inquiry {
  active?: boolean;
  uid?: string;
}

export interface InquiryAssignment {
  active?: boolean;
  assignedBy?: User;
  assignee?: User;
  comment?: string;
  createdAt?: string;
  createdBy?: User;
  current?: boolean;
  deletedAt?: string;
  deletedBy?: number;
  id?: number;
  inquiry?: Inquiry;
  isDeleted?: boolean;
  migrated?: boolean;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export interface InquiryReply {
  active?: boolean;
  attendee?: User;
  comment?: string;
  createdAt?: string;
  createdBy?: User;
  deletedAt?: string;
  deletedBy?: number;
  id?: number;
  inquiry?: Inquiry;
  isDeleted?: boolean;
  migrated?: boolean;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
}

export interface AssignmentDtoInput {
  assignedTo?: string;
  comment?: string;
  uid?: string;
}

export interface AttendInquiryDtoInput {
  attachmentDtos?: AttachmentDtoInput[];
  comment?: string;
  uid?: string;
}

