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

import { AgreementValue } from "./agreement-value.interface";
import { GET_AGREEMENT_VALUE_BY_UUID } from "./agreement-value.graphql";
import { agreementValueUpsertBtn, agreementValue$ } from "./agreement-value.form";

@Component({
  selector: 'app-agreement-value.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ,ToObservablePipe],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
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
export class AgreementValueComponent extends BaseComponent  {
  override title = 'Agreement Value';
  override subtitle = 'Agreement Value Management';
  override actionButtons: ActionButton[] = [agreementValueUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_AGREEMENT_VALUE_BY_UUID,
    refetchActions: [agreementValue$],
    data$: new BehaviorSubject<AgreementValue | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { uuid:this.route.snapshot?.paramMap?.get('agreementValueUid')},
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
