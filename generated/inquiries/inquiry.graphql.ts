import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/utilities/data.gql';

export const inquiryGqlFields = `
  active
  attendee{
    fullName
    username
    activationExpires
    activationToken
    alternativePhone
    email
  }
  clientName
  closedBy{
    fullName
    username
    activationExpires
    activationToken
    alternativePhone
    email
  }
  createdAt
  createdBy{
    fullName
    username
    activationExpires
    activationToken
    alternativePhone
    email
  }
  createdById
  deletedAt
  deletedBy
  deletedId
  description
  destination
  followupInquiry{
    clientName
    description
    phone
    trackingId
  }
  id
  inquiryCategory
  isDeleted
  migrated
  nature
  phone
  priority
  status
  trackingId
  type
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_INQUIRY = gql`
  mutation saveOrUpdateInquiry($inquiryDto: InquiryDtoInput){
   saveOrUpdateInquiry(inquiryDto: $inquiryDto) {
      ${responseGqlFields(inquiryGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_INQUIRIES_PAGEABLE = gql`
  query allInquiriesPageable($pageableParam: PageableParamInput, $active: Boolean){
   allInquiriesPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(inquiryGqlFields)}
    }
  }
 `;

export const GET_INQUIRIES = gql`
  query getInquiries{
   getInquiries {
      ${inquiryGqlFields}
    }
  }
 `;

export const GET_INQUIRY_BY_UID = gql`
  query getInquiryByUid($uid: String){
   getInquiryByUid(uid: $uid) {
      ${responseGqlFields(inquiryGqlFields)}
    }
  }
 `;

export const CLOSE_INQUIRY = gql`
  query closeInquiry($uid: String){
   closeInquiry(uid: $uid) {
      ${responseGqlFields(inquiryGqlFields)}
    }
  }
 `;

