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

import { SAVE_OR_UPDATE_OPINION_REGISTRATION } from './opinion-registration.graphql';
import { OpinionRegistration } from './opinion-registration.interface';

//Listener for all OpinionRegistration actions 
export const opinionRegistration$ = new Subject<OpinionRegistration | any>();

export const getOpinionRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "findingStatus",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "nature",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "resolutionStatus",
    type: FieldType.input,
    validations: [],
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
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "valueObtained",
    type: FieldType.input,
    validations: [],
  },
];

export function opinionRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: OpinionRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Opinion Registration',
        fields: getOpinionRegistrationFormFields(comp),
        closeAction$: opinionRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {opinionRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_OPINION_REGISTRATION : undefined,
            successFn: (res) => opinionRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Opinion Registration'),
  };
}

export function opinionRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Opinion Registration',
    click: (data: OpinionRegistration) => navigateRelativeTo(comp, 'opinion-registrations', data?.uid),
    permissions: [],
  };
}

 export function opinionRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: OpinionRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => opinionRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Opinion Registration', 'name'),
    permissions: [],
  };
}

export function opinionRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        opinionRegistrationViewBtn(comp),
        opinionRegistrationUpsertBtn(comp),
        opinionRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

