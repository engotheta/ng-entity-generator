import { User } from '@features/portal/profile/profile.interface'

export interface Inquiry {
  active?: boolean;
  attendee?: User;
  clientName?: string;
  closedBy?: User;
  createdAt?: string;
  createdBy?: User;
  createdById?: number;
  deletedAt?: string;
  deletedBy?: number;
  deletedId?: number;
  description?: string;
  destination?: InquiryNature;
  district?: District;
  followupInquiry?: Inquiry;
  id?: number;
  inquiryCategory?: InquiryCategory;
  isDeleted?: boolean;
  migrated?: boolean;
  nature?: InquiryNature;
  phone?: string;
  priority?: InquiryPriority;
  region?: Region;
  status?: InquiryStatus;
  subWard?: SubWard;
  trackingId?: string;
  type?: InquiryType;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  ward?: Ward;
}

export interface InquiryDtoInput {
  attachments?: AttachmentDtoInput[];
  clientName?: string;
  description?: string;
  destination?: InquiryNature;
  inquiryCategory?: InquiryCategory;
  nature?: InquiryNature;
  phone?: string;
  priority?: InquiryPriority;
  subWardUid?: string;
  trackingId?: string;
  type?: InquiryType;
  uid?: string;
}

export enum InquiryNature {
  BILLING = 'BILLING',
  COMPLIMENT = 'COMPLIMENT',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  OTHER = 'OTHER',
  SAFETY = 'SAFETY',
  SECURITY = 'SECURITY',
  SUGGESTION = 'SUGGESTION',
  SUPPLY = 'SUPPLY',
  TECHNICAL = 'TECHNICAL',
}
export enum InquiryCategory {
  CNG = 'CNG',
  COMMUNITY = 'COMMUNITY',
  HOUSEHOLD = 'HOUSEHOLD',
  INDUSTRY = 'INDUSTRY',
  INSTITUTION = 'INSTITUTION',
  PLANT = 'PLANT',
}
export enum InquiryPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  NORMAL = 'NORMAL',
}
export enum InquiryStatus {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
}
export enum InquiryType {
  COMPLAINT = 'COMPLAINT',
  FEEDBACK = 'FEEDBACK',
}
