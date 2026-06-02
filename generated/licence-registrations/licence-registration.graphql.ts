import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const licenceRegistrationGqlFields = `
  active
  condition
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
  expirationDate
  id
  isDeleted
  migrated
  name
  renewalRequirement
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_LICENCE_REGISTRATION = gql`
  mutation saveOrUpdateLicenceRegistration($licenceRegistrationDto: LicenceRegistrationDtoInput){
   saveOrUpdateLicenceRegistration(licenceRegistrationDto: $licenceRegistrationDto) {
      ${responseGqlFields(licenceRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_LICENCE_REGISTRATIONS_PAGEABLE = gql`
  query allLicenceRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allLicenceRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(licenceRegistrationGqlFields)}
    }
  }
 `;

export const MY_LICENCE_REGISTRATIONS_PAGEABLE = gql`
  query myLicenceRegistrationsPageable($pageableParam: PageableParamInput){
   myLicenceRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(licenceRegistrationGqlFields)}
    }
  }
 `;

export const GET_LICENCE_REGISTRATION_BY_UID = gql`
  query getLicenceRegistrationByUid($uid: String){
   getLicenceRegistrationByUid(uid: $uid) {
      ${responseGqlFields(licenceRegistrationGqlFields)}
    }
  }
 `;

