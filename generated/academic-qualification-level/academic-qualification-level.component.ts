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

import { AcademicQualificationLevel } from "./academic-qualification-level.interface";
import { FIND_ACADEMIC_QUALIFICATION_LEVEL_BY_ID } from "./academic-qualification-level.graphql";
import { academicQualificationLevelUpsertBtn, academicQualificationLevel$ } from "./academic-qualification-level.form";

@Component({
  selector: 'app-academic-qualification-level.',
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
export class AcademicQualificationLevelComponent extends BaseComponent  {
  override title = 'Academic Qualification Level';
  override subtitle = 'Academic Qualification Level Management';
  override actionButtons: ActionButton[] = [academicQualificationLevelUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_ACADEMIC_QUALIFICATION_LEVEL_BY_ID,
    refetchActions: [academicQualificationLevel$],
    data$: new BehaviorSubject<AcademicQualificationLevel | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.name,
    variables: { id:this.route.snapshot?.paramMap?.get('academicQualificationLevelUid')},
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
