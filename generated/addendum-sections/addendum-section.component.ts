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

import { AddendumSection } from "./addendum-section.interface";
import { GET_ADDENDUM_SECTION } from "./addendum-section.graphql";
import { addendumSectionUpsertBtn, addendumSection$ } from "./addendum-section.form";

@Component({
  selector: 'app-addendum-section.',
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
export class AddendumSectionComponent extends BaseComponent  {
  override title = 'Addendum Section';
  override subtitle = 'Addendum Section Management';
  override actionButtons: ActionButton[] = [addendumSectionUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_ADDENDUM_SECTION,
    refetchActions: [addendumSection$],
    data$: new BehaviorSubject<AddendumSection | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.modifiedSectionTitle,
    variables: { sectionUid:this.route.snapshot?.paramMap?.get('addendumSectionUid')},
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
