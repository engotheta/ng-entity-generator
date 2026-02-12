import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const responsibilityResponseGqlFields = `
  active
  description
  name
  uuid
`;

export const responsibilityGqlFields = `
  active
  description
  name
`;

//   
//  Mutations
export const CHANGE_RESPONSIBILITY_STATUS = gql`
  mutation changeResponsibilityStatus($id: UUID){
   changeResponsibilityStatus(id: $id) {
      ${responseGqlFields(responsibilityGqlFields)}
    }
  }
 `;

export const DELETE_RESPONSIBILITY = gql`
  mutation deleteResponsibility($id: UUID){
   deleteResponsibility(id: $id) {
      ${responseGqlFields(responsibilityGqlFields)}
    }
  }
 `;

export const CREATE_RESPONSIBILITY = gql`
  mutation createResponsibility($ent: ResponsibilityRequestInput){
   createResponsibility(ent: $ent) {
      ${responseGqlFields(responsibilityGqlFields)}
    }
  }
 `;

//  Queries
export const FIND_RESPONSIBILITY_BY_ID = gql`
  query findResponsibilityById($id: UUID){
   findResponsibilityById(id: $id) {
      ${responseGqlFields(responsibilityGqlFields)}
    }
  }
 `;

export const SEARCH_RESPONSIBILITY = gql`
  query searchResponsibility($filter: ResponsibilityFilterInput, $pagination: PaginationInput){
   searchResponsibility(filter: $filter, pagination: $pagination) {
      ${pageGqlFields(responsibilityResponseGqlFields)}
    }
  }
 `;

