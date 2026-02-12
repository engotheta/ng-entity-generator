import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { SEARCH_RESPONSIBILITY } from './responsibility.graphql';
import { responsibilityUpsertBtn } from './responsibility.form';
import { responsibilityTableBtns, responsibility$ } from './responsibility.form';

@Component({
  selector: 'app-responsibilities',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class ResponsibilitiesComponent extends BaseComponent {
  override title: string = 'Responsibilities Management';
  override subtitle: string = 'Responsibilities List';
  override actionButtons: ActionButton[] = [responsibilityUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'description', 'actions'];

  gridParameter: GridParameter = {
     title: 'Responsibilities',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: responsibilityTableBtns(this),
     reloadActions$: [responsibility$],
     fetchParameter: { query: SEARCH_RESPONSIBILITY },
   };

}

