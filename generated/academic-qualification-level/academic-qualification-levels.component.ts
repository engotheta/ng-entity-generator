import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { CHANGE_ACADEMIC_QUALIFICATION_LEVEL_STATUS } from './academic-qualification-level.graphql';
import { academicQualificationLevelUpsertBtn } from './academic-qualification-level.form';
import { academicQualificationLevelTableBtns, academicQualificationLevel$ } from './academic-qualification-level.form';

@Component({
  selector: 'app-academic-qualification-levels',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AcademicQualificationLevelsComponent extends BaseComponent {
  override title: string = 'Academic Qualification Levels Management';
  override subtitle: string = 'Academic Qualification Levels List';
  override actionButtons: ActionButton[] = [academicQualificationLevelUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'code', 'actions'];

  gridParameter: GridParameter = {
     title: 'Academic Qualification Levels',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: academicQualificationLevelTableBtns(this),
     reloadActions$: [academicQualificationLevel$],
     fetchParameter: { query: CHANGE_ACADEMIC_QUALIFICATION_LEVEL_STATUS },
   };

}

