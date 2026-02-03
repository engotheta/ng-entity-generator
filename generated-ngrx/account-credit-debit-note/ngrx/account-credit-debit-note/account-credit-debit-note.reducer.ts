import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AccountCreditDebitNote } from './account-credit-debit-note.model';
import { AccountCreditDebitNoteActions } from './account-credit-debit-note.actions';

export const accountCreditDebitNotesFeatureKey = 'accountCreditDebitNotes';

export type State = EntityState<AccountCreditDebitNote>;

export const adapter: EntityAdapter<AccountCreditDebitNote> = createEntityAdapter<AccountCreditDebitNote>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(AccountCreditDebitNoteActions.addAccountCreditDebitNote, (state, action) =>
  adapter.addOne(action.accountCreditDebitNote, state)
  ),
  on(AccountCreditDebitNoteActions.upsertAccountCreditDebitNote, (state, action) =>
  adapter.upsertOne(action.accountCreditDebitNote, state)
  ),
  on(AccountCreditDebitNoteActions.addAccountCreditDebitNotes, (state, action) =>
  adapter.addMany(action.accountCreditDebitNotes, state)
  ),
  on(AccountCreditDebitNoteActions.upsertAccountCreditDebitNotes, (state, action) =>
  adapter.upsertMany(action.accountCreditDebitNotes, state)
  ),
  on(AccountCreditDebitNoteActions.updateAccountCreditDebitNote, (state, action) =>
  adapter.updateOne(action.accountCreditDebitNote, state)
  ),
  on(AccountCreditDebitNoteActions.updateAccountCreditDebitNotes, (state, action) =>
  adapter.updateMany(action.accountCreditDebitNotes, state)
  ),
  on(AccountCreditDebitNoteActions.deleteAccountCreditDebitNote, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(AccountCreditDebitNoteActions.deleteAccountCreditDebitNotes, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(AccountCreditDebitNoteActions.loadAccountCreditDebitNotes, (state, action) =>
  adapter.setAll(action.accountCreditDebitNotes, state)
  ),
  on(AccountCreditDebitNoteActions.clearAccountCreditDebitNotes, state => adapter.removeAll(state))
);

export const accountCreditDebitNotesFeature = createFeature({
  name: accountCreditDebitNotesFeatureKey,
  reducer,
  extraSelectors: ({ selectAccountCreditDebitNotesState }) => ({
  ...adapter.getSelectors(selectAccountCreditDebitNotesState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = accountCreditDebitNotesFeature;
