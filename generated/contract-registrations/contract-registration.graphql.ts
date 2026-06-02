import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const contractRegistrationGqlFields = `
  active
  amount
  contractDate
  contractManager
  contractNumber
  contractType
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
  executionStatus
  id
  isDeleted
  migrated
  name
  serviceProvider
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_CONTRACT_REGISTRATION = gql`
  mutation saveOrUpdateContractRegistration($contractRegistrationDto: ContractRegistrationDtoInput){
   saveOrUpdateContractRegistration(contractRegistrationDto: $contractRegistrationDto) {
      ${responseGqlFields(contractRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_CONTRACT_REGISTRATIONS_PAGEABLE = gql`
  query allContractRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allContractRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(contractRegistrationGqlFields)}
    }
  }
 `;

export const GET_CONTRACT_REGISTRATION_BY_UID = gql`
  query getContractRegistrationByUid($uid: String){
   getContractRegistrationByUid(uid: $uid) {
      ${responseGqlFields(contractRegistrationGqlFields)}
    }
  }
 `;

export const MY_CONTRACT_REGISTRATIONS_PAGEABLE = gql`
  query myContractRegistrationsPageable($pageableParam: PageableParamInput){
   myContractRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(contractRegistrationGqlFields)}
    }
  }
 `;

