import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const inquiryAssignmentGqlFields = `
  active
  assignedBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  assignee{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  comment
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  current
  deletedAt
  deletedBy
  id
  isDeleted
  migrated
  uid
  updatedAt
  updatedBy
`;

export const inquiryReplyGqlFields = `
  active
  attendee{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  comment
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  deletedAt
  deletedBy
  id
  isDeleted
  migrated
  uid
  updatedAt
  updatedBy
`;

export const inquiryGqlFields = `
  active
`;

//   
//  Mutations
export const ASSIGN_INQUIRY = gql`
  mutation assignInquiry($assignmentDto: AssignmentDtoInput){
   assignInquiry(assignmentDto: $assignmentDto) {
      ${responseGqlFields(inquiryGqlFields)}
    }
  }
 `;

export const ATTEND_INQUIRY = gql`
  mutation attendInquiry($attendInquiryDto: AttendInquiryDtoInput){
   attendInquiry(attendInquiryDto: $attendInquiryDto) {
      ${responseGqlFields(inquiryGqlFields)}
    }
  }
 `;

//  Queries
export const MY_INQUIRY_ASSIGNMENT_PAGEABLE = gql`
  query myInquiryAssignmentPageable($pageableParam: PageableParamInput){
   myInquiryAssignmentPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(inquiryAssignmentGqlFields)}
    }
  }
 `;

export const SUBMITTED_INQUIRIES_PAGEABLE = gql`
  query submittedInquiriesPageable($pageableParam: PageableParamInput){
   submittedInquiriesPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(inquiryGqlFields)}
    }
  }
 `;

export const GET_INQUIRY_REPLIES = gql`
  query getInquiryReplies($uid: String){
   getInquiryReplies(uid: $uid) {
      ${inquiryReplyGqlFields}
    }
  }
 `;

