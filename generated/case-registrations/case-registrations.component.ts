import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { MY_CASE_REGISTRATIONS_PAGEABLE } from './case-registration.graphql';
import { caseRegistrationUpsertBtn } from './case-registration.form';
import { caseRegistrationTableBtns, caseRegistration$ } from './case-registration.form';

@Component({
  selector: 'app-case-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class CaseRegistrationsComponent extends BaseComponent {
  override title: string = 'Case Registrations Management';
  override subtitle: string = 'Case Registrations List';
  override actionButtons: ActionButton[] = [caseRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'amount', 'dateOfSchedules', 'decistion', 'natureOfCase', 'place', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: caseRegistrationTableBtns(this),
     reloadActions$: [caseRegistration$],
     fetchParameter: { query: MY_CASE_REGISTRATIONS_PAGEABLE },
   };

}

