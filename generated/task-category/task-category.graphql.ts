import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const taskCategoryResponseGqlFields = `
  active
  code
  createdAt
  description
  name
  updatedAt
  uuid
`;

export const taskCategoryGqlFields = `
  active
  code
  description
  name
  createdAt
  updatedAt
  uuid
`;

//   
//  Mutations
export const CREATE_OR_UPDATE_TASK_CATEGORY = gql`
  mutation createOrUpdateTaskCategory($request: TaskCategoryRequestInput){
   createOrUpdateTaskCategory(request: $request) {
      ${responseGqlFields(taskCategoryGqlFields)}
    }
  }
 `;

export const DELETE_TASK_CATEGORY = gql`
  mutation deleteTaskCategory($id: UUID){
   deleteTaskCategory(id: $id) {
      ${responseGqlFields(taskCategoryGqlFields)}
    }
  }
 `;

export const CHANGE_TASK_CATEGORY_STATUS = gql`
  mutation changeTaskCategoryStatus($id: UUID){
   changeTaskCategoryStatus(id: $id) {
      ${responseGqlFields(taskCategoryGqlFields)}
    }
  }
 `;

//  Queries
export const GET_ALL_TASK_CATEGORIES = gql`
  query getAllTaskCategories{
   getAllTaskCategories {
      ${taskCategoryResponseGqlFields}
    }
  }
 `;

export const SEARCH_TASK_CATEGORIES = gql`
  query searchTaskCategories($filter: TaskCategoryFilterInput){
   searchTaskCategories(filter: $filter) {
      ${taskCategoryResponseGqlFields}
    }
  }
 `;

export const FIND_TASK_CATEGORY_BY_ID = gql`
  query findTaskCategoryById($id: UUID){
   findTaskCategoryById(id: $id) {
      ${responseGqlFields(taskCategoryGqlFields)}
    }
  }
 `;

