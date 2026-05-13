import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { DELETE_ADDENDUM_SECTION } from './addendum-section.graphql';
import { addendumSectionUpsertBtn } from './addendum-section.form';
import { addendumSectionTableBtns, addendumSection$ } from './addendum-section.form';

@Component({
  selector: 'app-addendum-sections',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AddendumSectionsComponent extends BaseComponent {
  override title: string = 'Addendum Sections Management';
  override subtitle: string = 'Addendum Sections List';
  override actionButtons: ActionButton[] = [addendumSectionUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','modifiedSectionTitle', 'sectionTitle', 'action', 'hasClause', 'layoutSectionId', 'modificationNotes', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: addendumSectionTableBtns(this),
     reloadActions$: [addendumSection$],
     fetchParameter: { query: DELETE_ADDENDUM_SECTION },
   };

}

