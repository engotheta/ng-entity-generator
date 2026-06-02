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

import { SAVE_OR_UPDATE_LICENCE_REGISTRATION } from './licence-registration.graphql';
import { LicenceRegistration } from './licence-registration.interface';

//Listener for all LicenceRegistration actions 
export const licenceRegistration$ = new Subject<LicenceRegistration | any>();

export const getLicenceRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "condition",
    type: FieldType.input,
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
    key: "duration",
    type: FieldType.input,
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
    key: "renewalRequirement",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function licenceRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: LicenceRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Licence Registration',
        fields: getLicenceRegistrationFormFields(comp),
        closeAction$: licenceRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {licenceRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_LICENCE_REGISTRATION : undefined,
            successFn: (res) => licenceRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Licence Registration'),
  };
}

export function licenceRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Licence Registration',
    click: (data: LicenceRegistration) => navigateRelativeTo(comp, 'licence-registrations', data?.uid),
    permissions: [],
  };
}

 export function licenceRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: LicenceRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => licenceRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Licence Registration', 'name'),
    permissions: [],
  };
}

export function licenceRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        licenceRegistrationViewBtn(comp),
        licenceRegistrationUpsertBtn(comp),
        licenceRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

