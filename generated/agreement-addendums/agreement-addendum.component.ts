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

import { AgreementAddendum } from "./agreement-addendum.interface";
import { GET_ADDENDUM_BY_NUMBER } from "./agreement-addendum.graphql";
import { agreementAddendumUpsertBtn, agreementAddendum$ } from "./agreement-addendum.form";

@Component({
  selector: 'app-agreement-addendum.',
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
export class AgreementAddendumComponent extends BaseComponent  {
  override title = 'Agreement Addendum';
  override subtitle = 'Agreement Addendum Management';
  override actionButtons: ActionButton[] = [agreementAddendumUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_ADDENDUM_BY_NUMBER,
    refetchActions: [agreementAddendum$],
    data$: new BehaviorSubject<AgreementAddendum | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { addendumNumber:this.route.snapshot?.paramMap?.get('agreementAddendumUid')},
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
