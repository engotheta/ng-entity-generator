import { Component, OnInit } from "@angular/core";
import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";
import { ActionListener  } from "@shared";
import { BaseComponent } from "@shared/view/base-component";
import { cloneDeep } from "@apollo/client/utilities";
import { ViewParameter } from "@shared/components/view-component/view-interface";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { getAccountCreditDebitNoteUpsertButton } from "./account-credit-debit-note.form";
import { AccountCreditDebitNoteActions } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.actions";
import { AccountCreditDebitNote } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.model";
import { mapAccountCreditDebitNote } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.selectors";

@Component({
  selector: "app-account-credit-debit-note",
   template: `<view-component [viewParameter]="viewParameter"></view-component>`
})
export class AccountCreditDebitNoteComponent extends BaseComponent implements OnInit {
  title = "Account Credit Debit Note";
  animation = ANIMATION;
  viewParameter: ViewParameter;

  accountCreditDebitNote: AccountCreditDebitNote;
  reloadActions = [ AccountCreditDebitNoteActions.upsertAccountCreditDebitNote ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.setContentParameters();
    this.onNavigateToSelf(() => this.ngOnInit());
  }

  async loadData() {
    let query = undefined;
    let qp: QueryParameter = { mapFunction: mapAccountCreditDebitNote };
    let uid = this.route.snapshot?.paramMap?.get("uid");
    this.accountCreditDebitNote = cloneDeep(await this.fs.getData(qp, query, uid));
  }

  setContentParameters() {
    let data = {accountCreditDebitNoteUid:this.accountCreditDebitNote.uid};
    let subtitle = this.accountCreditDebitNote.finalApprovedByUsername;

    let contentsParameters: ContentParameter[] = [
      {
        icon: "item",
        type: "details",
        slug: "account-credit-debit-note",
        name: subtitle,
        headerButtons: [getAccountCreditDebitNoteUpsertButton(this, false, "edit")],
        entity: this.accountCreditDebitNote,

        fieldsStrings:[
          `finalApprovedByUsername, processName, description valueClass(${HIGHLIGHT})`,
          ...COMMON_FIELD_STRINGS,
        ],

        children: [
          {
            type: "table",
            slug: "account-credit-debit-note-item",
            name: "Account Credit Debit Note Item",
            icon: "item",
            columnsKeys: ['finalApprovedByUsername', 'processName', 'description', 'amountApplied', 'balance', 'client'],
            searchStatesValues: [{ key: "accountCreditDebitNote.uid", value: this.accountCreditDebitNote.uid }],
            mapFunction: mapAccountCreditDebitNoteItem,
            actionButtons: getAccountCreditDebitNoteItemButtons(this, data),
            headerButtons: [getAccountCreditDebitNoteItemUpsertButton(this, false, "add", data)], 
            query: ALL_ACCOUNT_CREDIT_DEBIT_NOTE_ITEM_PAGEABLE, //TODO: put query
            reloadActions: [AccountCreditDebitNoteItemActions.upsertAccountCreditDebitNoteItem, AccountCreditDebitNoteItemActions.deleteAccountCreditDebitNoteItem],
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
