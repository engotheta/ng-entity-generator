import { baseGqlFields } from '@shared';
import gql from 'graphql-tag';
import { responseGqlFields } from '@shared';
import { pageGqlFields } from '@shared';

export const paymentRequestGqlFields = `
  amount
  approvalStatus{
    uid
  }
  chapter{
    name
    code
    description
    uid
  }
  contentEditable
  currentApprovalStage{
    title
    commonName
    description
    autoProceedAfterDueDate
    dueDuration
    hasMatchExpression
    uid
  }
  currentApprovalStageAssignedDate
  currentAssignedGroup{
    name
    displayName
    description
    global
    isStaffRole
    isMultipleAssignable
    uid
  }
  currentAssignedUserAccount{
    firstName
    middleName
    lastName
    email
    dateOfBirth
    phone
    uid
  }
  department{
    name
    code
    uid
  }
  description
  endDate
  exchangeRate{
    currencyCode
    enabled
    endOfUse
    expired
    rate
    validUntil
    uid
  }
  finalApprovedBy{
    firstName
    middleName
    lastName
    email
    dateOfBirth
    phone
    uid
  }
  finalApprovedByUsername
  finalApprovedDate
  financialYear{
    closed
    currentFinancialYear
    endDate
    startDate
    uid
  }
  isApprovalCompleted
  items{
    clientName
    employeeName
    clientCode
    description
    amount
    balance
    uid
  }
  migrated
  paymentStatus
  paymentVouchers{
    title
    finalApprovedByUsername
    processName
    description
    accrualEntry
    amount
    uid
  }
  post{
    name
    code
    uid
  }
  processName
  requestNumber
  startDate
  subActivity{
    title
    code
    description
    endDate
    startDate
    weightPercentage
    uid
  }
  systemNumber
  title
  ${baseGqlFields}
`;

//   
//  Mutations
export const SAVE_PAYMENT_REQUEST = gql`
  mutation savePaymentRequest($input: PaymentRequestDtoInput!){
   savePaymentRequest(input: $input) {
      ${responseGqlFields(paymentRequestGqlFields)}
    }
  }
 `;

export const SIMPLE_APPROVE_PAYMENT_REQUEST = gql`
  mutation simpleApprovePaymentRequest($uid: String!, $bankAccountUid: String!){
   simpleApprovePaymentRequest(uid: $uid, bankAccountUid: $bankAccountUid) {
      ${responseGqlFields(paymentRequestGqlFields)}
    }
  }
 `;

export const DELETE_PAYMENT_REQUEST = gql`
  mutation deletePaymentRequest($uid: String!){
   deletePaymentRequest(uid: $uid) {
      ${responseGqlFields(paymentRequestGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_PAYMENT_REQUEST = gql`
  query allPaymentRequest{
   allPaymentRequest {
      ${paymentRequestGqlFields}
    }
  }
 `;

export const ALL_PAYMENT_REQUEST_PAGEABLE = gql`
  query allPaymentRequestPageable($pageableParam: PageableParamInput, $active: Boolean){
   allPaymentRequestPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(paymentRequestGqlFields)}
    }
  }
 `;

export const FIND_PAYMENT_REQUEST = gql`
  query findPaymentRequest($uid: String!){
   findPaymentRequest(uid: $uid) {
      ${responseGqlFields(paymentRequestGqlFields)}
    }
  }
 `;

