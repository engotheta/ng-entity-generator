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

import { SAVE_OR_UPDATE_CASE_REGISTRATION } from './case-registration.graphql';
import { CaseRegistration } from './case-registration.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  CaseNature} from './case-registration.interface';

//Listener for all CaseRegistration actions 
export const caseRegistration$ = new Subject<CaseRegistration | any>();

export const getCaseRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "amount",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "dateOfSchedules",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "decision",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "natureOfCase",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(CaseNature)  },
  {
    key: "placeUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_PLACE_PAGEABLE },
    }
  },
  {
    key: "responsibleDepartmentUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_RESPONSIBLE_DEPARTMENT_PAGEABLE },
    }
  },
  {
    key: "responsibleInstitution",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "responsibleOfficerUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_RESPONSIBLE_OFFICER_PAGEABLE },
    }
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "year",
    type: FieldType.input,
    validations: [],
  },
];

export function caseRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: CaseRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Case Registration',
        fields: getCaseRegistrationFormFields(comp),
        closeAction$: caseRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {caseRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_CASE_REGISTRATION : undefined,
            successFn: (res) => caseRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Case Registration'),
  };
}

export function caseRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Case Registration',
    click: (data: CaseRegistration) => navigateRelativeTo(comp, 'case-registrations', data?.uid),
    permissions: [],
  };
}

 export function caseRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: CaseRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => caseRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Case Registration', 'name'),
    permissions: [],
  };
}

export function caseRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        caseRegistrationViewBtn(comp),
        caseRegistrationUpsertBtn(comp),
        caseRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

