import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const addendumSectionGqlFields = `
  action
  hasClause
  layoutSectionId
  modificationNotes
  modifiedSectionTitle
  refAgreementSectionId
  sectionTitle
  sequenceOrder
  uuid
`;

//   
//  Mutations
export const DELETE_ADDENDUM_SECTION = gql`
  mutation deleteAddendumSection($addendumSectionUid: UUID){
   deleteAddendumSection(addendumSectionUid: $addendumSectionUid) {
      ${responseGqlFields(addendumSectionGqlFields)}
    }
  }
 `;

export const RESTORE_ADDENDUM_SECTION = gql`
  mutation restoreAddendumSection($addendumSectionUid: UUID){
   restoreAddendumSection(addendumSectionUid: $addendumSectionUid) {
      ${responseGqlFields(addendumSectionGqlFields)}
    }
  }
 `;

export const SAVE_OR_UPDATE_ADDENDUM_SECTION = gql`
  mutation saveOrUpdateAddendumSection($input: AddendumSectionRequestInput){
   saveOrUpdateAddendumSection(input: $input) {
      ${responseGqlFields(addendumSectionGqlFields)}
    }
  }
 `;

//  Queries
export const GET_ADDENDUM_SECTION = gql`
  query getAddendumSection($sectionUid: UUID){
   getAddendumSection(sectionUid: $sectionUid) {
      ${responseGqlFields(addendumSectionGqlFields)}
    }
  }
 `;

export const GET_SECTIONS_BY_ADDENDUM_PAGINATED = gql`
  query getSectionsByAddendumPaginated($addendumUid: UUID, $size: Int = 10, $page: Int = 0){
   getSectionsByAddendumPaginated(addendumUid: $addendumUid, size: $size, page: $page) {
      ${responseGqlFields(pageGqlFields(addendumSectionGqlFields))}
    }
  }
 `;

export const GET_SECTIONS_BY_ADDENDUM = gql`
  query getSectionsByAddendum($addendumUid: UUID){
   getSectionsByAddendum(addendumUid: $addendumUid) {
      ${responseGqlFields(addendumSectionGqlFields)}
    }
  }
 `;

