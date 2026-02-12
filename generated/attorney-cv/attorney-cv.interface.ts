
export interface AttorneyCv {
  academicQualifications?: AcademicQualificationResponse[];
  attorney?: string;
  attorneyId?: string;
  checkNumber?: string;
  competencyAwards?: CompetencyResponse[];
  email?: string;
  handledCases?: AttorneyCaseResponse[];
  hireDate?: string;
  memberships?: MembershipMinimal[];
  recategorizationDate?: string;
  rollNumber?: string;
  sex?: string;
  trainings?: TrainingMinimal[];
  transfers?: AttorneyTransferResponse[];
  workExperiences?: WorkExperienceResponse[];
}

export interface AcademicQualificationResponse {
  active?: boolean;
  areas?: AcademicQualificationAreaResponse[];
  attorney?: string;
  attorneyId?: string;
  country?: string;
  countryId?: string;
  institution?: string;
  level?: string;
  levelId?: string;
  programName?: string;
  uuid?: string;
  yearObtained?: number;
}

export interface AcademicQualificationAreaResponse {
  academicQualificationId?: string;
  area?: string;
  areaId?: string;
}

export interface CompetencyResponse {
  active?: boolean;
  areas?: CompetencyAreaResponse[];
  attorney?: string;
  attorneyId?: string;
  awardTitle?: string;
  awardedYear?: number;
  awarder?: string;
  uuid?: string;
}

export interface CompetencyAreaResponse {
  area?: string;
  areaId?: string;
  competencyId?: string;
}

export interface AttorneyCaseResponse {
  amountClaimed?: number;
  attorneyName?: string;
  attorneyUid?: string;
  caseBrief?: string;
  caseCategory?: string;
  caseCode?: string;
  caseNo?: string;
  caseType?: string;
  caseUid?: string;
  court?: string;
  filingDate?: string;
  id?: number;
  referenceNo?: string;
  responsibilities?: string;
  role?: string;
  won?: boolean;
}

export interface MembershipMinimal {
  active?: boolean;
  currentlyMember?: boolean;
  description?: string;
  endDate?: string;
  membershipTypeUuid?: string;
  name?: string;
  responsibilities?: string;
  role?: string;
  startDate?: string;
  type?: string;
  uuid?: string;
}

export interface TrainingMinimal {
  active?: boolean;
  areas?: TrainingAreaResponse[];
  attorneyId?: string;
  description?: string;
  trainedAt?: string;
  trainedBy?: string;
  trainedTopic?: string;
  uuid?: string;
}

export interface AttorneyTransferResponse {
  active?: boolean;
  attorneyId?: string;
  institution?: string;
  institutionId?: string;
  joinedAt?: string;
  leftAt?: string;
  uuid?: string;
}

export interface WorkExperienceResponse {
  active?: boolean;
  areas?: WorkingExperienceAreaResponse[];
  attorney?: string;
  attorneyId?: string;
  currentlyWorkingHere?: boolean;
  endDate?: string;
  institutionName?: string;
  position?: string;
  responsibilities?: string;
  startDate?: string;
  uuid?: string;
}

export interface WorkingExperienceAreaResponse {
  area?: string;
  areaId?: string;
  workingExperienceId?: string;
}

export interface TrainingAreaResponse {
  area?: string;
  areaId?: string;
  trainingId?: string;
}

