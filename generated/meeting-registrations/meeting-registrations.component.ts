import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_MEETING_REGISTRATIONS_PAGEABLE } from './meeting-registration.graphql';
import { meetingRegistrationUpsertBtn } from './meeting-registration.form';
import { meetingRegistrationTableBtns, meetingRegistration$ } from './meeting-registration.form';

@Component({
  selector: 'app-meeting-registrations',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class MeetingRegistrationsComponent extends BaseComponent {
  override title: string = 'Meeting Registrations Management';
  override subtitle: string = 'Meeting Registrations List';
  override actionButtons: ActionButton[] = [meetingRegistrationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'category', 'conductedDate', 'confirmationDate', 'upcomingSchedule', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: meetingRegistrationTableBtns(this),
     reloadActions$: [meetingRegistration$],
     fetchParameter: { query: ALL_MEETING_REGISTRATIONS_PAGEABLE },
   };

}

