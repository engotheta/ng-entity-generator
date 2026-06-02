import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { MY_OPINION_REGISTRATIONS_PAGEABLE } from './opinion-registration.graphql';
import { opinionRegistrationUpsertBtn } from './opinion-registration.form';
import { opinionRegistrationTableBtns, opinionRegistration$ } from './opinion-registration.form';

@Component({
  selector: 'app-opinion-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class OpinionRegistrationsComponent extends BaseComponent {
  override title: string = 'Opinion Registrations Management';
  override subtitle: string = 'Opinion Registrations List';
  override actionButtons: ActionButton[] = [opinionRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'nature', 'responsibleUnit', 'valueObtained', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: opinionRegistrationTableBtns(this),
     reloadActions$: [opinionRegistration$],
     fetchParameter: { query: MY_OPINION_REGISTRATIONS_PAGEABLE },
   };

}

