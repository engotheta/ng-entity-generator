import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const plantReceivedDataGqlFields = `
  active
  availableCapacity
  client{
    contactPersonName
    code
    accountNumber
    approvalComments
    approvedAt
    approvedById
  }
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  createdById
  deletedAt
  deletedBy
  deletedId
  flaredGas
  id
  isDeleted
  migrated
  ownUseGas
  plant{
    name
    code
    blockNumber
    dailyProductionCapacityMmscfd
    physicalAddress
    postalAddress
  }
  producedGas
  receivedRawGasPressure
  receivedRawGasTemperature
  receivedRawGasVolume
  uid
  updatedAt
  updatedBy
  utilizedCapacity
`;

//   
//  Mutations
export const SAVE_PLANT_PROCESSING_DATA = gql`
  mutation savePlantProcessingData($input: PlantReceivedDataDtoInput!){
   savePlantProcessingData(input: $input) {
      ${responseGqlFields(plantReceivedDataGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_PLANT_PROCESSING_DATA = gql`
  query findPlantProcessingData($uid: String!){
   findPlantProcessingData(uid: $uid) {
      ${responseGqlFields(plantReceivedDataGqlFields)}
    }
  }
 `;

export const ALL_PLANT_PROCESSING_DATA_PAGEABLE = gql`
  query allPlantProcessingDataPageable($pageableParam: PageableParamInput, $active: Boolean){
   allPlantProcessingDataPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(plantReceivedDataGqlFields)}
    }
  }
 `;

