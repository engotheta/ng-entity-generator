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

import { SAVE_OR_UPDATE_POLICY_REGISTRATION } from './policy-registration.graphql';
import { PolicyRegistration } from './policy-registration.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  PolicyApplicability} from './policy-registration.interface';
import {  PolicyReviewStatus} from './policy-registration.interface';

//Listener for all PolicyRegistration actions 
export const policyRegistration$ = new Subject<PolicyRegistration | any>();

export const getPolicyRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "applicability",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(PolicyApplicability)  },
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "dateOfReview",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "departmentUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_DEPARTMENT_PAGEABLE },
    }
  },
  {
    key: "endorsementDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "expirationDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "reviewStatus",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(PolicyReviewStatus)  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function policyRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: PolicyRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Policy Registration',
        fields: getPolicyRegistrationFormFields(comp),
        closeAction$: policyRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {policyRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_POLICY_REGISTRATION : undefined,
            successFn: (res) => policyRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Policy Registration'),
  };
}

export function policyRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Policy Registration',
    click: (data: PolicyRegistration) => navigateRelativeTo(comp, 'policy-registrations', data?.uid),
    permissions: [],
  };
}

 export function policyRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: PolicyRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => policyRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Policy Registration', 'name'),
    permissions: [],
  };
}

export function policyRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        policyRegistrationViewBtn(comp),
        policyRegistrationUpsertBtn(comp),
        policyRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

