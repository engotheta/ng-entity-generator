import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { plainResponseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const areaGqlFields = `
  active
  code
  description
  name
  uuid
`;

//   
//  Mutations
export const CREATE_AREA = gql`
  mutation createArea($ent: AreaRequestInput){
   createArea(ent: $ent) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const CHANGE_AREA_STATUS = gql`
  mutation changeAreaStatus($id: UUID){
   changeAreaStatus(id: $id) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const ADD_AREAS_TO_TASK = gql`
  mutation addAreasToTask($taskUuid: UUID!, $areaUuids: [UUID]!){
   addAreasToTask(taskUuid: $taskUuid, areaUuids: $areaUuids) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const REMOVE_AREA_FROM_TASK = gql`
  mutation removeAreaFromTask($uuid: UUID!){
   removeAreaFromTask(uuid: $uuid) {
      ${plainResponseGqlFields}
    }
  }
 `;

export const ADD_AREA_TO_TASK = gql`
  mutation addAreaToTask($request: TaskAreaRequestInput){
   addAreaToTask(request: $request) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const REPLACE_AREAS_FOR_TASK = gql`
  mutation replaceAreasForTask($taskUuid: UUID!, $areaUuids: [UUID]!){
   replaceAreasForTask(taskUuid: $taskUuid, areaUuids: $areaUuids) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const DELETE_AREA = gql`
  mutation deleteArea($id: UUID){
   deleteArea(id: $id) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

//  Queries
export const COUNT_TASKS_BY_AREA = gql`
  query countTasksByArea($areaUuid: UUID!){
   countTasksByArea(areaUuid: $areaUuid) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const COUNT_AREAS_BY_TASK = gql`
  query countAreasByTask($taskUuid: UUID!){
   countAreasByTask(taskUuid: $taskUuid) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const FIND_AREA_BY_ID = gql`
  query findAreaById($id: UUID){
   findAreaById(id: $id) {
      ${responseGqlFields(areaGqlFields)}
    }
  }
 `;

export const SEARCH_AREA = gql`
  query searchArea($filter: AreaFilterInput, $pagination: PaginationInput){
   searchArea(filter: $filter, pagination: $pagination) {
      ${pageGqlFields(areaGqlFields)}
    }
  }
 `;

