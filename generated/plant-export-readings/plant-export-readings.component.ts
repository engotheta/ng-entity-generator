import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { DataGridComponent } from '@shared/components/data-grid/data-grid.component';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';
import { GridParameter, GridKeyColumn } from '@shared/components/data-grid/data-grid.interfaces';

import { ALL_PLANT_EXPORT_READING_PAGEABLE } from './plant-export-reading.graphql';
import { plantExportReadingUpsertBtn } from './plant-export-reading.form';
import { plantExportReadingTableBtns, plantExportReading$ } from './plant-export-reading.form';

@Component({
  selector: 'app-plant-export-readings',
  imports: [DataGridComponent, PageHeaderComponent],
  template: ` 
    <div class="size-full flex-1 flex flex-col gap-3 ">
      <page-header [title]="title" [subtitle]="subtitle" [actionButtons]="actionButtons" />
      <data-grid class="grow flex flex-col" theme="simple" [gridParameter]="gridParameter" />
    </div>
  `,
})
export class PlantExportReadingsComponent extends BaseComponent {
  override title: string = 'Plant Export Readings Management';
  override subtitle: string = 'Plant Export Readings List';
  override actionButtons: ActionButton[] = [plantExportReadingUpsertBtn(this)];

  keyColumns: GridKeyColumn[] = ['index','exportedGas', 'pipelineExportFlowRate', 'pipelineExportPressure', 'pipelineExportTemperature', 'plant', 'actions'];

  gridParameter: GridParameter = {
     title: this.route.snapshot.data['name'],
     icon: this.route.snapshot.data['icon'],
     keyColumns: this.keyColumns,
     actionButtons: plantExportReadingTableBtns(this),
     reloadActions$: [plantExportReading$],
     fetchParameter: { query: ALL_PLANT_EXPORT_READING_PAGEABLE },
   };

}

