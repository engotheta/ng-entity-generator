import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { undefined } from './attorney-employee-response.graphql';
import { attorneyEmployeeResponseUpsertBtn } from './attorney-employee-response.form';
import { attorneyEmployeeResponseTableBtns, attorneyEmployeeResponse$ } from './attorney-employee-response.form';

@Component({
  selector: 'app-attorney-employee-responses',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AttorneyEmployeeResponsesComponent extends BaseComponent {
  override title: string = 'Attorney Employee Responses Management';
  override subtitle: string = 'Attorney Employee Responses List';
  override actionButtons: ActionButton[] = [attorneyEmployeeResponseUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','departmentName', 'designationName', 'institutionName', 'jobClassName', 'organizationName', 'sectionName', 'actions'];

  gridParameter: GridParameter = {
     title: 'Attorney Employee Responses',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: attorneyEmployeeResponseTableBtns(this),
     reloadActions$: [attorneyEmployeeResponse$],
     fetchParameter: { query: undefined },
   };

}

