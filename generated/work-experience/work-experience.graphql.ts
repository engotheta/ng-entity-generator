import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const workExperienceResponseGqlFields = `
  active
  areas{
    area
    areaId
    workingExperienceId
  }
  attorney
  attorneyId
  currentlyWorkingHere
  endDate
  institutionName
  position
  responsibilities
  startDate
  uuid
`;

export const workExperienceGqlFields = `
  active
  attorney{
    departmentName
    designationName
    jobClassName
    organizationName
    sectionName
    departmentCode
  }
  createdAt
  createdBy
  currentlyWorkingHere
  deleted
  deletedAt
  endDate
  institutionName
  position
  startDate
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const DELETE_WORK_EXPERIENCE = gql`
  mutation deleteWorkExperience($id: UUID){
   deleteWorkExperience(id: $id) {
      ${responseGqlFields(workExperienceGqlFields)}
    }
  }
 `;

export const CHANGE_WORK_EXPERIENCE_STATUS = gql`
  mutation changeWorkExperienceStatus($id: UUID){
   changeWorkExperienceStatus(id: $id) {
      ${responseGqlFields(workExperienceGqlFields)}
    }
  }
 `;

export const CREATE_WORK_EXPERIENCE = gql`
  mutation createWorkExperience($ent: WorkExperienceRequestInput){
   createWorkExperience(ent: $ent) {
      ${responseGqlFields(workExperienceGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_WORK_EXPERIENCE_BY_ID = gql`
  query findWorkExperienceById($id: UUID){
   findWorkExperienceById(id: $id) {
      ${responseGqlFields(workExperienceGqlFields)}
    }
  }
 `;

export const SEARCH_WORK_EXPERIENCE = gql`
  query searchWorkExperience($filter: WorkExperienceFilterInput, $pagination: PaginationInput){
   searchWorkExperience(filter: $filter, pagination: $pagination) {
      ${pageGqlFields(workExperienceResponseGqlFields)}
    }
  }
 `;

