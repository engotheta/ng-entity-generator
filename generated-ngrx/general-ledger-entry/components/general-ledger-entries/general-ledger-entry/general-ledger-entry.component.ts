import { Component, OnInit } from "@angular/core";
import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";
import { ActionListener  } from "@shared";
import { BaseComponent } from "@shared/view/base-component";
import { cloneDeep } from "@apollo/client/utilities";
import { ViewParameter } from "@shared/components/view-component/view-interface";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { getGeneralLedgerEntryUpsertButton } from "./general-ledger-entry.form";
import { GeneralLedgerEntryActions } from "@store/entities/accounts/general-ledger-entry/general-ledger-entry.actions";
import { GeneralLedgerEntry } from "@store/entities/accounts/general-ledger-entry/general-ledger-entry.model";
import { mapGeneralLedgerEntry } from "@store/entities/accounts/general-ledger-entry/general-ledger-entry.selectors";

@Component({
  selector: "app-general-ledger-entry",
   template: `<view-component [viewParameter]="viewParameter"></view-component>`
})
export class GeneralLedgerEntryComponent extends BaseComponent implements OnInit {
  title = "General Ledger Entry";
  animation = ANIMATION;
  viewParameter: ViewParameter;

  generalLedgerEntry: GeneralLedgerEntry;
  reloadActions = [ GeneralLedgerEntryActions.upsertGeneralLedgerEntry ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.setContentParameters();
    this.onNavigateToSelf(() => this.ngOnInit());
  }

  async loadData() {
    let query = undefined;
    let qp: QueryParameter = { mapFunction: mapGeneralLedgerEntry };
    let uid = this.route.snapshot?.paramMap?.get("uid");
    this.generalLedgerEntry = cloneDeep(await this.fs.getData(qp, query, uid));
  }

  setContentParameters() {
    let data = {generalLedgerEntryUid:this.generalLedgerEntry.uid};
    let subtitle = this.generalLedgerEntry.description;

    let contentsParameters: ContentParameter[] = [
      {
        icon: "item",
        type: "details",
        slug: "general-ledger-entry",
        name: subtitle,
        headerButtons: [getGeneralLedgerEntryUpsertButton(this, false, "edit")],
        entity: this.generalLedgerEntry,

        fieldsStrings:[
          `description valueClass(${HIGHLIGHT})`,
          ...COMMON_FIELD_STRINGS,
        ],

        children: [
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
