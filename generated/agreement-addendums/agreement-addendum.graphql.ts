import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { plainResponseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const attachmentConfigResponseGqlFields = `
  active
  attachmentType{
    name
    code
    description
  }
  description
  entityType
  label
  maxFiles
  uuid
`;

export const agreementAddendumGqlFields = `
  addendumNumber
  createdAt
  reasons
  status
  updatedAt
  uuid
  versionNumber
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_ADDENDUM = gql`
  mutation saveOrUpdateAddendum($input: AgreementAddendumRequestInput!){
   saveOrUpdateAddendum(input: $input) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

export const DELETE_ADDENDUM = gql`
  mutation deleteAddendum($uid: UUID){
   deleteAddendum(uid: $uid) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

export const RESTORE_ADDENDUM = gql`
  mutation restoreAddendum($uid: UUID){
   restoreAddendum(uid: $uid) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

export const SAVE_ADDENDUM_ATTACHMENTS = gql`
  mutation saveAddendumAttachments($input: AddendumAttachmentsRequestInput){
   saveAddendumAttachments(input: $input) {
      ${plainResponseGqlFields}
    }
  }
 `;

//  Queries
export const GET_ADDENDUM_BY_NUMBER = gql`
  query getAddendumByNumber($addendumNumber: String){
   getAddendumByNumber(addendumNumber: $addendumNumber) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

export const GET_ADDENDUM_BY_UID = gql`
  query getAddendumByUid($addendumUid: UUID){
   getAddendumByUid(addendumUid: $addendumUid) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

export const LIST_ATTACHMENT_CONFIG_ADDENDUM = gql`
  query listAttachmentConfigAddendum{
   listAttachmentConfigAddendum {
      ${responseGqlFields(attachmentConfigResponseGqlFields)}
    }
  }
 `;

export const GET_ADDENDUMS_PAGINATED = gql`
  query getAddendumsPaginated($size: Int = 10, $page: Int = 0, $status: AddendumStatus){
   getAddendumsPaginated(size: $size, page: $page, status: $status) {
      ${responseGqlFields(pageGqlFields(agreementAddendumGqlFields))}
    }
  }
 `;

export const GET_ADDENDUMS_BY_AGREEMENT = gql`
  query getAddendumsByAgreement($agreementUid: UUID){
   getAddendumsByAgreement(agreementUid: $agreementUid) {
      ${responseGqlFields(agreementAddendumGqlFields)}
    }
  }
 `;

