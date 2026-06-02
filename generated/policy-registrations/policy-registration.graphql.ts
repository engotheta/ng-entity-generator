import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const policyRegistrationGqlFields = `
  active
  applicability
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  dateOfReview
  deletedAt
  deletedBy
  endorsementDate
  expirationDate
  id
  isDeleted
  migrated
  name
  reviewStatus
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_POLICY_REGISTRATION = gql`
  mutation saveOrUpdatePolicyRegistration($policyRegistrationDto: PolicyRegistrationDtoInput){
   saveOrUpdatePolicyRegistration(policyRegistrationDto: $policyRegistrationDto) {
      ${responseGqlFields(policyRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_POLICY_REGISTRATIONS_PAGEABLE = gql`
  query allPolicyRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allPolicyRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(policyRegistrationGqlFields)}
    }
  }
 `;

export const GET_POLICY_REGISTRATION_BY_UID = gql`
  query getPolicyRegistrationByUid($uid: String){
   getPolicyRegistrationByUid(uid: $uid) {
      ${responseGqlFields(policyRegistrationGqlFields)}
    }
  }
 `;

export const MY_POLICY_REGISTRATIONS_PAGEABLE = gql`
  query myPolicyRegistrationsPageable($pageableParam: PageableParamInput){
   myPolicyRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(policyRegistrationGqlFields)}
    }
  }
 `;

