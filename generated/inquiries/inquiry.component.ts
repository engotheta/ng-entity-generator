import { Component OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageHeaderComponent } from "@shared/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { ContentParameter } from "@shared/components/contents-view/view.interface";
import { FetchParameter } from '@shared/services/fetch.service';
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import { ContentsViewComponent } from "@shared/components/contents-view/contents-view.component";

import { Inquiry } from "./inquiry.interface";
import { GET_INQUIRY_BY_UID } from "./inquiry.graphql";
import { inquiryUpsertBtn, inquiry$ } from "./inquiry.form";

@Component({
  selector: 'app-inquiry.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="size-full flex-1 flex flex-col gap-2">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="inquiry"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class InquiryComponent extends BaseComponent implements OnInit {
  override title = 'Inquiry';
  override subtitle = 'Inquiry Management';

  inquiry: Inquiry | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [inquiryUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: GET_INQUIRY_BY_UID,
    successFn:(res) => this.title = res?.data?.clientName,
    variables: { uid:this.route.snapshot?.paramMap?.get('inquiryUid')},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(inquiry$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.inquiry = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        icon: 'notes',
        showUndefined: true,
        entity: this.inquiry,
        fetchParameter: this.fetchParameter,
      },
    ];
  }

}
