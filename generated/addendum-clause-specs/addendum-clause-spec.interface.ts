
export interface AddendumClauseSpec {
  createdAt?: string;
  refSpecificationId?: number;
  requiredData?: string;
  specification?: string;
  updatedAt?: string;
  uuid?: string;
}

export interface AddendumClauseSpecRequestInput {
  addendumClauseUid: string;
  refSpecificationUid?: string;
  requiredData: string;
  specification: string;
  uuid?: string;
}

