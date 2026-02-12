import { Attorney } from '@features/portal/profile/profile.interface'

export interface AcademicQualification {
  active: boolean;
  county: Country;
  createdAt?: string;
  createdBy?: number;
  deleted: boolean;
  deletedAt?: string;
  institution: string;
  level: AcademicQualificationsLevel;
  programName: string;
  receivedBy: Attorney;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  yearObtained: number;
  areas?: AcademicQualificationAreaResponse[];
  attorney?: string;
  attorneyId?: string;
  country?: string;
  countryId?: string;
  levelId?: string;
  uuid?: string;
}

export interface AcademicQualificationFilterInput {
  active?: boolean;
  attorney?: string;
  country?: string;
  id?: number;
  level?: string;
  uid?: string;
}

export interface AcademicQualificationRequestInput {
  areaIds: string[];
  attorney: string;
  country: string;
  id?: string;
  institution: string;
  level: string;
  programName: string;
  yearObtained: number;
}

