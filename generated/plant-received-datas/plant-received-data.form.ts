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

import { SAVE_PLANT_PROCESSING_DATA, undefined } from './plant-received-data.graphql';
import { PlantReceivedData } from './plant-received-data.interface';
import {  ALL_CLIENT_PAGEABLE } from "@store/routes/gas-nomination/clients/clients.graphql";
import {  ALL_PLANT_EXPORT_READING_PAGEABLE } from "@store/routes/plants/plant-export-readings/plant-export-reading.graphql";

//Listener for all PlantReceivedData actions 
export const plantReceivedData$ = new Subject<PlantReceivedData | any>();

export const getPlantReceivedDataFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "availableCapacity",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "clientUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_CLIENT_PAGEABLE },
    }
  },
  {
    key: "flaredGas",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "ownUseGas",
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
    key: "producedGas",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "receivedRawGasPressure",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "receivedRawGasTemperature",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "receivedRawGasVolume",
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
    key: "utilizedCapacity",
    type: FieldType.decimal,
    validations: [],
  },
];

export function plantReceivedDataUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: PlantReceivedData) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Plant Received Data',
        fields: getPlantReceivedDataFormFields(comp),
        closeAction$: plantReceivedData$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { input:value},
            mutation: SAVE_PLANT_PROCESSING_DATA,
            successFn: (res) => plantReceivedData$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Plant Received Data'),
  };
}

export function plantReceivedDataViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Plant Received Data',
    click: (data: PlantReceivedData) => navigateRelativeTo(comp, 'plant-received-datas', data?.uid),
    permissions: [],
  };
}

 export function plantReceivedDataDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: PlantReceivedData) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        finalFn: (res) => plantReceivedData$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Plant Received Data', 'name'),
    permissions: [],
  };
}

export function plantReceivedDataTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        plantReceivedDataViewBtn(comp),
        plantReceivedDataUpsertBtn(comp),
        plantReceivedDataDeleteBtn(comp),
      ],
    },
  ];
}

