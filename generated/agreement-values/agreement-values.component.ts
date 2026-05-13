import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { GET_AGREEMENT_VALUES_BY_DATE_RANGE } from './agreement-value.graphql';
import { agreementValueUpsertBtn } from './agreement-value.form';
import { agreementValueTableBtns, agreementValue$ } from './agreement-value.form';

@Component({
  selector: 'app-agreement-values',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AgreementValuesComponent extends BaseComponent {
  override title: string = 'Agreement Values Management';
  override subtitle: string = 'Agreement Values List';
  override actionButtons: ActionButton[] = [agreementValueUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','agreementDTO', 'currencyDTO', 'exchangeRate', 'exchangeRateDate', 'valueVatExclusive', 'valueVatInclusive', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: agreementValueTableBtns(this),
     reloadActions$: [agreementValue$],
     fetchParameter: { query: GET_AGREEMENT_VALUES_BY_DATE_RANGE },
   };

}

