import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const addendumClauseSpecGqlFields = `
  createdAt
  refSpecificationId
  requiredData
  specification
  updatedAt
  uuid
`;

//   
//  Mutations
export const RESTORE_ADDENDUM_CLAUSE_SPECIFICATION = gql`
  mutation restoreAddendumClauseSpecification($addendumClauseSpecUuid: UUID!){
   restoreAddendumClauseSpecification(addendumClauseSpecUuid: $addendumClauseSpecUuid) {
      ${responseGqlFields(addendumClauseSpecGqlFields)}
    }
  }
 `;

export const SAVE_OR_UPDATE_ADDENDUM_CLAUSE_SPECIFICATION = gql`
  mutation saveOrUpdateAddendumClauseSpecification($input: AddendumClauseSpecRequestInput!){
   saveOrUpdateAddendumClauseSpecification(input: $input) {
      ${responseGqlFields(addendumClauseSpecGqlFields)}
    }
  }
 `;

export const SOFT_DELETE_ADDENDUM_CLAUSE_SPECIFICATION = gql`
  mutation softDeleteAddendumClauseSpecification($addendumClauseSpecUuid: UUID!){
   softDeleteAddendumClauseSpecification(addendumClauseSpecUuid: $addendumClauseSpecUuid) {
      ${responseGqlFields(addendumClauseSpecGqlFields)}
    }
  }
 `;

//  Queries
export const GET_ADDENDUM_CLAUSE_SPECIFICATIONS_BY_CLAUSE = gql`
  query getAddendumClauseSpecificationsByClause($addendumClauseUid: UUID!){
   getAddendumClauseSpecificationsByClause(addendumClauseUid: $addendumClauseUid) {
      ${responseGqlFields(addendumClauseSpecGqlFields)}
    }
  }
 `;

export const GET_ADDENDUM_CLAUSE_SPECIFICATIONS_BY_UID = gql`
  query getAddendumClauseSpecificationsByUid($clauseSpecUid: UUID!){
   getAddendumClauseSpecificationsByUid(clauseSpecUid: $clauseSpecUid) {
      ${responseGqlFields(addendumClauseSpecGqlFields)}
    }
  }
 `;

