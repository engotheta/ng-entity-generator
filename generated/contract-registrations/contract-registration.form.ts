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

import { SAVE_OR_UPDATE_CONTRACT_REGISTRATION } from './contract-registration.graphql';
import { ContractRegistration } from './contract-registration.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  ContractType} from './contract-registration.interface';
import {  ContractExecutionStatus} from './contract-registration.interface';

//Listener for all ContractRegistration actions 
export const contractRegistration$ = new Subject<ContractRegistration | any>();

export const getContractRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "active",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "amount",
    type: FieldType.decimal,
    validations: [],
  },
  {
    key: "contractDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "contractManager",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "contractNumber",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "contractType",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(ContractType)  },
  {
    key: "createdAt",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "createdBy",
    type: FieldType.formGroup,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "deletedAt",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "deletedBy",
    type: FieldType.number,
    validations: [],
  },
  {
    key: "department",
    type: FieldType.formGroup,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
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
    key: "executionStatus",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(ContractExecutionStatus)  },
  {
    key: "id",
    type: FieldType.number,
    validations: [],
    visible: false,
  },
  {
    key: "isDeleted",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "migrated",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "serviceProvider",
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
    key: "updatedAt",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "updatedBy",
    type: FieldType.number,
    validations: [],
  },
];

export function contractRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: ContractRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Contract Registration',
        fields: getContractRegistrationFormFields(comp),
        closeAction$: contractRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {contractRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_CONTRACT_REGISTRATION : undefined,
            successFn: (res) => contractRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Contract Registration'),
  };
}

export function contractRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Contract Registration',
    click: (data: ContractRegistration) => navigateRelativeTo(comp, 'contract-registrations', data?.uid),
    permissions: [],
  };
}

 export function contractRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: ContractRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => contractRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Contract Registration', 'name'),
    permissions: [],
  };
}

export function contractRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        contractRegistrationViewBtn(comp),
        contractRegistrationUpsertBtn(comp),
        contractRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

