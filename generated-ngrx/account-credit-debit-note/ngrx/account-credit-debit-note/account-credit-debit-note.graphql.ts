import { baseGqlFields } from '@shared';
import gql from 'graphql-tag';
import { responseGqlFields } from '@shared';
import { pageGqlFields } from '@shared';

export const accountCreditDebitNoteGqlFields = `
  amountApplied
  approvalStatus{
    uid
  }
  balance
  client{
    contactPersonName
    name
    code
    acronym
    blockNumber
    contactPersonEmail
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
  invoice{
    finalApprovedByUsername
    processName
    description
    amountReceived
    balance
    contentEditable
    uid
  }
  isApprovalCompleted
  items{
    description
    amount
    quantity
    unitPrice
    uid
  }
  migrated
  noteDate
  noteNumber
  noteType{
    uid
  }
  post{
    name
    code
    uid
  }
  postedAt
  postedBy
  processName
  reason
  receivableAccount{
    code
    description
    creditNature
    disabled
    hasBankAccount
    subAccount
    uid
  }
  referenceNumber
  reversalReason
  reversedAt
  reversedBy
  status
  systemNumber
  totalAmount
  ${baseGqlFields}
`;

//   
//  Mutations
export const SAVE_CREDIT_DEBIT_NOTE = gql`
  mutation saveCreditDebitNote($input: CreditDebitNoteDtoInput!){
   saveCreditDebitNote(input: $input) {
      ${responseGqlFields(accountCreditDebitNoteGqlFields)}
    }
  }
 `;

export const POST_CREDIT_DEBIT_NOTE = gql`
  mutation postCreditDebitNote($uid: String!){
   postCreditDebitNote(uid: $uid) {
      ${responseGqlFields(accountCreditDebitNoteGqlFields)}
    }
  }
 `;

export const REVERSE_CREDIT_DEBIT_NOTE = gql`
  mutation reverseCreditDebitNote($reason: String, $uid: String!, $reversalDate: LocalDate){
   reverseCreditDebitNote(reason: $reason, uid: $uid, reversalDate: $reversalDate) {
      ${responseGqlFields(accountCreditDebitNoteGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_CREDIT_DEBIT_NOTES_PAGEABLE = gql`
  query allCreditDebitNotesPageable($pageableParam: PageableParamInput, $active: Boolean){
   allCreditDebitNotesPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(accountCreditDebitNoteGqlFields)}
    }
  }
 `;

export const ALL_CREDIT_DEBIT_NOTES = gql`
  query allCreditDebitNotes{
   allCreditDebitNotes {
      ${accountCreditDebitNoteGqlFields}
    }
  }
 `;

export const FIND_CREDIT_DEBIT_NOTE = gql`
  query findCreditDebitNote($uid: String!){
   findCreditDebitNote(uid: $uid) {
      ${responseGqlFields(accountCreditDebitNoteGqlFields)}
    }
  }
 `;

