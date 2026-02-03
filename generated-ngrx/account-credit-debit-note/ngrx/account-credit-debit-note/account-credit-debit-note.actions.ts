import { AccountCreditDebitNote, AccountCreditDebitNoteDtoInput } from './account-credit-debit-note.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const AccountCreditDebitNoteActions = createActionGroup({
  source: 'AccountCreditDebitNote/API',
  events: {
  'Load Account Credit Debit Notes': props<{ accountCreditDebitNotes: AccountCreditDebitNote[] }>(),
  'Add Account Credit Debit Note': props<{ accountCreditDebitNote: AccountCreditDebitNote }>(),
  'Upsert Account Credit Debit Note': props<{ accountCreditDebitNote: AccountCreditDebitNote }>(),
  'Add Account Credit Debit Notes': props<{ accountCreditDebitNotes: AccountCreditDebitNote[] }>(),
  'Upsert Account Credit Debit Notes': props<{ accountCreditDebitNotes: AccountCreditDebitNote[] }>(),
  'Update Account Credit Debit Note': props<{ accountCreditDebitNote: Update<AccountCreditDebitNote> }>(),
  'Update Account Credit Debit Notes': props<{ accountCreditDebitNotes: Update<AccountCreditDebitNote>[] }>(),
  'Delete Account Credit Debit Note': props<{ id: number }>(),
  'Delete Account Credit Debit Notes': props<{ ids: number[] }>(),
  'Clear Account Credit Debit Note': emptyProps(),
  'Clear Account Credit Debit Notes': emptyProps(),

    // API
  'Save Credit Debit Note': props<{ input:CreditDebitNoteDtoInput }>() ,
  'Save Credit Debit Note Action': props<{ data:any }>() ,
  'Post Credit Debit Note': props<{ uid:string }>() ,
  'Post Credit Debit Note Action': props<{ data:any }>() ,
  'Reverse Credit Debit Note': props<{ reason:string, uid:string, reversalDate:string }>() ,
  'Reverse Credit Debit Note Action': props<{ data:any }>() ,
  },
});
