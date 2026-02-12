import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const academicQualificationResponseGqlFields = `
  active
  areas{
    academicQualificationId
    area
    areaId
  }
  attorney
  attorneyId
  country
  countryId
  institution
  level
  levelId
  programName
  uuid
  yearObtained
`;

export const academicQualificationGqlFields = `
  active
  createdAt
  createdBy
  deleted
  deletedAt
  institution
  programName
  receivedBy{
    departmentName
    designationName
    jobClassName
    organizationName
    sectionName
    departmentCode
  }
  uid
  updatedAt
  updatedBy
  yearObtained
`;

//   
//  Mutations
export const DELETE_ACADEMIC_QUALIFICATION = gql`
  mutation deleteAcademicQualification($id: UUID){
   deleteAcademicQualification(id: $id) {
      ${responseGqlFields(academicQualificationGqlFields)}
    }
  }
 `;

export const CHANGE_ACADEMIC_QUALIFICATION_STATUS = gql`
  mutation changeAcademicQualificationStatus($id: UUID){
   changeAcademicQualificationStatus(id: $id) {
      ${responseGqlFields(academicQualificationGqlFields)}
    }
  }
 `;

export const CREATE_ACADEMIC_QUALIFICATION = gql`
  mutation createAcademicQualification($ent: AcademicQualificationRequestInput){
   createAcademicQualification(ent: $ent) {
      ${responseGqlFields(academicQualificationGqlFields)}
    }
  }
 `;

//  Queries
export const SEARCH_ACADEMIC_QUALIFICATION = gql`
  query searchAcademicQualification($filter: AcademicQualificationFilterInput, $pagination: PaginationInput){
   searchAcademicQualification(filter: $filter, pagination: $pagination) {
      ${pageGqlFields(academicQualificationResponseGqlFields)}
    }
  }
 `;

export const FIND_ACADEMIC_QUALIFICATION_BY_ID = gql`
  query findAcademicQualificationById($id: UUID){
   findAcademicQualificationById(id: $id) {
      ${responseGqlFields(academicQualificationGqlFields)}
    }
  }
 `;

