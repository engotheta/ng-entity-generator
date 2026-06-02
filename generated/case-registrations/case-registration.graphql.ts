import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const caseRegistrationGqlFields = `
  active
  amount
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  dateOfSchedules
  decistion
  deletedAt
  deletedBy
  id
  isDeleted
  migrated
  name
  natureOfCase
  responsibleInstitution
  responsibleOfficer{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  uid
  updatedAt
  updatedBy
  year
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_CASE_REGISTRATION = gql`
  mutation saveOrUpdateCaseRegistration($caseRegistrationDto: CaseRegistrationDtoInput){
   saveOrUpdateCaseRegistration(caseRegistrationDto: $caseRegistrationDto) {
      ${responseGqlFields(caseRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const MY_CASE_REGISTRATIONS_PAGEABLE = gql`
  query myCaseRegistrationsPageable($pageableParam: PageableParamInput){
   myCaseRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(caseRegistrationGqlFields)}
    }
  }
 `;

export const ALL_CASE_REGISTRATIONS_PAGEABLE = gql`
  query allCaseRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allCaseRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(caseRegistrationGqlFields)}
    }
  }
 `;

export const GET_CASE_REGISTRATION_BY_UID = gql`
  query getCaseRegistrationByUid($uid: String){
   getCaseRegistrationByUid(uid: $uid) {
      ${responseGqlFields(caseRegistrationGqlFields)}
    }
  }
 `;

