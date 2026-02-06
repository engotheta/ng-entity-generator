import { CommonModule } from "@angular/common";
import { Component , OnInit } from "@angular/core";
import { ContentParameter } from "@common/components/contents-view/view.interface";
import { ContentsViewComponent } from "@common/components/contents-view/contents-view.component";
import { PageHeaderComponent } from "@common/page-header.component";
import { BaseComponent } from "@common/components/base-componet/base-component";
import { ActionButton } from "@common/components/action-buttons/action-buttons.inteface";
import { accountImprestUpsertBtn, accountImprest$ } from "./account-imprest.form";
import { AccountImprest } from "./account-imprest.interface";
import { FIND_IMPREST } from "./account-imprest.graphql";

@Component({
  selector: 'app-account-imprest.',
  imports: [CommonModule, PageHeaderComponent, ContentsViewComponent ],
  template: `
    <!--  -->
    <div class="flex-1 flex flex-col gap-2">
      <app-page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
        [data]="accountImprest"
      />
      <contents-view class="block grow" [contents]="contents" />
    </div>
   `
})
export class AccountImprestComponent extends BaseComponent implements OnInit {
  override title = 'Account Imprest';
  override subtitle = 'Account Imprest Management';

  accountImprest: AccountImprest | undefined;
  override contents: ContentParameter[] = [];
  override actionButtons: ActionButton[] = [accountImprestUpsertBtn(this)];

  fetchParameter: FetchParameter = {
    loadingOn: 'no-content',
    query: FIND_IMPREST,
    variables: { uid:this.route.snapshot?.paramMap?.get('accountImprestUid')},
    successFn:(res) => {this.title = res?.data?.title},
  };

  async ngOnInit(): Promise<void> {
    await this.setContents();
    this.subs.add(accountImprest$.subscribe(() => this.setContents()));
  }

  async setContents() {
    this.accountImprest = await this.fs.fetch(this.fetchParameter);

    this.contents = [
      {
        type: 'details',
        entity: this.accountImprest,
        showUndefined: true,
        icon: 'notes',
        fetchParameter: this.fetchParameter,
        children: [
          {
            type: "table",
            slug: "account-imprest-line-item",
            label: "Account Imprest Line Item",
            icon: "circle",
            keyColumns: ['title', 'finalApprovedByUsername', 'processName', 'description', 'advanceAccount', 'amount'],
            gridData: this.accountImprest.items,
          },
          {
            type: "table",
            slug: "account-imprest-retirement",
            label: "Account Imprest Retirement",
            icon: "circle",
            keyColumns: ['title', 'finalApprovedByUsername', 'processName', 'description', 'advanceAccount', 'amount'],
            gridData: this.accountImprest.retirements,
          },
        ],
      },
    ];
  }

}
