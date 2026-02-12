import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { SEARCH_ACADEMIC_QUALIFICATION_LEVEL } from './academic-qualification-level-response.graphql';
import { academicQualificationLevelResponseUpsertBtn } from './academic-qualification-level-response.form';
import { academicQualificationLevelResponseTableBtns, academicQualificationLevelResponse$ } from './academic-qualification-level-response.form';

@Component({
  selector: 'app-academic-qualification-level-responses',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AcademicQualificationLevelResponsesComponent extends BaseComponent {
  override title: string = 'Academic Qualification Level Responses Management';
  override subtitle: string = 'Academic Qualification Level Responses List';
  override actionButtons: ActionButton[] = [academicQualificationLevelResponseUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'code', 'actions'];

  gridParameter: GridParameter = {
     title: 'Academic Qualification Level Responses',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: academicQualificationLevelResponseTableBtns(this),
     reloadActions$: [academicQualificationLevelResponse$],
     fetchParameter: { query: SEARCH_ACADEMIC_QUALIFICATION_LEVEL },
   };

}

