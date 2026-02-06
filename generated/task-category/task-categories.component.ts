import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { GET_ALL_TASK_CATEGORIES } from './task-category.graphql';
import { taskCategoryUpsertBtn } from './task-category.form';
import { taskCategoryTableBtns, taskCategory$ } from './task-category.form';

@Component({
  selector: 'app-task-categories',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class TaskCategoriesComponent extends BaseComponent {
  override title: string = 'Task Categories Management';
  override subtitle: string = 'Task Categories List';
  override actionButtons: ActionButton[] = [taskCategoryUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['name', 'code', 'description'];

  gridParameter: GridParameter = {
     title: 'Task Categories',
     icon: 'info_circle',
     keyColumns: this.keyColumns,
     actionButtons: taskCategoryTableBtns(this),
     reloadActions$: [taskCategory$],
     fetchParameter: { query: GET_ALL_TASK_CATEGORIES },
   };

}

