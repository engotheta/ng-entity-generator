import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { undefined } from './attorney-employee.graphql';
import { attorneyEmployeeUpsertBtn } from './attorney-employee.form';
import { attorneyEmployeeTableBtns, attorneyEmployee$ } from './attorney-employee.form';

@Component({
  selector: 'app-attorney-employees',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AttorneyEmployeesComponent extends BaseComponent {
  override title: string = 'Attorney Employees Management';
  override subtitle: string = 'Attorney Employees List';
  override actionButtons: ActionButton[] = [attorneyEmployeeUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','departmentName', 'designationName', 'institutionName', 'jobClassName', 'organizationName', 'sectionName', 'actions'];

  gridParameter: GridParameter = {
     title: 'Attorney Employees',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: attorneyEmployeeTableBtns(this),
     reloadActions$: [attorneyEmployee$],
     fetchParameter: { query: undefined },
   };

}

