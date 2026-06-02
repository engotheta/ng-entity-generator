import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { PolicyRegistration } from "./policy-registration.interface";
import { GET_POLICY_REGISTRATION_BY_UID } from "./policy-registration.graphql";
import { policyRegistrationUpsertBtn, policyRegistration$ } from "./policy-registration.form";

@Component({
  selector: 'app-policy-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="policyRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class PolicyRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Policy Registration';
  override subtitle = 'Policy Registration Management';

  policyRegistration: PolicyRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [policyRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_POLICY_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.name,
    variables: { uid:this.route.snapshot?.paramMap?.get('policyRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(policyRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.policyRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.policyRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
