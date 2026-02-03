import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GeneralLedgerEntry } from './general-ledger-entry.model';
import { GeneralLedgerEntryActions } from './general-ledger-entry.actions';

export const generalLedgerEntriesFeatureKey = 'generalLedgerEntries';

export type State = EntityState<GeneralLedgerEntry>;

export const adapter: EntityAdapter<GeneralLedgerEntry> = createEntityAdapter<GeneralLedgerEntry>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(GeneralLedgerEntryActions.addGeneralLedgerEntry, (state, action) =>
  adapter.addOne(action.generalLedgerEntry, state)
  ),
  on(GeneralLedgerEntryActions.upsertGeneralLedgerEntry, (state, action) =>
  adapter.upsertOne(action.generalLedgerEntry, state)
  ),
  on(GeneralLedgerEntryActions.addGeneralLedgerEntries, (state, action) =>
  adapter.addMany(action.generalLedgerEntries, state)
  ),
  on(GeneralLedgerEntryActions.upsertGeneralLedgerEntries, (state, action) =>
  adapter.upsertMany(action.generalLedgerEntries, state)
  ),
  on(GeneralLedgerEntryActions.updateGeneralLedgerEntry, (state, action) =>
  adapter.updateOne(action.generalLedgerEntry, state)
  ),
  on(GeneralLedgerEntryActions.updateGeneralLedgerEntries, (state, action) =>
  adapter.updateMany(action.generalLedgerEntries, state)
  ),
  on(GeneralLedgerEntryActions.deleteGeneralLedgerEntry, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(GeneralLedgerEntryActions.deleteGeneralLedgerEntries, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(GeneralLedgerEntryActions.loadGeneralLedgerEntries, (state, action) =>
  adapter.setAll(action.generalLedgerEntries, state)
  ),
  on(GeneralLedgerEntryActions.clearGeneralLedgerEntries, state => adapter.removeAll(state))
);

export const generalLedgerEntriesFeature = createFeature({
  name: generalLedgerEntriesFeatureKey,
  reducer,
  extraSelectors: ({ selectGeneralLedgerEntriesState }) => ({
  ...adapter.getSelectors(selectGeneralLedgerEntriesState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = generalLedgerEntriesFeature;
