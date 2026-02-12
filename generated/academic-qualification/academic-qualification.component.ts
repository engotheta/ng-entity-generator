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

import { AcademicQualification } from "./academic-qualification.interface";
import { FIND_ACADEMIC_QUALIFICATION_BY_ID } from "./academic-qualification.graphql";
import { academicQualificationUpsertBtn, academicQualification$ } from "./academic-qualification.form";

@Component({
  selector: 'app-academic-qualification.',
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
export class AcademicQualificationComponent extends BaseComponent  {
  override title = 'Academic Qualification';
  override subtitle = 'Academic Qualification Management';
  override actionButtons: ActionButton[] = [academicQualificationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_ACADEMIC_QUALIFICATION_BY_ID,
    refetchActions: [academicQualification$],
    data$: new BehaviorSubject<AcademicQualification | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.programName,
    variables: { id:this.route.snapshot?.paramMap?.get('academicQualificationUid')},
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
