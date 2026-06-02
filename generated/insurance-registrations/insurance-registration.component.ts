import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { InsuranceRegistration } from "./insurance-registration.interface";
import { GET_INSURANCE_REGISTRATION_BY_UID } from "./insurance-registration.graphql";
import { insuranceRegistrationUpsertBtn, insuranceRegistration$ } from "./insurance-registration.form";

@Component({
  selector: 'app-insurance-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="insuranceRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class InsuranceRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Insurance Registration';
  override subtitle = 'Insurance Registration Management';

  insuranceRegistration: InsuranceRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [insuranceRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_INSURANCE_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.nameOfAsset,
    variables: { uid:this.route.snapshot?.paramMap?.get('insuranceRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(insuranceRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.insuranceRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.insuranceRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
