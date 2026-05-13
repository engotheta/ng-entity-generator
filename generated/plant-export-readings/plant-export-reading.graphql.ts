import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const plantExportReadingGqlFields = `
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
  createdById
  deletedAt
  deletedBy
  deletedId
  exportedGas
  id
  isDeleted
  migrated
  pipelineExportFlowRate
  pipelineExportPressure
  pipelineExportTemperature
  plant{
    name
    code
    blockNumber
    dailyProductionCapacityMmscfd
    physicalAddress
    postalAddress
  }
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_PLANT_EXPORT_READING = gql`
  mutation savePlantExportReading($input: PlantExportReadingDtoInput!){
   savePlantExportReading(input: $input) {
      ${responseGqlFields(plantExportReadingGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_PLANT_EXPORT_READING = gql`
  query findPlantExportReading($uid: String!){
   findPlantExportReading(uid: $uid) {
      ${responseGqlFields(plantExportReadingGqlFields)}
    }
  }
 `;

export const ALL_PLANT_EXPORT_READING_PAGEABLE = gql`
  query allPlantExportReadingPageable($pageableParam: PageableParamInput, $active: Boolean){
   allPlantExportReadingPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(plantExportReadingGqlFields)}
    }
  }
 `;

