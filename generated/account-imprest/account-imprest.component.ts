import { Component, OnInit } from "@angular/core";
import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";
import { ActionListener  } from "@shared";
import { BaseComponent } from "@shared/view/base-component";
import { cloneDeep } from "@apollo/client/utilities";
import { ViewParameter } from "@shared/components/view-component/view-interface";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { getAccountImprestUpsertButton } from "./account-imprest.form";
import { AccountImprestActions } from "@store/entities/accounts/account-imprest/account-imprest.actions";
import { AccountImprest } from "@store/entities/accounts/account-imprest/account-imprest.model";
import { mapAccountImprest } from "@store/entities/accounts/account-imprest/account-imprest.selectors";

@Component({
  selector: "app-account-imprest",
   template: `<view-component [viewParameter]="viewParameter"></view-component>`
})
export class AccountImprestComponent extends BaseComponent implements OnInit {
  title = "Account Imprest";
  animation = ANIMATION;
  viewParameter: ViewParameter;

  accountImprest: AccountImprest;
  reloadActions = [ AccountImprestActions.upsertAccountImprest ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.setContentParameters();
    this.onNavigateToSelf(() => this.ngOnInit());
  }

  async loadData() {
    let query = undefined;
    let qp: QueryParameter = { mapFunction: mapAccountImprest };
    let uid = this.route.snapshot?.paramMap?.get("uid");
    this.accountImprest = cloneDeep(await this.fs.getData(qp, query, uid));
  }

  setContentParameters() {
    let data = {accountImprestUid:this.accountImprest.uid};
    let subtitle = this.accountImprest.title;

    let contentsParameters: ContentParameter[] = [
      {
        icon: "item",
        type: "details",
        slug: "account-imprest",
        name: subtitle,
        headerButtons: [getAccountImprestUpsertButton(this, false, "edit")],
        entity: this.accountImprest,

        fieldsStrings:[
          `title, finalApprovedByUsername, processName, description valueClass(${HIGHLIGHT})`,
          ...COMMON_FIELD_STRINGS,
        ],

        children: [
          {
            type: "table",
            slug: "account-imprest-line-item",
            name: "Account Imprest Line Item",
            icon: "item",
            columnsKeys: ['title', 'finalApprovedByUsername', 'processName', 'description', 'advanceAccount', 'amount'],
            searchStatesValues: [{ key: "accountImprest.uid", value: this.accountImprest.uid }],
            mapFunction: mapAccountImprestLineItem,
            actionButtons: getAccountImprestLineItemButtons(this, data),
            headerButtons: [getAccountImprestLineItemUpsertButton(this, false, "add", data)], 
            query: ALL_ACCOUNT_IMPREST_LINE_ITEM_PAGEABLE, //TODO: put query
            reloadActions: [AccountImprestLineItemActions.upsertAccountImprestLineItem, AccountImprestLineItemActions.deleteAccountImprestLineItem],
          },
          {
            type: "table",
            slug: "account-imprest-retirement",
            name: "Account Imprest Retirement",
            icon: "item",
            columnsKeys: ['title', 'finalApprovedByUsername', 'processName', 'description', 'advanceAccount', 'amount'],
            searchStatesValues: [{ key: "accountImprest.uid", value: this.accountImprest.uid }],
            mapFunction: mapAccountImprestRetirement,
            actionButtons: getAccountImprestRetirementButtons(this, data),
            headerButtons: [getAccountImprestRetirementUpsertButton(this, false, "add", data)], 
            query: ALL_ACCOUNT_IMPREST_RETIREMENT_PAGEABLE, //TODO: put query
            reloadActions: [AccountImprestRetirementActions.upsertAccountImprestRetirement, AccountImprestRetirementActions.deleteAccountImprestRetirement],
          },
        ],
      },
    ];

    //set view
    this.viewParameter = {
      animation: this.animation,
      title: this.title,
      subtitle: subtitle,
      contentsParameters,
    };
  }

  listenToActions() {
    const listeners: ActionListener[] = [
      { actions: [...this.reloadActions], callback: () => this.loadData()},
    ];

    this.addActionListeners(listeners);
  }
}
