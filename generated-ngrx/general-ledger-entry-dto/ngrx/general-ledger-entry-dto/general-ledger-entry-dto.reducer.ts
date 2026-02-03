import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { GeneralLedgerEntryDto } from './general-ledger-entry-dto.model';
import { GeneralLedgerEntryDtoActions } from './general-ledger-entry-dto.actions';

export const generalLedgerEntryDtosFeatureKey = 'generalLedgerEntryDtos';

export type State = EntityState<GeneralLedgerEntryDto>;

export const adapter: EntityAdapter<GeneralLedgerEntryDto> = createEntityAdapter<GeneralLedgerEntryDto>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(GeneralLedgerEntryDtoActions.addGeneralLedgerEntryDto, (state, action) =>
  adapter.addOne(action.generalLedgerEntryDto, state)
  ),
  on(GeneralLedgerEntryDtoActions.upsertGeneralLedgerEntryDto, (state, action) =>
  adapter.upsertOne(action.generalLedgerEntryDto, state)
  ),
  on(GeneralLedgerEntryDtoActions.addGeneralLedgerEntryDtos, (state, action) =>
  adapter.addMany(action.generalLedgerEntryDtos, state)
  ),
  on(GeneralLedgerEntryDtoActions.upsertGeneralLedgerEntryDtos, (state, action) =>
  adapter.upsertMany(action.generalLedgerEntryDtos, state)
  ),
  on(GeneralLedgerEntryDtoActions.updateGeneralLedgerEntryDto, (state, action) =>
  adapter.updateOne(action.generalLedgerEntryDto, state)
  ),
  on(GeneralLedgerEntryDtoActions.updateGeneralLedgerEntryDtos, (state, action) =>
  adapter.updateMany(action.generalLedgerEntryDtos, state)
  ),
  on(GeneralLedgerEntryDtoActions.deleteGeneralLedgerEntryDto, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(GeneralLedgerEntryDtoActions.deleteGeneralLedgerEntryDtos, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(GeneralLedgerEntryDtoActions.loadGeneralLedgerEntryDtos, (state, action) =>
  adapter.setAll(action.generalLedgerEntryDtos, state)
  ),
  on(GeneralLedgerEntryDtoActions.clearGeneralLedgerEntryDtos, state => adapter.removeAll(state))
);

export const generalLedgerEntryDtosFeature = createFeature({
  name: generalLedgerEntryDtosFeatureKey,
  reducer,
  extraSelectors: ({ selectGeneralLedgerEntryDtosState }) => ({
  ...adapter.getSelectors(selectGeneralLedgerEntryDtosState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = generalLedgerEntryDtosFeature;
