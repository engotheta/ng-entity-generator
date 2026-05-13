import { Subject } from 'rxjs';
import { MORE_BTN } from '@shared/components/data-grid/data-grid.constants';
import { FormComponent } from '@shared/components/generic-form/form.component';
import { FormParameters } from '@shared/components/generic-form/form.interface';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { getDeleteBtnProps } from '@shared/components/view-component/view.helpers';
import { getUpsertBtnProps } from '@shared/components/view-component/view.helpers';
import { navigateRelativeTo } from '@shared/components/view-component/view.helpers';
import { VALIDATOR_REQUIRED } from '@shared/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@shared/components/generic-form/field.interface';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';

import { SAVE_PLANT_EXPORT_READING, undefined } from './plant-export-reading.graphql';
import { PlantExportReading } from './plant-export-reading.interface';
import {  ALL_PLANT_EXPORT_READING_PAGEABLE } from "@store/routes/plants/plant-export-readings/plant-export-reading.graphql";

//Listener for all PlantExportReading actions 
export const plantExportReading$ = new Subject<PlantExportReading | any>();

export const getPlantExportReadingFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "exportedGas",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "pipelineExportFlowRate",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "pipelineExportPressure",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "pipelineExportTemperature",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "plantUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_PLANT_EXPORT_READING_PAGEABLE },
    }
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function plantExportReadingUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: PlantExportReading) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Plant Export Reading',
        fields: getPlantExportReadingFormFields(comp),
        closeAction$: plantExportReading$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { input:value},
            mutation: SAVE_PLANT_EXPORT_READING,
            successFn: (res) => plantExportReading$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Plant Export Reading'),
  };
}

export function plantExportReadingViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Plant Export Reading',
    click: (data: PlantExportReading) => navigateRelativeTo(comp, 'plant-export-readings', data?.uid),
    permissions: [],
  };
}

 export function plantExportReadingDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: PlantExportReading) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        finalFn: (res) => plantExportReading$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Plant Export Reading', 'name'),
    permissions: [],
  };
}

export function plantExportReadingTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        plantExportReadingViewBtn(comp),
        plantExportReadingUpsertBtn(comp),
        plantExportReadingDeleteBtn(comp),
      ],
    },
  ];
}

