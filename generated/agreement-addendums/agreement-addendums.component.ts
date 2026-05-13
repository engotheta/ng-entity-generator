import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { GET_ADDENDUMS_PAGINATED } from './agreement-addendum.graphql';
import { agreementAddendumUpsertBtn } from './agreement-addendum.form';
import { agreementAddendumTableBtns, agreementAddendum$ } from './agreement-addendum.form';

@Component({
  selector: 'app-agreement-addendums',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AgreementAddendumsComponent extends BaseComponent {
  override title: string = 'Agreement Addendums Management';
  override subtitle: string = 'Agreement Addendums List';
  override actionButtons: ActionButton[] = [agreementAddendumUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','addendumNumber', 'reasons', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: agreementAddendumTableBtns(this),
     reloadActions$: [agreementAddendum$],
     fetchParameter: { query: GET_ADDENDUMS_PAGINATED },
   };

}

