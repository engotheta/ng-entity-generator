import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { AccountCreditDebitNoteActions } from './account-credit-debit-note.actions';
import { FetchService } from '@shared';
import * as fromGql from './account-credit-debit-note.graphql';

@Injectable()
export class AccountCreditDebitNoteEffects {
  saveCreditDebitNote$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(AccountCreditDebitNoteActions.saveCreditDebitNote)).pipe(
       concatMap(({ input }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.SAVE_CREDIT_DEBIT_NOTE,
          errorMessage: 'Error on  Save Credit Debit Note',
          variables: { input },
           successAction: accountCreditDebitNote  => AccountCreditDebitNoteActions.upsertAccountCreditDebitNote(accountCreditDebitNote ),
          });
        })
      );
    },
    { dispatch: false }
  );

  postCreditDebitNote$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(AccountCreditDebitNoteActions.postCreditDebitNote)).pipe(
       concatMap(({ uid }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.POST_CREDIT_DEBIT_NOTE,
          errorMessage: 'Error on  Post Credit Debit Note',
          variables: { uid },
           successAction: (data) => AccountCreditDebitNoteActions.accountCreditDebitNoteAction(data),
          });
        })
      );
    },
    { dispatch: false }
  );

  reverseCreditDebitNote$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(AccountCreditDebitNoteActions.reverseCreditDebitNote)).pipe(
       concatMap(({ reason, uid, reversalDate }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.REVERSE_CREDIT_DEBIT_NOTE,
          errorMessage: 'Error on  Reverse Credit Debit Note',
          variables: { reason, uid, reversalDate },
           successAction: (data) => AccountCreditDebitNoteActions.accountCreditDebitNoteAction(data),
          });
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private fetchService: FetchService) {}
}
