import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const insuranceRegistrationGqlFields = `
  active
  coverage
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
  duration
  endDate
  id
  insuranceType
  isDeleted
  migrated
  nameOfAsset
  startDate
  statusOfIncident
  uid
  updatedAt
  updatedBy
  value
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_INSURANCE_REGISTRATION = gql`
  mutation saveOrUpdateInsuranceRegistration($insuranceRegistrationDto: InsuranceRegistrationDtoInput){
   saveOrUpdateInsuranceRegistration(insuranceRegistrationDto: $insuranceRegistrationDto) {
      ${responseGqlFields(insuranceRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_INSURANCE_REGISTRATIONS_PAGEABLE = gql`
  query allInsuranceRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allInsuranceRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(insuranceRegistrationGqlFields)}
    }
  }
 `;

export const MY_INSURANCE_REGISTRATIONS_PAGEABLE = gql`
  query myInsuranceRegistrationsPageable($pageableParam: PageableParamInput){
   myInsuranceRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(insuranceRegistrationGqlFields)}
    }
  }
 `;

export const GET_INSURANCE_REGISTRATION_BY_UID = gql`
  query getInsuranceRegistrationByUid($uid: String){
   getInsuranceRegistrationByUid(uid: $uid) {
      ${responseGqlFields(insuranceRegistrationGqlFields)}
    }
  }
 `;

