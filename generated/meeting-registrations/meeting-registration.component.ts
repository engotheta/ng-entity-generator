import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { MeetingRegistration } from "./meeting-registration.interface";
import { GET_MEETING_REGISTRATION_BY_UID } from "./meeting-registration.graphql";
import { meetingRegistrationUpsertBtn, meetingRegistration$ } from "./meeting-registration.form";

@Component({
  selector: 'app-meeting-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="meetingRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class MeetingRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Meeting Registration';
  override subtitle = 'Meeting Registration Management';

  meetingRegistration: MeetingRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [meetingRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_MEETING_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.name,
    variables: { uid:this.route.snapshot?.paramMap?.get('meetingRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(meetingRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.meetingRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.meetingRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
