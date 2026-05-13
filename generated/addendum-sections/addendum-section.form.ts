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

import { undefined, DELETE_ADDENDUM_SECTION } from './addendum-section.graphql';
import { SAVE_OR_UPDATE_ADDENDUM_SECTION  } from './addendum-section.graphql';
import { AddendumSection } from './addendum-section.interface';
import {  ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS } from "@store/features/agreements/sections-layouts/agreement-clause-templates-layout.graphql";

//Listener for all AddendumSection actions 
export const addendumSection$ = new Subject<AddendumSection | any>();

export const getAddendumSectionFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "action",
    type: FieldType.formGroup,
    validations: [VALIDATOR_REQUIRED],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "addendumUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_ADDENDUM_PAGEABLE },
    }
  },
  {
    key: "hasClause",
    type: FieldType.checkbox,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "layoutSectionUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_LAYOUT_SECTION_PAGEABLE },
    }
  },
  {
    key: "modificationNotes",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "modifiedSectionTitle",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "refAgreementSectionUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS },
    }
  },
  {
    key: "sectionTitle",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "sequenceOrder",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "uuid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function addendumSectionUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AddendumSection) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Addendum Section',
        fields: getAddendumSectionFormFields(comp),
        closeAction$: addendumSection$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {input:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_ADDENDUM_SECTION : undefined,
            successFn: (res) => addendumSection$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Addendum Section','uuid'),
  };
}

export function addendumSectionViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Addendum Section',
    click: (data: AddendumSection) => navigateRelativeTo(comp, 'addendum-sections', data?.uuid),
    permissions: [],
  };
}

 export function addendumSectionDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AddendumSection) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {addendumSectionUid:data.uuid},
        mutation: DELETE_ADDENDUM_SECTION,
        finalFn: (res) => addendumSection$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Addendum Section', 'modifiedSectionTitle'),
    permissions: [],
  };
}

export function addendumSectionTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        addendumSectionViewBtn(comp),
        addendumSectionUpsertBtn(comp),
        addendumSectionDeleteBtn(comp),
      ],
    },
  ];
}

