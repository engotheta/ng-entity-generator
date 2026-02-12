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

import { AcademicQualificationLevelResponse } from "./academic-qualification-level-response.interface";
import { FIND_ACADEMIC_QUALIFICATION_LEVEL_BY_ID } from "./academic-qualification-level-response.graphql";
import { academicQualificationLevelResponseUpsertBtn, academicQualificationLevelResponse$ } from "./academic-qualification-level-response.form";

@Component({
  selector: 'app-academic-qualification-level-response.',
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
export class AcademicQualificationLevelResponseComponent extends BaseComponent  {
  override title = 'Academic Qualification Level Response';
  override subtitle = 'Academic Qualification Level Response Management';
  override actionButtons: ActionButton[] = [academicQualificationLevelResponseUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_ACADEMIC_QUALIFICATION_LEVEL_BY_ID,
    refetchActions: [academicQualificationLevelResponse$],
    data$: new BehaviorSubject<AcademicQualificationLevelResponse | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { id:this.route.snapshot?.paramMap?.get('academicQualificationLevelResponseUid')},
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
