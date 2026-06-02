import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const opinionRegistrationGqlFields = `
  active
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
  findingStatus
  id
  isDeleted
  migrated
  name
  nature
  resolutionStatus
  uid
  updatedAt
  updatedBy
  valueObtained
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_OPINION_REGISTRATION = gql`
  mutation saveOrUpdateOpinionRegistration($opinionRegistrationDto: OpinionRegistrationDtoInput){
   saveOrUpdateOpinionRegistration(opinionRegistrationDto: $opinionRegistrationDto) {
      ${responseGqlFields(opinionRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const MY_OPINION_REGISTRATIONS_PAGEABLE = gql`
  query myOpinionRegistrationsPageable($pageableParam: PageableParamInput){
   myOpinionRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(opinionRegistrationGqlFields)}
    }
  }
 `;

export const ALL_OPINION_REGISTRATIONS_PAGEABLE = gql`
  query allOpinionRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allOpinionRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(opinionRegistrationGqlFields)}
    }
  }
 `;

export const GET_OPINION_REGISTRATION_BY_UID = gql`
  query getOpinionRegistrationByUid($uid: String){
   getOpinionRegistrationByUid(uid: $uid) {
      ${responseGqlFields(opinionRegistrationGqlFields)}
    }
  }
 `;

