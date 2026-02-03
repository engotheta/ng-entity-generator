import { baseGqlFields, pageGqlFields, responseGqlFields } from '@shared';
import gql from 'graphql-tag';

export const taxRateGqlFields = `
  ${baseGqlFields}
`;

//   
//  Mutations
export const SAVE_CLIENT_CATEGORY = gql`
   mutation saveClientCategory($input: ClientCategoryDtoInput!){
     saveClientCategory(input: $input) {
      ${responseGqlFields(taxRateGqlFields)}
     }
   }
 `;

export const DELETE_CLIENT_CATEGORY = gql`
   mutation deleteClientCategory($uid: String!){
     deleteClientCategory(uid: $uid) {
      ${responseGqlFields(taxRateGqlFields)}
     }
   }
 `;

//  Queries
export const ALL_CLIENT_CATEGORY_PAGEABLE = gql`
   query allClientCategoryPageable($pageableParam: PageableParamInput, $active: Boolean){
     allClientCategoryPageable(pageableParam: $pageableParam, active: $active) {
      ${responseGqlFields(taxRateGqlFields)}
     }
   }
 `;

export const FIND_CLIENT_CATEGORY = gql`
   query findClientCategory($uid: String!){
     findClientCategory(uid: $uid) {
      ${responseGqlFields(taxRateGqlFields)}
     }
   }
 `;

export const ALL_CLIENT_CATEGORY = gql`
   query allClientCategory{
     allClientCategory {
      ${taxRateGqlFields}
     }
   }
 `;

