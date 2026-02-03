import { Component, OnInit } from "@angular/core";
import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";
import { ActionListener  } from "@shared";
import { BaseComponent } from "@shared/view/base-component";
import { cloneDeep } from "@apollo/client/utilities";
import { ViewParameter } from "@shared/components/view-component/view-interface";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { getGeneralLedgerEntryDtoUpsertButton } from "./general-ledger-entry-dto.form";
import { GeneralLedgerEntryDtoActions } from "@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.actions";
import { GeneralLedgerEntryDto } from "@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.model";
import { mapGeneralLedgerEntryDto } from "@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.selectors";

@Component({
  selector: "app-general-ledger-entry-dto",
   template: `<view-component [viewParameter]="viewParameter"></view-component>`
})
export class GeneralLedgerEntryDtoComponent extends BaseComponent implements OnInit {
  title = "General Ledger Entry Dto";
  animation = ANIMATION;
  viewParameter: ViewParameter;

  generalLedgerEntryDto: GeneralLedgerEntryDto;
  reloadActions = [ GeneralLedgerEntryDtoActions.upsertGeneralLedgerEntryDto ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.setContentParameters();
    this.onNavigateToSelf(() => this.ngOnInit());
  }

  async loadData() {
    let query = undefined;
    let qp: QueryParameter = { mapFunction: mapGeneralLedgerEntryDto };
    let uid = this.route.snapshot?.paramMap?.get("uid");
    this.generalLedgerEntryDto = cloneDeep(await this.fs.getData(qp, query, uid));
  }

  setContentParameters() {
    let data = {generalLedgerEntryDtoUid:this.generalLedgerEntryDto.uid};
    let subtitle = this.generalLedgerEntryDto.description;

    let contentsParameters: ContentParameter[] = [
      {
        icon: "item",
        type: "details",
        slug: "general-ledger-entry-dto",
        name: subtitle,
        headerButtons: [getGeneralLedgerEntryDtoUpsertButton(this, false, "edit")],
        entity: this.generalLedgerEntryDto,

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
