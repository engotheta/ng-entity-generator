import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { RESTORE_ADDENDUM_CLAUSE_SPECIFICATION } from './addendum-clause-spec.graphql';
import { addendumClauseSpecUpsertBtn } from './addendum-clause-spec.form';
import { addendumClauseSpecTableBtns, addendumClauseSpec$ } from './addendum-clause-spec.form';

@Component({
  selector: 'app-addendum-clause-specs',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AddendumClauseSpecsComponent extends BaseComponent {
  override title: string = 'Addendum Clause Specs Management';
  override subtitle: string = 'Addendum Clause Specs List';
  override actionButtons: ActionButton[] = [addendumClauseSpecUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','refSpecificationId', 'requiredData', 'specification', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: addendumClauseSpecTableBtns(this),
     reloadActions$: [addendumClauseSpec$],
     fetchParameter: { query: RESTORE_ADDENDUM_CLAUSE_SPECIFICATION },
   };

}

