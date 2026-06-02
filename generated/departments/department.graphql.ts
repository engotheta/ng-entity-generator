import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const departmentGqlFields = `
  active
  code
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
  id
  isDeleted
  migrated
  name
  uid
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const DELETE_DEPARTMENT = gql`
  mutation deleteDepartment($uid: String){
   deleteDepartment(uid: $uid) {
      ${responseGqlFields(departmentGqlFields)}
    }
  }
 `;

export const SAVE_DEPARTMENT = gql`
  mutation saveDepartment($dto: DepartmentDtoInput){
   saveDepartment(dto: $dto) {
      ${responseGqlFields(departmentGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_DEPARTMENT = gql`
  query findDepartment($uid: String){
   findDepartment(uid: $uid) {
      ${responseGqlFields(departmentGqlFields)}
    }
  }
 `;

export const ALL_DEPARTMENTS_PAGEABLE = gql`
  query allDepartmentsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allDepartmentsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(departmentGqlFields)}
    }
  }
 `;

export const ALL_DEPARTMENTS = gql`
  query allDepartments{
   allDepartments {
      ${departmentGqlFields}
    }
  }
 `;

