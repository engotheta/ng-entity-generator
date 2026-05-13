import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const plantWaterReadingGqlFields = `
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
  id
  isDeleted
  migrated
  plant{
    name
    code
    blockNumber
    dailyProductionCapacityMmscfd
    physicalAddress
    postalAddress
  }
  producedCondensate
  producedWater
  uid
  updatedAt
  updatedBy
  waterDewPoint
`;

//   
//  Mutations
export const SAVE_PLANT_WATER_READING = gql`
  mutation savePlantWaterReading($input: PlantWaterReadingDtoInput!){
   savePlantWaterReading(input: $input) {
      ${responseGqlFields(plantWaterReadingGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_PLANT_WATER_READING_PAGEABLE = gql`
  query allPlantWaterReadingPageable($pageableParam: PageableParamInput, $active: Boolean){
   allPlantWaterReadingPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(plantWaterReadingGqlFields)}
    }
  }
 `;

export const FIND_PLANT_WATER_READING = gql`
  query findPlantWaterReading($uid: String!){
   findPlantWaterReading(uid: $uid) {
      ${responseGqlFields(plantWaterReadingGqlFields)}
    }
  }
 `;

