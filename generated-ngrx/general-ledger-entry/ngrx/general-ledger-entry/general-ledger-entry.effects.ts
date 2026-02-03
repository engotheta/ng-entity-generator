import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { GeneralLedgerEntryActions } from './general-ledger-entry.actions';
import { FetchService } from '@shared';
import * as fromGql from './general-ledger-entry.graphql';

@Injectable()
export class GeneralLedgerEntryEffects {
  constructor(private actions$: Actions, private fetchService: FetchService) {}
}
