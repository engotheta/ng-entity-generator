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

import { SAVE_AGREEMENT_VALUE, DELETE_AGREEMENT_VALUE } from './agreement-value.graphql';
import { AgreementValue } from './agreement-value.interface';

//Listener for all AgreementValue actions 
export const agreementValue$ = new Subject<AgreementValue | any>();

export const getAgreementValueFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "active",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "code",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "isDefault",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "name",
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

export function agreementValueUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AgreementValue) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Agreement Value',
        fields: getAgreementValueFormFields(comp),
        closeAction$: agreementValue$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { input:value},
            mutation: SAVE_AGREEMENT_VALUE,
            successFn: (res) => agreementValue$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Agreement Value','uuid'),
  };
}

export function agreementValueViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Agreement Value',
    click: (data: AgreementValue) => navigateRelativeTo(comp, 'agreement-values', data?.uuid),
    permissions: [],
  };
}

 export function agreementValueDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AgreementValue) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uuid:data.uuid},
        mutation: DELETE_AGREEMENT_VALUE,
        finalFn: (res) => agreementValue$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Agreement Value', 'name'),
    permissions: [],
  };
}

export function agreementValueTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        agreementValueViewBtn(comp),
        agreementValueUpsertBtn(comp),
        agreementValueDeleteBtn(comp),
      ],
    },
  ];
}

