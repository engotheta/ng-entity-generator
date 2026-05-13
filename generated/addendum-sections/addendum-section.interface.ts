
export interface AddendumSection {
  action?: string;
  hasClause?: boolean;
  layoutSectionId?: number;
  modificationNotes?: string;
  modifiedSectionTitle?: string;
  refAgreementSectionId?: number;
  sectionTitle?: string;
  sequenceOrder?: number;
  uuid?: string;
}

export interface AddendumSectionRequestInput {
  action: AddendumAction;
  addendumUid: string;
  hasClause: boolean;
  layoutSectionUid: string;
  modificationNotes: string;
  modifiedSectionTitle?: string;
  refAgreementSectionUid?: string;
  sectionTitle?: string;
  sequenceOrder?: number;
  uuid?: string;
}

