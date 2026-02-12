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

import { AttorneyEmployee } from "./attorney-employee.interface";
import { attorneyEmployeeUpsertBtn, attorneyEmployee$ } from "./attorney-employee.form";

@Component({
  selector: 'app-attorney-employee.',
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
export class AttorneyEmployeeComponent extends BaseComponent  {
  override title = 'Attorney Employee';
  override subtitle = 'Attorney Employee Management';
  override actionButtons: ActionButton[] = [attorneyEmployeeUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: undefined,
    refetchActions: [attorneyEmployee$],
    data$: new BehaviorSubject<AttorneyEmployee | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.departmentName,
    variables: { uid:this.route.snapshot?.paramMap?.get('attorneyEmployeeUid')},
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
