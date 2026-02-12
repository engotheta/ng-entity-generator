import { BehaviorSubject } from 'rxjs';
import { Component  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@common/page-header.component";
import { ToObservablePipe } from '@common/pipes/to-observable.pipe';
import { BaseComponent } from "@common/components/base-componet/base-component";
import { ContentParameter } from "@common/components/contents-view/view.interface";
import { FetchParameter } from '@common/services/fetch.service';
import { ActionButton } from "@common/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@common/components/contents-view/contents-view.component";

import { Responsibility } from "./responsibility.interface";
import { FIND_RESPONSIBILITY_BY_ID } from "./responsibility.graphql";
import { responsibilityUpsertBtn, responsibility$ } from "./responsibility.form";

@Component({
  selector: 'app-responsibility.',
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
export class ResponsibilityComponent extends BaseComponent  {
  override title = 'Responsibility';
  override subtitle = 'Responsibility Management';
  override actionButtons: ActionButton[] = [responsibilityUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_RESPONSIBILITY_BY_ID,
    refetchActions: [responsibility$],
    data$: new BehaviorSubject<Responsibility | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { id:this.route.snapshot?.paramMap?.get('responsibilityUid')},
  };

  override contents:ContentParameter[] = [
    {
      type: 'details',
      icon: 'notes',
      showUndefined: true,
      fetchParameter: this.fetchParameter,
    },
  ];

}
