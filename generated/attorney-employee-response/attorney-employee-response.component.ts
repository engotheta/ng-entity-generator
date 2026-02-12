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

import { AttorneyEmployeeResponse } from "./attorney-employee-response.interface";
import { attorneyEmployeeResponseUpsertBtn, attorneyEmployeeResponse$ } from "./attorney-employee-response.form";

@Component({
  selector: 'app-attorney-employee-response.',
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
export class AttorneyEmployeeResponseComponent extends BaseComponent  {
  override title = 'Attorney Employee Response';
  override subtitle = 'Attorney Employee Response Management';
  override actionButtons: ActionButton[] = [attorneyEmployeeResponseUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: undefined,
    refetchActions: [attorneyEmployeeResponse$],
    data$: new BehaviorSubject<AttorneyEmployeeResponse | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.departmentName,
    variables: { uid:this.route.snapshot?.paramMap?.get('attorneyEmployeeResponseUid')},
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
