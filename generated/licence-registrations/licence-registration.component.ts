import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/components/page-header/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { FetchParameter } from "@shared/fetch/fetch.interface";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/view-component/contents-view/contents-view.component";

import { LicenceRegistration } from "./licence-registration.interface";
import { GET_LICENCE_REGISTRATION_BY_UID } from "./licence-registration.graphql";
import { licenceRegistrationUpsertBtn, licenceRegistration$ } from "./licence-registration.form";

@Component({
  selector: 'app-licence-registration.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="licenceRegistration"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class LicenceRegistrationComponent extends BaseComponent implements OnInit {
  override title = 'Licence Registration';
  override subtitle = 'Licence Registration Management';

  licenceRegistration: LicenceRegistration | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [licenceRegistrationUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_LICENCE_REGISTRATION_BY_UID,
    successFn:(res) => this.title = res?.data?.name,
    variables: { uid:this.route.snapshot?.paramMap?.get('licenceRegistrationUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(licenceRegistration$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.licenceRegistration = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.licenceRegistration,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
