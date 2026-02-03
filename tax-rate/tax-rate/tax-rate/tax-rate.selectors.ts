import { createSelector } from '@ngrx/store';
import { TaxRatesFeatureKey } from './tax-rate.reducer';
import * as fromTaxRate from './tax-rate.reducer';
import { AppState } from '../../../index';
import { TaxRate } from './tax-rate.model';
import { formatDates } from '@shared/data/data.helpers';

export const currentTaxRatesState = (state: AppState) => state[TaxRatesFeatureKey];

export const selectTaxRateFromReducer = createSelector(
  currentTaxRatesState,
  fromTaxRate.selectAll
);

export const selectTaxRates = createSelector(selectTaxRateFromReducer, (items:TaxRate[]) => {
  return items?.map((item:TaxRate) => mapTaxRate(item));
});

export const mapTaxRate = (item: TaxRate) => {
  return {
    ...item,
    ...formatDates(item), // adds createdAtMod,...etc,
    activeMod: item?.active ? 'Active' : 'In Active',
  };
};

export const selectTaxRateById = (id: number) =>
  createSelector(selectTaxRates, items => items.find(item => item.id === id));

export const selectTaxRateByUid = (uid: string) =>
  createSelector(selectTaxRates, items => items.find(item => item.uid === uid));
