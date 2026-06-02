import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_CONTRACT_REGISTRATIONS_PAGEABLE } from './contract-registration.graphql';
import { contractRegistrationUpsertBtn } from './contract-registration.form';
import { contractRegistrationTableBtns, contractRegistration$ } from './contract-registration.form';

@Component({
  selector: 'app-contract-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class ContractRegistrationsComponent extends BaseComponent {
  override title: string = 'Contract Registrations Management';
  override subtitle: string = 'Contract Registrations List';
  override actionButtons: ActionButton[] = [contractRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'amount', 'contractDate', 'contractManager', 'contractNumber', 'contractType', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: contractRegistrationTableBtns(this),
     reloadActions$: [contractRegistration$],
     fetchParameter: { query: ALL_CONTRACT_REGISTRATIONS_PAGEABLE },
   };

}

