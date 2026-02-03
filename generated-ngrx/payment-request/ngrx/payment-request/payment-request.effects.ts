import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { PaymentRequestActions } from './payment-request.actions';
import { FetchService } from '@shared';
import * as fromGql from './payment-request.graphql';

@Injectable()
export class PaymentRequestEffects {
  savePaymentRequest$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(PaymentRequestActions.savePaymentRequest)).pipe(
       concatMap(({ input }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.SAVE_PAYMENT_REQUEST,
          errorMessage: 'Error on  Save Payment Request',
          variables: { input },
           successAction: paymentRequest  => PaymentRequestActions.upsertPaymentRequest(paymentRequest ),
          });
        })
      );
    },
    { dispatch: false }
  );

  simpleApprovePaymentRequest$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(PaymentRequestActions.simpleApprovePaymentRequest)).pipe(
       concatMap(({ uid, bankAccountUid }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.SIMPLE_APPROVE_PAYMENT_REQUEST,
          errorMessage: 'Error on  Simple Approve Payment Request',
          variables: { uid, bankAccountUid },
           successAction: (data) => PaymentRequestActions.simpleApprovePaymentRequestSuccess(data),
          });
        })
      );
    },
    { dispatch: false }
  );

  deletePaymentRequestApi$ = createEffect(
    () => {
    return this.actions$.pipe(ofType(PaymentRequestActions.deletePaymentRequestApi)).pipe(
       concatMap(({ uid }) => {
         return this.fetchService.getResponseFromMutation({
          mutation: fromGql.DELETE_PAYMENT_REQUEST,
          errorMessage: 'Error on  Delete Payment Request',
          variables: { uid },
           successAction: ({ id }) => PaymentRequestActions.deletePaymentRequest({ id }),
          });
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private fetchService: FetchService) {}
}
