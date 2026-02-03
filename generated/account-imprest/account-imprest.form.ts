import { getDeleteBtnProps } from '@common/components/contents-view/view.helpers';
import { getUpsertBtnProps } from '@common/components/contents-view/view.helpers';
import { navigateRelativeTo } from '@common/components/contents-view/view.helpers';
import { FieldConfig, FieldType } from '@common/components/generic-form/field.interface';
import { VALIDATOR_REQUIRED } from '@common/components/generic-form/form-constants';
import { FormComponent } from '@common/components/generic-form/form.component';
import { FormParameters } from '@common/components/generic-form/form.interface';
import { MORE_BTN } from '@common/table/data-grid-constants';
import { ActionButton } from '@common/table/resusable-table-action-button-action-interface';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { Subject } from 'rxjs';
import { SAVE_IMPREST, undefined } from './account-imprest.gql';
import { AccountImprest } from './account-imprest.interface';

export const accountImprest$ = new Subject<AccountImprest | any>();

export const getAccountImprestFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "advanceAccountUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_ADVANCE_ACCOUNT_PAGEABLE },
    }
  },
  {
    key: "amount",
    type: FieldType.number,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "bankAccountUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_BANK_ACCOUNT_PAGEABLE },
    }
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
    class: "col-span-full",
  },
  {
    key: "dueDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "financialYearUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_FINANCIAL_YEAR_PAGEABLE },
    }
  },
  {
    key: "holderClientUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_HOLDER_CLIENT_PAGEABLE },
    }
  },
  {
    key: "holderEmployeeUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_HOLDER_EMPLOYEE_PAGEABLE },
    }
  },
  {
    key: "items",
    type: FieldType.formGroupArray,
    validations: [VALIDATOR_REQUIRED],
    class: "col-span-full",
    fields:[
      {
		    key: "chartOfAccountUid",
		    type: FieldType.select,
		    validations: [VALIDATOR_REQUIRED],
		    optionsVariables : {
		      fetchParameter:{ query:ALL_CHART_OF_ACCOUNT_PAGEABLE },
		    }
		  },
		  {
		    key: "description",
		    type: FieldType.textarea,
		    validations: [VALIDATOR_REQUIRED],
		    class: "col-span-full",
		  },
		  {
		    key: "quantity",
		    type: FieldType.number,
		    validations: [VALIDATOR_REQUIRED],
		  },
		  {
		    key: "uid",
		    type: FieldType.input,
		    validations: [],
		    visible: false,
		  },
		  {
		    key: "unitCost",
		    type: FieldType.number,
		    validations: [VALIDATOR_REQUIRED],
		  },
		],
  },
  {
    key: "referenceNumber",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "requestDate",
    type: FieldType.date,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "title",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export const getAccountImprestForm = (comp: BaseComponent, data?: any): FormParameters => ({
  fields: getAccountImprestFormFields(comp),
  title: 'Account Imprest',
  model: data,

   onSubmit: async (data: any) => {
     await comp.fs.fetch({
      notify: true,
      variables: { accountImprestDto: data },
      successFn: (res) => accountImprest$.next(res?.data),
      mutation: SAVE_IMPREST,
   });
   },
 });

 export async function openAccountImprestForm(comp: BaseComponent, accountImprest?: any) {
  comp.vs?.openDialog({
    component: FormComponent,
    data: getAccountImprestForm(comp, accountImprest),
    width: '96%',
   maxWidth: '720px',
    closeAction$: accountImprest$,
   });
 }

export function accountImprestViewBtn(comp: BaseComponent) {
  return <ActionButton>{
    label: 'View Account Imprest',
    icon: 'view',
    click: (data: AccountImprest) => navigateRelativeTo(comp, 'account-imprests', data?.uid),
    permissions: [],
  };
}

export function accountImprestUpsertBtn(comp: BaseComponent) {
  return <ActionButton>{
    ...getUpsertBtnProps('Account Imprest'),
    click: (data?: AccountImprest) => openAccountImprestForm(comp, data),
    permissions: [],
  };
}

 export function accountImprestDeleteBtn(comp: BaseComponent) {
  return <ActionButton>{
    ...getDeleteBtnProps('Account Imprest', 'name'),
    permissions: [],

    click: async (data: AccountImprest) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: { accountImprestUid: data.uid },
        finalFn: (res) => accountImprest$.next(res?.data),
        mutation: undefined,
      });
    },
  };
}

export function accountImprestTableBtns(comp: BaseComponent) {
  return <ActionButton[]>[
    {
      ...MORE_BTN,
      buttons: [
        accountImprestViewBtn(comp),
        accountImprestUpsertBtn(comp),
        accountImprestDeleteBtn(comp),
      ],
    },
  ];
}

