import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { CHANGE_ACADEMIC_QUALIFICATION_STATUS } from './academic-qualification.graphql';
import { academicQualificationUpsertBtn } from './academic-qualification.form';
import { academicQualificationTableBtns, academicQualification$ } from './academic-qualification.form';

@Component({
  selector: 'app-academic-qualifications',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AcademicQualificationsComponent extends BaseComponent {
  override title: string = 'Academic Qualifications Management';
  override subtitle: string = 'Academic Qualifications List';
  override actionButtons: ActionButton[] = [academicQualificationUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','programName', 'county', 'institution', 'level', 'receivedBy', 'yearObtained', 'actions'];

  gridParameter: GridParameter = {
     title: 'Academic Qualifications',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: academicQualificationTableBtns(this),
     reloadActions$: [academicQualification$],
     fetchParameter: { query: CHANGE_ACADEMIC_QUALIFICATION_STATUS },
   };

}

