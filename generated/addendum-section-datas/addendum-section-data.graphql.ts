import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const addendumSectionDataGqlFields = `
  action
  createdAt
  description
  name
  updatedAt
  uuid
`;

//   
//  Mutations
export const RESTORE_ADDENDUM_SECTION_DATA = gql`
  mutation restoreAddendumSectionData($uuid: UUID!){
   restoreAddendumSectionData(uuid: $uuid) {
      ${responseGqlFields(addendumSectionDataGqlFields)}
    }
  }
 `;

export const SAVE_OR_UPDATE_ADDENDUM_SECTION_DATA = gql`
  mutation saveOrUpdateAddendumSectionData($input: AddendumSectionDataRequestInput!){
   saveOrUpdateAddendumSectionData(input: $input) {
      ${responseGqlFields(addendumSectionDataGqlFields)}
    }
  }
 `;

export const DELETE_ADDENDUM_SECTION_DATA = gql`
  mutation deleteAddendumSectionData($uuid: UUID!){
   deleteAddendumSectionData(uuid: $uuid) {
      ${responseGqlFields(addendumSectionDataGqlFields)}
    }
  }
 `;

//  Queries
export const GET_ADDENDUM_SECTION_DATA_BY_UID = gql`
  query getAddendumSectionDataByUid($uuid: UUID!){
   getAddendumSectionDataByUid(uuid: $uuid) {
      ${responseGqlFields(addendumSectionDataGqlFields)}
    }
  }
 `;

export const GET_ADDENDUM_SECTION_DATA_BY_SECTION = gql`
  query getAddendumSectionDataBySection($sectionUid: UUID!){
   getAddendumSectionDataBySection(sectionUid: $sectionUid) {
      ${responseGqlFields(addendumSectionDataGqlFields)}
    }
  }
 `;

