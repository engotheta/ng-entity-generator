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

import { SAVE_OR_UPDATE_INSURANCE_REGISTRATION } from './insurance-registration.graphql';
import { InsuranceRegistration } from './insurance-registration.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  InsuranceType} from './insurance-registration.interface';

//Listener for all InsuranceRegistration actions 
export const insuranceRegistration$ = new Subject<InsuranceRegistration | any>();

export const getInsuranceRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "coverage",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "duration",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "endDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "insuranceType",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InsuranceType)  },
  {
    key: "nameOfAsset",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "startDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "statusOfIncident",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "value",
    type: FieldType.decimal,
    validations: [],
  },
];

export function insuranceRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: InsuranceRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Insurance Registration',
        fields: getInsuranceRegistrationFormFields(comp),
        closeAction$: insuranceRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {insuranceRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_INSURANCE_REGISTRATION : undefined,
            successFn: (res) => insuranceRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Insurance Registration'),
  };
}

export function insuranceRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Insurance Registration',
    click: (data: InsuranceRegistration) => navigateRelativeTo(comp, 'insurance-registrations', data?.uid),
    permissions: [],
  };
}

 export function insuranceRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: InsuranceRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => insuranceRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Insurance Registration', 'nameOfAsset'),
    permissions: [],
  };
}

export function insuranceRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        insuranceRegistrationViewBtn(comp),
        insuranceRegistrationUpsertBtn(comp),
        insuranceRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

