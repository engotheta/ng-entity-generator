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

import { AddendumClauseSpec } from "./addendum-clause-spec.interface";
import { GET_ADDENDUM_CLAUSE_SPECIFICATIONS_BY_CLAUSE } from "./addendum-clause-spec.graphql";
import { addendumClauseSpecUpsertBtn, addendumClauseSpec$ } from "./addendum-clause-spec.form";

@Component({
  selector: 'app-addendum-clause-spec.',
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
export class AddendumClauseSpecComponent extends BaseComponent  {
  override title = 'Addendum Clause Spec';
  override subtitle = 'Addendum Clause Spec Management';
  override actionButtons: ActionButton[] = [addendumClauseSpecUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_ADDENDUM_CLAUSE_SPECIFICATIONS_BY_CLAUSE,
    refetchActions: [addendumClauseSpec$],
    data$: new BehaviorSubject<AddendumClauseSpec | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { addendumClauseUid:this.route.snapshot?.paramMap?.get('addendumClauseSpecUid')},
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
