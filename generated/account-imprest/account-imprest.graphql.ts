import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const accountImprestGqlFields = `
  advanceAccount{
    uid
  }
  amount
  approvalStatus{
    uid
  }
  balance
  bankAccount{
    uid
  }
  contentEditable
  currentApprovalStage{
    uid
  }
  currentApprovalStageAssignedDate
  currentAssignedGroup{
    name
    code
    description
    uid
  }
  currentAssignedUserAccount{
    fullName
    username
    activationExpires
    activationToken
    alternativePhone
    email
    uid
  }
  department{
    uid
  }
  description
  dueDate
  finalApprovedBy{
    fullName
    username
    activationExpires
    activationToken
    alternativePhone
    email
    uid
  }
  finalApprovedByUsername
  finalApprovedDate
  financialYear{
    uid
  }
  holderClient{
    uid
  }
  holderEmployee{
    uid
  }
  isApprovalCompleted
  items{
    description
    amount
    quantity
    unitCost
    uid
  }
  migrated
  post{
    uid
  }
  processName
  referenceNumber
  requestDate
  retiredAmount
  retirements{
    uid
  }
  status
  systemNumber
  title
  ${baseGqlFields}
`;

//   
//  Mutations
export const POST_IMPREST = gql`
  mutation postImprest($uid: String!){
   postImprest(uid: $uid) {
      ${responseGqlFields(accountImprestGqlFields)}
    }
  }
 `;

export const SAVE_IMPREST = gql`
  mutation saveImprest($input: ImprestDtoInput!){
   saveImprest(input: $input) {
      ${responseGqlFields(accountImprestGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_IMPREST = gql`
  query findImprest($uid: String!){
   findImprest(uid: $uid) {
      ${responseGqlFields(accountImprestGqlFields)}
    }
  }
 `;

export const IMPREST_OUTSTANDING = gql`
  query imprestOutstanding($asOf: LocalDate){
   imprestOutstanding(asOf: $asOf) {
      ${accountImprestGqlFields}
    }
  }
 `;

export const ALL_IMPRESTS_PAGEABLE = gql`
  query allImprestsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allImprestsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(accountImprestGqlFields)}
    }
  }
 `;

export const ALL_IMPRESTS = gql`
  query allImprests{
   allImprests {
      ${accountImprestGqlFields}
    }
  }
 `;

