import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { CHANGE_AREA_STATUS } from './area.graphql';
import { areaUpsertBtn } from './area.form';
import { areaTableBtns, area$ } from './area.form';

@Component({
  selector: 'app-areas',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AreasComponent extends BaseComponent {
  override title: string = 'Areas Management';
  override subtitle: string = 'Areas List';
  override actionButtons: ActionButton[] = [areaUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['name', 'code', 'description'];

  gridParameter: GridParameter = {
     title: 'Areas',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: areaTableBtns(this),
     reloadActions$: [area$],
     fetchParameter: { query: CHANGE_AREA_STATUS },
   };

}

