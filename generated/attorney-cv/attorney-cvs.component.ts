import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { undefined } from './attorney-cv.graphql';
import { attorneyCvUpsertBtn } from './attorney-cv.form';
import { attorneyCvTableBtns, attorneyCv$ } from './attorney-cv.form';

@Component({
  selector: 'app-attorney-cvs',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AttorneyCvsComponent extends BaseComponent {
  override title: string = 'Attorney Cvs Management';
  override subtitle: string = 'Attorney Cvs List';
  override actionButtons: ActionButton[] = [attorneyCvUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['academicQualifications', 'attorney', 'attorneyId', 'checkNumber', 'competencyAwards', 'email'];

  gridParameter: GridParameter = {
     title: 'Attorney Cvs',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: attorneyCvTableBtns(this),
     reloadActions$: [attorneyCv$],
     fetchParameter: { query: undefined },
   };

}

