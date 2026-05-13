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

import { AddendumClause } from "./addendum-clause.interface";
import { GET_ADDENDUM_CLAUSE_BY_UID } from "./addendum-clause.graphql";
import { addendumClauseUpsertBtn, addendumClause$ } from "./addendum-clause.form";

@Component({
  selector: 'app-addendum-clause.',
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
export class AddendumClauseComponent extends BaseComponent  {
  override title = 'Addendum Clause';
  override subtitle = 'Addendum Clause Management';
  override actionButtons: ActionButton[] = [addendumClauseUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_ADDENDUM_CLAUSE_BY_UID,
    refetchActions: [addendumClause$],
    data$: new BehaviorSubject<AddendumClause | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.clauseTitle,
    variables: { uuid:this.route.snapshot?.paramMap?.get('addendumClauseUid')},
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
