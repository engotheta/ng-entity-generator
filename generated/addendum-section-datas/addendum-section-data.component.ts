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

import { AddendumSectionData } from "./addendum-section-data.interface";
import { GET_ADDENDUM_SECTION_DATA_BY_UID } from "./addendum-section-data.graphql";
import { addendumSectionDataUpsertBtn, addendumSectionData$ } from "./addendum-section-data.form";

@Component({
  selector: 'app-addendum-section-data.',
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
export class AddendumSectionDataComponent extends BaseComponent  {
  override title = 'Addendum Section Data';
  override subtitle = 'Addendum Section Data Management';
  override actionButtons: ActionButton[] = [addendumSectionDataUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_ADDENDUM_SECTION_DATA_BY_UID,
    refetchActions: [addendumSectionData$],
    data$: new BehaviorSubject<AddendumSectionData | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { uuid:this.route.snapshot?.paramMap?.get('addendumSectionDataUid')},
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
