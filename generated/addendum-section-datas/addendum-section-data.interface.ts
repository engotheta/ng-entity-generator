
export interface AddendumSectionData {
  action?: string;
  createdAt?: string;
  description?: string;
  name?: string;
  updatedAt?: string;
  uuid?: string;
}

export interface AddendumSectionDataRequestInput {
  action: AddendumAction;
  addendumSectionUid: string;
  description?: string;
  name?: string;
  refAgreementSectionDatumUid?: string;
  uuid?: string;
}

