import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';
import { plainResponseGqlFields } from '@common/utilities/data.gql';
import { pageGqlFields } from '@common/utilities/data.gql';

export const agreementValueGqlFields = `
  agreementDTO{
    titleOfTheAgreement
    name
    agreementDescription
    code
    description
    agreementEndDate
  }
  agreementUuid
  createdAt
  createdBy
  currencyDTO{
    name
    code
    isDefault
  }
  currencyUuid
  exchangeRate
  exchangeRateDate
  uuid
  valueVatExclusive
  valueVatInclusive
`;

//   
//  Mutations
export const DELETE_AGREEMENT_VALUE = gql`
  mutation deleteAgreementValue($uuid: UUID!){
   deleteAgreementValue(uuid: $uuid) {
      ${plainResponseGqlFields}
    }
  }
 `;

export const SAVE_AGREEMENT_VALUE = gql`
  mutation saveAgreementValue($input: AgreementValueDTOInput!){
   saveAgreementValue(input: $input) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

//  Queries
export const GET_AGREEMENT_VALUE_BY_UUID = gql`
  query getAgreementValueByUuid($uuid: UUID!){
   getAgreementValueByUuid(uuid: $uuid) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

export const GET_AGREEMENT_VALUES_BY_DATE_RANGE = gql`
  query getAgreementValuesByDateRange($endDate: String!, $startDate: String!){
   getAgreementValuesByDateRange(endDate: $endDate, startDate: $startDate) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

export const GET_AGREEMENT_VALUES_BY_AGREEMENT = gql`
  query getAgreementValuesByAgreement($agreementUuid: UUID!){
   getAgreementValuesByAgreement(agreementUuid: $agreementUuid) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

export const GET_AGREEMENT_VALUE_BY_ID = gql`
  query getAgreementValueById($id: Long!){
   getAgreementValueById(id: $id) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

export const GET_ALL_AGREEMENT_VALUES = gql`
  query getAllAgreementValues($sortDirection: String, $size: Int, $sortBy: String, $page: Int){
   getAllAgreementValues(sortDirection: $sortDirection, size: $size, sortBy: $sortBy, page: $page) {
      ${responseGqlFields(pageGqlFields(agreementValueGqlFields))}
    }
  }
 `;

export const GET_AGREEMENT_VALUES_BY_CURRENCY = gql`
  query getAgreementValuesByCurrency($currencyUuid: UUID!){
   getAgreementValuesByCurrency(currencyUuid: $currencyUuid) {
      ${responseGqlFields(agreementValueGqlFields)}
    }
  }
 `;

export const CALCULATE_TOTAL_VALUE_BY_AGREEMENT = gql`
  query calculateTotalValueByAgreement($agreementUuid: UUID!){
   calculateTotalValueByAgreement(agreementUuid: $agreementUuid) {
      ${plainResponseGqlFields}
    }
  }
 `;

