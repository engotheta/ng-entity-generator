import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { ContractRegistration } from "./contract-registration.interface";
import { GET_CONTRACT_REGISTRATION_BY_UID } from "./contract-registration.graphql";
import { contractRegistrationUpsertBtn, contractRegistration$ } from "./contract-registration.form";

@Component({
  selector: 'app-contract-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="contractRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class ContractRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Contract Registration';
  override subtitle = 'Contract Registration Management';

  contractRegistration: ContractRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [contractRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_CONTRACT_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.name,
    variables: { uid:this.route.snapshot?.paramMap?.get('contractRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(contractRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.contractRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.contractRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
