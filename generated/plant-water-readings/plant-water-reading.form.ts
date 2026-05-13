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

import { SAVE_PLANT_WATER_READING, undefined } from './plant-water-reading.graphql';
import { PlantWaterReading } from './plant-water-reading.interface';
import {  ALL_PLANT_EXPORT_READING_PAGEABLE } from "@store/routes/plants/plant-export-readings/plant-export-reading.graphql";

//Listener for all PlantWaterReading actions 
export const plantWaterReading$ = new Subject<PlantWaterReading | any>();

export const getPlantWaterReadingFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "plantUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_PLANT_EXPORT_READING_PAGEABLE },
    }
  },
  {
    key: "producedCondensate",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "producedWater",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "waterDewPoint",
    type: FieldType.decimal,
    validations: [],
  },
];

export function plantWaterReadingUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: PlantWaterReading) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Plant Water Reading',
        fields: getPlantWaterReadingFormFields(comp),
        closeAction$: plantWaterReading$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { input:value},
            mutation: SAVE_PLANT_WATER_READING,
            successFn: (res) => plantWaterReading$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Plant Water Reading'),
  };
}

export function plantWaterReadingViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Plant Water Reading',
    click: (data: PlantWaterReading) => navigateRelativeTo(comp, 'plant-water-readings', data?.uid),
    permissions: [],
  };
}

 export function plantWaterReadingDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: PlantWaterReading) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        finalFn: (res) => plantWaterReading$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Plant Water Reading', 'name'),
    permissions: [],
  };
}

export function plantWaterReadingTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        plantWaterReadingViewBtn(comp),
        plantWaterReadingUpsertBtn(comp),
        plantWaterReadingDeleteBtn(comp),
      ],
    },
  ];
}

