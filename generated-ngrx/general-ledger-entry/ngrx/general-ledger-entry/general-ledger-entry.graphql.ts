import { baseGqlFields } from '@shared';
import gql from 'graphql-tag';

export const generalLedgerEntryGqlFields = `
  credit
  debit
  description
  entryDate
  reference
  runningBalance
  ${baseGqlFields}
`;

//   
//  Queries
export const GENERAL_LEDGER = gql`
  query generalLedger($endDate: LocalDate, $startDate: LocalDate, $accountUid: String){
   generalLedger(endDate: $endDate, startDate: $startDate, accountUid: $accountUid) {
      ${generalLedgerEntryGqlFields}
    }
  }
 `;

