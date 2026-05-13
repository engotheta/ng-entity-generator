import { Component, OnInit } from "@angular/core";
import { PageHeaderComponent } from "@shared/page-header.component";
import { BaseComponent } from "@shared/components/base-componet/base-component";
import { DataGridComponent } from "@shared/components/data-grid/data-grid.component";
import { ActionButton } from "@shared/components/action-buttons/action-buttons.inteface";
import {
  GridParameter,
  GridKeyColumn,
} from "@shared/components/data-grid/data-grid.interfaces";

import { ALL_INQUIRIES_PAGEABLE } from "./inquiry.graphql";
import { inquiryUpsertBtn } from "./inquiry.form";
import { inquiryTableBtns, inquiry$ } from "./inquiry.form";

@Component({
  selector: "app-inquiries",
  imports: [DataGridComponent, PageHeaderComponent],
  template: `
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header
        [title]="title"
        [subtitle]="subtitle"
        [actionButtons]="actionButtons"
      />
      <data-grid
        class="grow flex flex-col"
        theme="simple"
        [gridParameter]="gridParameter"
      />
    </div>
  `,
})
export class InquiriesComponent extends BaseComponent {
  override title: string = "Inquiries Management";
  override subtitle: string = "Inquiries List";
  override actionButtons: ActionButton[] = [inquiryUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = [
    "index",
    "clientName",
    "description",
    "attendee",
    "closedBy",
    "destination",
    "district",
    "actions",
  ];

  gridParameter: GridParameter = {
    title: this.route.snapshot.data["name"],
    icon: this.route.snapshot.data["icon"],
    keyColumns: this.keyColumns,
    actionButtons: inquiryTableBtns(this),
    reloadActions$: [inquiry$],
    fetchParameter: { query: ALL_INQUIRIES_PAGEABLE },
  };
}
