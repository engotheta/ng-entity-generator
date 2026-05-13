import { Subject } from 'rxjs';
import { MORE_BTN } from '@common/components/data-grid/data-grid.constants';
import { FormComponent } from '@common/components/generic-form/form.component';
import { FormParameters } from '@common/components/generic-form/form.interface';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { getDeleteBtnProps } from '@common/components/contents-view/view.helpers';
import { getUpsertBtnProps } from '@common/components/contents-view/view.helpers';
import { navigateRelativeTo } from '@common/components/contents-view/view.helpers';
import { VALIDATOR_REQUIRED } from '@common/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@common/components/generic-form/field.interface';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';

import { undefined, DELETE_ADDENDUM_SECTION_DATA } from './addendum-section-data.graphql';
import { SAVE_OR_UPDATE_ADDENDUM_SECTION_DATA  } from './addendum-section-data.graphql';
import { AddendumSectionData } from './addendum-section-data.interface';
import {  ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS } from "@store/features/agreements/sections-layouts/agreement-clause-templates-layout.graphql";

//Listener for all AddendumSectionData actions 
export const addendumSectionData$ = new Subject<AddendumSectionData | any>();

export const getAddendumSectionDataFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "action",
    type: FieldType.formGroup,
    validations: [VALIDATOR_REQUIRED],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "addendumSectionUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_ADDENDUM_SECTION_PAGEABLE },
    }
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
    class: "col-span-full",
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "refAgreementSectionDatumUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS },
    }
  },
  {
    key: "uuid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function addendumSectionDataUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AddendumSectionData) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Addendum Section Data',
        fields: getAddendumSectionDataFormFields(comp),
        closeAction$: addendumSectionData$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {input:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_ADDENDUM_SECTION_DATA : undefined,
            successFn: (res) => addendumSectionData$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Addendum Section Data','uuid'),
  };
}

export function addendumSectionDataViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Addendum Section Data',
    click: (data: AddendumSectionData) => navigateRelativeTo(comp, 'addendum-section-datas', data?.uuid),
    permissions: [],
  };
}

 export function addendumSectionDataDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AddendumSectionData) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uuid:data.uuid},
        mutation: DELETE_ADDENDUM_SECTION_DATA,
        finalFn: (res) => addendumSectionData$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Addendum Section Data', 'name'),
    permissions: [],
  };
}

export function addendumSectionDataTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        addendumSectionDataViewBtn(comp),
        addendumSectionDataUpsertBtn(comp),
        addendumSectionDataDeleteBtn(comp),
      ],
    },
  ];
}

