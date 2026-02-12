import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const academicQualificationLevelResponseGqlFields = `
  active
  code
  name
  uuid
`;

//   
//  Mutations
export const CHANGE_ACADEMIC_QUALIFICATION_LEVEL_STATUS = gql`
  mutation changeAcademicQualificationLevelStatus($id: UUID){
   changeAcademicQualificationLevelStatus(id: $id) {
      ${responseGqlFields(academicQualificationLevelGqlFields)}
    }
  }
 `;

export const DELETE_ACADEMIC_QUALIFICATION_LEVEL = gql`
  mutation deleteAcademicQualificationLevel($id: UUID){
   deleteAcademicQualificationLevel(id: $id) {
      ${responseGqlFields(academicQualificationLevelGqlFields)}
    }
  }
 `;

export const CREATE_ACADEMIC_QUALIFICATION_LEVEL = gql`
  mutation createAcademicQualificationLevel($ent: AcademicQualificationLevelRequestInput){
   createAcademicQualificationLevel(ent: $ent) {
      ${responseGqlFields(academicQualificationLevelGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_ACADEMIC_QUALIFICATION_LEVEL_BY_ID = gql`
  query findAcademicQualificationLevelById($id: UUID){
   findAcademicQualificationLevelById(id: $id) {
      ${responseGqlFields(academicQualificationLevelGqlFields)}
    }
  }
 `;

export const SEARCH_ACADEMIC_QUALIFICATION_LEVEL = gql`
  query searchAcademicQualificationLevel($filter: AcademicQualificationLevelFilterInput){
   searchAcademicQualificationLevel(filter: $filter) {
      ${academicQualificationLevelResponseGqlFields}
    }
  }
 `;

