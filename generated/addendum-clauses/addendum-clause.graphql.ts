import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const addendumClauseGqlFields = `
  action
  clauseNumber
  clauseOrder
  clauseText
  clauseTitle
  isMandatory
  isNegotiable
  refClauseId
  uuid
`;

//   
//  Mutations
export const RESTORE_ADDENDUM_CLAUSE = gql`
  mutation restoreAddendumClause($clauseUid: UUID!){
   restoreAddendumClause(clauseUid: $clauseUid) {
      ${responseGqlFields(addendumClauseGqlFields)}
    }
  }
 `;

export const DELETE_ADDENDUM_CLAUSE = gql`
  mutation deleteAddendumClause($clauseUid: UUID!){
   deleteAddendumClause(clauseUid: $clauseUid) {
      ${responseGqlFields(addendumClauseGqlFields)}
    }
  }
 `;

export const SAVE_OR_UPDATE_ADDENDUM_CLAUSE = gql`
  mutation saveOrUpdateAddendumClause($input: AddendumClauseRequestInput!){
   saveOrUpdateAddendumClause(input: $input) {
      ${responseGqlFields(addendumClauseGqlFields)}
    }
  }
 `;

//  Queries
export const GET_ADDENDUM_CLAUSE_BY_UID = gql`
  query getAddendumClauseByUid($uuid: UUID!){
   getAddendumClauseByUid(uuid: $uuid) {
      ${responseGqlFields(addendumClauseGqlFields)}
    }
  }
 `;

export const GET_ADDENDUM_CLAUSES_BY_SECTION = gql`
  query getAddendumClausesBySection($sectionUid: UUID!){
   getAddendumClausesBySection(sectionUid: $sectionUid) {
      ${responseGqlFields(addendumClauseGqlFields)}
    }
  }
 `;

