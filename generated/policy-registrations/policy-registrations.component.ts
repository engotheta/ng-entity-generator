import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_POLICY_REGISTRATIONS_PAGEABLE } from './policy-registration.graphql';
import { policyRegistrationUpsertBtn } from './policy-registration.form';
import { policyRegistrationTableBtns, policyRegistration$ } from './policy-registration.form';

@Component({
  selector: 'app-policy-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class PolicyRegistrationsComponent extends BaseComponent {
  override title: string = 'Policy Registrations Management';
  override subtitle: string = 'Policy Registrations List';
  override actionButtons: ActionButton[] = [policyRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'applicability', 'dateOfReview', 'department', 'endorsementDate', 'expirationDate', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: policyRegistrationTableBtns(this),
     reloadActions$: [policyRegistration$],
     fetchParameter: { query: ALL_POLICY_REGISTRATIONS_PAGEABLE },
   };

}

