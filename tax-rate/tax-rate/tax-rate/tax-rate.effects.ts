import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { TaxRateActions } from './tax-rate.actions';
import { FetchService } from '@shared';
import * as fromGql from './tax-rate.graphql';

@Injectable()
export class TaxRateEffects {
  saveClientCategory$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(TaxRateActions.saveClientCategory)).pipe(
         concatMap(({ input }) => {
           return this.fetchService.getResponseFromMutation({
            mutation: fromGql.SAVE_CLIENT_CATEGORY,
            errorMessage: 'Error on  Save Client Category',
            variables: { input },
             successAction: taxRate  => TaxRateActions.saveTaxRate(taxRate ),
          });
        })
      );
    },
    { dispatch: false }
  );

  deleteClientCategory$ = createEffect(
    () => {
      return this.actions$.pipe(ofType(TaxRateActions.deleteClientCategory)).pipe(
         concatMap(({ uid }) => {
           return this.fetchService.getResponseFromMutation({
            mutation: fromGql.DELETE_CLIENT_CATEGORY,
            errorMessage: 'Error on  Delete Client Category',
            variables: { uid },
             successAction: ({ id }) => TaxRateActions.deleteTaxRate({ id }),
          });
        })
      );
    },
    { dispatch: false }
  );

  constructor(private actions$: Actions, private fetchService: FetchService) {}
}
