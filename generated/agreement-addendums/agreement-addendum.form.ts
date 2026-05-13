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

import { SAVE_ADDENDUM_ATTACHMENTS, DELETE_ADDENDUM } from './agreement-addendum.graphql';
import { SAVE_OR_UPDATE_ADDENDUM  } from './agreement-addendum.graphql';
import { AgreementAddendum } from './agreement-addendum.interface';
import { enumToObjectArray } from '@common/utilities/object.helpers';
import {  AddendumAction} from './agreement-addendum.interface';
import {  ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS } from "@store/features/agreements/sections-layouts/agreement-clause-templates-layout.graphql";
import {  AddendumStatus} from './agreement-addendum.interface';

//Listener for all AgreementAddendum actions 
export const agreementAddendum$ = new Subject<AgreementAddendum | any>();

export const getAgreementAddendumFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "actionType",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    options: enumToObjectArray(AddendumAction)  },
  {
    key: "agreementUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_AGREEMENT_CLAUSE_TEMPLATES_LAYOUTS },
    }
  },
  {
    key: "reason",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "status",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    options: enumToObjectArray(AddendumStatus)  },
  {
    key: "uuid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function agreementAddendumUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AgreementAddendum) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Agreement Addendum',
        fields: getAgreementAddendumFormFields(comp),
        closeAction$: agreementAddendum$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {input:value} : {input:value},
            mutation: !!data ? SAVE_OR_UPDATE_ADDENDUM : SAVE_ADDENDUM_ATTACHMENTS,
            successFn: (res) => agreementAddendum$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Agreement Addendum','uuid'),
  };
}

export function agreementAddendumViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Agreement Addendum',
    click: (data: AgreementAddendum) => navigateRelativeTo(comp, 'agreement-addendums', data?.uuid),
    permissions: [],
  };
}

 export function agreementAddendumDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AgreementAddendum) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid:data.uuid},
        mutation: DELETE_ADDENDUM,
        finalFn: (res) => agreementAddendum$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Agreement Addendum', 'name'),
    permissions: [],
  };
}

export function agreementAddendumTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        agreementAddendumViewBtn(comp),
        agreementAddendumUpsertBtn(comp),
        agreementAddendumDeleteBtn(comp),
      ],
    },
  ];
}

