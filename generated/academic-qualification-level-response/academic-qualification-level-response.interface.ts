
export interface AcademicQualificationLevelFilterInput {
  active?: boolean;
  code?: string;
  id?: number;
  name?: string;
  uid?: string;
}

export interface AcademicQualificationLevelRequestInput {
  code: string;
  id?: string;
  name: string;
}

export interface AcademicQualificationLevel {
  active: boolean;
  code: string;
  createdAt?: string;
  createdBy?: number;
  deleted: boolean;
  deletedAt?: string;
  name: string;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  uuid?: string;
}

