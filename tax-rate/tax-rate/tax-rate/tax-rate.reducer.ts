import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { TaxRate } from './tax-rate.model';
import { TaxRateActions } from './tax-rate.actions';

export const taxRatesFeatureKey = 'taxRates';

export type State = EntityState<TaxRate>;

export const adapter: EntityAdapter<TaxRate> = createEntityAdapter<TaxRate>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(TaxRateActions.addTaxRate, (state, action) =>
    adapter.addOne(action.taxRate, state)
  ),
  on(TaxRateActions.upsertTaxRate, (state, action) =>
    adapter.upsertOne(action.taxRate, state)
  ),
  on(TaxRateActions.addTaxRates, (state, action) =>
    adapter.addMany(action.taxRates, state)
  ),
  on(TaxRateActions.upsertTaxRates, (state, action) =>
    adapter.upsertMany(action.taxRates, state)
  ),
  on(TaxRateActions.updateTaxRate, (state, action) =>
    adapter.updateOne(action.taxRate, state)
  ),
  on(TaxRateActions.updateTaxRates, (state, action) =>
    adapter.updateMany(action.taxRates, state)
  ),
  on(TaxRateActions.deleteTaxRate, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(TaxRateActions.deleteTaxRates, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(TaxRateActions.loadTaxRates, (state, action) =>
    adapter.setAll(action.taxRates, state)
  ),
  on(TaxRateActions.clearTaxRates, state => adapter.removeAll(state))
);

export const taxRatesFeature = createFeature({
  name: taxRatesFeatureKey,
  reducer,
  extraSelectors: ({ selectTaxRatesState }) => ({
    ...adapter.getSelectors(selectTaxRatesState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = taxRatesFeature;
