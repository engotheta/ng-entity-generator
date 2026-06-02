import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_INSURANCE_REGISTRATIONS_PAGEABLE } from './insurance-registration.graphql';
import { insuranceRegistrationUpsertBtn } from './insurance-registration.form';
import { insuranceRegistrationTableBtns, insuranceRegistration$ } from './insurance-registration.form';

@Component({
  selector: 'app-insurance-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class InsuranceRegistrationsComponent extends BaseComponent {
  override title: string = 'Insurance Registrations Management';
  override subtitle: string = 'Insurance Registrations List';
  override actionButtons: ActionButton[] = [insuranceRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','nameOfAsset', 'coverage', 'department', 'duration', 'endDate', 'insuranceType', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: insuranceRegistrationTableBtns(this),
     reloadActions$: [insuranceRegistration$],
     fetchParameter: { query: ALL_INSURANCE_REGISTRATIONS_PAGEABLE },
   };

}

