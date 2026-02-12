import { Component , OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@common/page-header.component";
import { BaseComponent } from "@common/components/base-componet/base-component";
import { ContentParameter } from "@common/components/contents-view/view.interface";
import { ActionButton } from "@common/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@common/components/contents-view/contents-view.component";

import { AttorneyCv } from "./attorney-cv.interface";
import { VIEW_ATTORNEY_CV } from "./attorney-cv.graphql";
import { attorneyCvUpsertBtn, attorneyCv$ } from "./attorney-cv.form";

@Component({
  selector: 'app-attorney-cv.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="flex-1 flex flex-col gap-2">
      <app-page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="attorneyCv"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class AttorneyCvComponent extends BaseComponent implements OnInit {
  override title = 'Attorney Cv';
  override subtitle = 'Attorney Cv Management';

  attorneyCv: AttorneyCv | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [attorneyCvUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: VIEW_ATTORNEY_CV,
    successFn:(res) => this.title = res?.data?.name,
    variables: { id:this.route.snapshot?.paramMap?.get('attorneyCvUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(attorneyCv$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.attorneyCv = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.attorneyCv,
        fetchParameter: this.fetchParameter,
        children: [
          {
            type: "table",
            slug: "academic-qualification-response",
            label: "Academic Qualification Response",
            icon: "circle",
            keyColumns: ['programName', 'areas', 'attorney', 'attorneyId', 'country', 'countryId'],
            gridData: this.attorneyCv?.academicQualifications ?? [],
          },
          {
            type: "table",
            slug: "competency-response",
            label: "Competency Response",
            icon: "circle",
            keyColumns: ['awardTitle', 'areas', 'attorney', 'attorneyId', 'awardedYear', 'awarder'],
            gridData: this.attorneyCv?.competencyAwards ?? [],
          },
          {
            type: "table",
            slug: "attorney-case-response",
            label: "Attorney Case Response",
            icon: "circle",
            keyColumns: ['attorneyName', 'caseCode', 'amountClaimed', 'caseBrief', 'caseCategory', 'caseNo'],
            gridData: this.attorneyCv?.handledCases ?? [],
          },
          {
            type: "table",
            slug: "membership-minimal",
            label: "Membership Minimal",
            icon: "circle",
            keyColumns: ['name', 'description', 'currentlyMember', 'endDate', 'responsibilities', 'role'],
            gridData: this.attorneyCv?.memberships ?? [],
          },
          {
            type: "table",
            slug: "training-minimal",
            label: "Training Minimal",
            icon: "circle",
            keyColumns: ['description', 'areas', 'attorneyId', 'trainedAt', 'trainedBy', 'trainedTopic'],
            gridData: this.attorneyCv?.trainings ?? [],
          },
          {
            type: "table",
            slug: "attorney-transfer-response",
            label: "Attorney Transfer Response",
            icon: "circle",
            keyColumns: ['attorneyId', 'institution', 'institutionId', 'joinedAt', 'leftAt'],
            gridData: this.attorneyCv?.transfers ?? [],
          },
          {
            type: "table",
            slug: "work-experience-response",
            label: "Work Experience Response",
            icon: "circle",
            keyColumns: ['institutionName', 'areas', 'attorney', 'attorneyId', 'currentlyWorkingHere', 'endDate'],
            gridData: this.attorneyCv?.workExperiences ?? [],
          },
        ],
      },
    ];
  }

}
