import { BehaviorSubject } from 'rxjs';
import { Component  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@common/page-header.component";
import { ToObservablePipe } from '@common/pipes/to-observable.pipe';
import { BaseComponent } from "@common/components/base-componet/base-component";
import { ContentParameter } from "@common/components/contents-view/view.interface";
import { ActionButton } from "@common/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@common/components/contents-view/contents-view.component";

import { TaskCategory } from "./task-category.interface";
import { FIND_TASK_CATEGORY_BY_ID } from "./task-category.graphql";
import { taskCategoryUpsertBtn, taskCategory$ } from "./task-category.form";

@Component({
  selector: 'app-task-category.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ,ToObservablePipe],
  template: `
    <!--  -->
    <div class="flex-1 flex flex-col gap-2">
      <app-page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="fetchParameter?.data$ | toObservable | async"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class TaskCategoryComponent extends BaseComponent  {
  override title = 'Task Category';
  override subtitle = 'Task Category Management';
  override actionButtons: ActionButton[] = [taskCategoryUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_TASK_CATEGORY_BY_ID,
    refetchActions: [taskCategory$],
    data$: new BehaviorSubject<TaskCategory>(),
    successFn:(res) => this.title = res?.data?.name,
    variables: { id:this.route.snapshot?.paramMap?.get('taskCategoryUid')},
  };

  override contents:ContentParameter = [
    {
      type: 'details',
      icon: 'notes',
      showUndefined: true,
      fetchParameter: this.fetchParameter,
    },
  ];

}
