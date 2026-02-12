import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { CHANGE_WORK_EXPERIENCE_STATUS } from './work-experience.graphql';
import { workExperienceUpsertBtn } from './work-experience.form';
import { workExperienceTableBtns, workExperience$ } from './work-experience.form';

@Component({
  selector: 'app-work-experiences',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class WorkExperiencesComponent extends BaseComponent {
  override title: string = 'Work Experiences Management';
  override subtitle: string = 'Work Experiences List';
  override actionButtons: ActionButton[] = [workExperienceUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','institutionName', 'attorney', 'currentlyWorkingHere', 'endDate', 'position', 'startDate', 'actions'];

  gridParameter: GridParameter = {
     title: 'Work Experiences',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: workExperienceTableBtns(this),
     reloadActions$: [workExperience$],
     fetchParameter: { query: CHANGE_WORK_EXPERIENCE_STATUS },
   };

}

