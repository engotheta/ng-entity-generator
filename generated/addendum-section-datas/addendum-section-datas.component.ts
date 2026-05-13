import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/page-header.component';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { DataGridComponent } from '@common/components/data-grid/data-grid.component';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@common/components/data-grid/data-grid.interfaces';

import { RESTORE_ADDENDUM_SECTION_DATA } from './addendum-section-data.graphql';
import { addendumSectionDataUpsertBtn } from './addendum-section-data.form';
import { addendumSectionDataTableBtns, addendumSectionData$ } from './addendum-section-data.form';

@Component({
  selector: 'app-addendum-section-datas',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <app-page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class AddendumSectionDatasComponent extends BaseComponent {
  override title: string = 'Addendum Section Datas Management';
  override subtitle: string = 'Addendum Section Datas List';
  override actionButtons: ActionButton[] = [addendumSectionDataUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','name', 'description', 'action', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['label'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: addendumSectionDataTableBtns(this),
     reloadActions$: [addendumSectionData$],
     fetchParameter: { query: RESTORE_ADDENDUM_SECTION_DATA },
   };

}

