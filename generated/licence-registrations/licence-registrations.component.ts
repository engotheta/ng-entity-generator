import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_LICENCE_REGISTRATIONS_PAGEABLE } from './licence-registration.graphql';
import { licenceRegistrationUpsertBtn } from './licence-registration.form';
import { licenceRegistrationTableBtns, licenceRegistration$ } from './licence-registration.form';

@Component({
  selector: 'app-licence-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class LicenceRegistrationsComponent extends BaseComponent {
  override title: string = 'Licence Registrations Management';
  override subtitle: string = 'Licence Registrations List';
  override actionButtons: ActionButton[] = [licenceRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'condition', 'department', 'duration', 'expirationDate', 'renewalRequirement', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: licenceRegistrationTableBtns(this),
     reloadActions$: [licenceRegistration$],
     fetchParameter: { query: ALL_LICENCE_REGISTRATIONS_PAGEABLE },
   };

}

