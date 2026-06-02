import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { OpinionRegistration } from "./opinion-registration.interface";
import { GET_OPINION_REGISTRATION_BY_UID } from "./opinion-registration.graphql";
import { opinionRegistrationUpsertBtn, opinionRegistration$ } from "./opinion-registration.form";

@Component({
  selector: 'app-opinion-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="opinionRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class OpinionRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Opinion Registration';
  override subtitle = 'Opinion Registration Management';

  opinionRegistration: OpinionRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [opinionRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_OPINION_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.name,
    variables: { uid:this.route.snapshot?.paramMap?.get('opinionRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(opinionRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.opinionRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.opinionRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
