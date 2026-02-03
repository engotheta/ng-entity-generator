import { TaxRate, TaxRateDtoInput } from './tax-rate.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const TaxRateActions = createActionGroup({
  source: 'TaxRate/API',
  events: {
    'Load Tax Rates': props<{ taxRates: TaxRate[] }>(),
    'Add Tax Rate': props<{ taxRate: TaxRate }>(),
    'Upsert Tax Rate': props<{ taxRate: TaxRate }>(),
    'Add Tax Rates': props<{ taxRates: TaxRate[] }>(),
    'Upsert Tax Rates': props<{ taxRates: TaxRate[] }>(),
    'Update Tax Rate': props<{ taxRate: Update<TaxRate> }>(),
    'Update Tax Rates': props<{ taxRates: Update<TaxRate>[] }>(),
    'Delete Tax Rate': props<{ id: number }>(),
    'Delete Tax Rates': props<{ ids: number[] }>(),
    'Clear Tax Rate': emptyProps(),
    'Clear Tax Rates': emptyProps(),

    // API
    'Save Client Category': props<{ input:ClientCategoryDtoInput }>() ,
    'Delete Client Category Api': props<{ uid:String }>() ,
  },
});
