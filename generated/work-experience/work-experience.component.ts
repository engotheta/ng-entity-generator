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

import { WorkExperience } from "./work-experience.interface";
import { FIND_WORK_EXPERIENCE_BY_ID } from "./work-experience.graphql";
import { workExperienceUpsertBtn, workExperience$ } from "./work-experience.form";

@Component({
  selector: 'app-work-experience.',
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
export class WorkExperienceComponent extends BaseComponent  {
  override title = 'Work Experience';
  override subtitle = 'Work Experience Management';
  override actionButtons: ActionButton[] = [workExperienceUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_WORK_EXPERIENCE_BY_ID,
    refetchActions: [workExperience$],
    data$: new BehaviorSubject<WorkExperience | undefined>(undefined),
    successFn:(res) => this.title = res?.data?.institutionName,
    variables: { id:this.route.snapshot?.paramMap?.get('workExperienceUid')},
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
