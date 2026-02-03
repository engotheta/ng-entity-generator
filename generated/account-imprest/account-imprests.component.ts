import { Component, OnInit } from '@angular/core';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { PageHeaderComponent } from '@common/page-header.component';
import { ALL_IMPRESTS_PAGEABLE } from './account-imprest.gql';
import { accountImprestUpsertBtn } from './account-imprest.form';
import { accountImprestTableBtns, accountImprest$ } from './account-imprest.form';

@Component({
  selector: 'app-account-imprests',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AccountImprestsComponent extends BaseComponent implements OnInit {
  override title: string = 'Account Imprests Management';
  override subtitle: string = 'Account Imprests List';
  override actionButtons: ActionButton[] = [accountImprestUpsertBtn(this)];

  gridParameter: GridParameter | undefined;

  keyColumns: GridKeyColumn[] = ['title', 'finalApprovedByUsername', 'processName', 'description', 'advanceAccount', 'amount'];

  ngOnInit(): void {
    this.setGridParameter();
  }

  setGridParameter() {
    this.gridParameter = {
      title: 'Account Imprests',
      icon: 'info_circle',
      keyColumns: this.keyColumns,
      actionButtons: accountImprestTableBtns(this),
      reloadActions$: [accountImprest$],
      fetchParameter: { query: ALL_IMPRESTS_PAGEABLE },
    };
  }
}

