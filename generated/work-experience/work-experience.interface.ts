import { Attorney } from '@features/portal/profile/profile.interface'
import { WorkingExperienceAreaResponse } from '@features/portal/attorney-cv/attorney-cv.interface'

export interface WorkExperience {
  active: boolean;
  attorney: Attorney;
  createdAt?: string;
  createdBy?: number;
  currentlyWorkingHere: boolean;
  deleted: boolean;
  deletedAt?: string;
  endDate?: string;
  institutionName: string;
  position: string;
  startDate: string;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  areas?: WorkingExperienceAreaResponse[];
  attorneyId?: string;
  responsibilities?: string;
  uuid?: string;
}

export interface WorkExperienceFilterInput {
  active?: boolean;
  attorney?: string;
  id?: number;
  uid?: string;
}

export interface WorkExperienceRequestInput {
  attorney: string;
  currentlyWorkingHere: boolean;
  endDate?: string;
  id?: string;
  institutionName: string;
  position: string;
  responsibilities: string[];
  startDate: string;
}

