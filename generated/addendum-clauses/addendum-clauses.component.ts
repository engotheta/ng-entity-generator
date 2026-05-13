import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { GET_ADDENDUM_CLAUSES_BY_SECTION } from './addendum-clause.graphql';
import { addendumClauseUpsertBtn } from './addendum-clause.form';
import { addendumClauseTableBtns, addendumClause$ } from './addendum-clause.form';

@Component({
  selector: 'app-addendum-clauses',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AddendumClausesComponent extends BaseComponent {
  override title: string = 'Addendum Clauses Management';
  override subtitle: string = 'Addendum Clauses List';
  override actionButtons: ActionButton[] = [addendumClauseUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','clauseTitle', 'action', 'clauseNumber', 'clauseOrder', 'clauseText', 'isMandatory', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: addendumClauseTableBtns(this),
     reloadActions$: [addendumClause$],
     fetchParameter: { query: GET_ADDENDUM_CLAUSES_BY_SECTION },
   };

}

