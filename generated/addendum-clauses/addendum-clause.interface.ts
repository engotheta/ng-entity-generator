
export interface AddendumClause {
  action?: string;
  clauseNumber?: string;
  clauseOrder?: number;
  clauseText?: string;
  clauseTitle?: string;
  isMandatory?: boolean;
  isNegotiable?: boolean;
  refClauseId?: number;
  uuid?: string;
}

export interface AddendumClauseRequestInput {
  action: AddendumAction;
  addendumSectionUid: string;
  clauseNumber?: string;
  clauseOrder?: number;
  clauseText: string;
  clauseTitle: string;
  isMandatory?: boolean;
  isNegotiable?: boolean;
  legalReference?: string;
  reasonForAmendment: string;
  refClauseUid?: string;
  uuid?: string;
}

