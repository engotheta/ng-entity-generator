import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap } from 'rxjs/operators';
import { GeneralLedgerEntryDtoActions } from './general-ledger-entry-dto.actions';
import { FetchService } from '@shared';
import * as fromGql from './general-ledger-entry-dto.graphql';

@Injectable()
export class GeneralLedgerEntryDtoEffects {
  constructor(private actions$: Actions, private fetchService: FetchService) {}
}
