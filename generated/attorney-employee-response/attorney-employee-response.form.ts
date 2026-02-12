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

import { undefined, undefined } from './attorney-employee-response.graphql';
import { AttorneyEmployeeResponse } from './attorney-employee-response.interface';

//Listener for all AttorneyEmployeeResponse actions 
export const attorneyEmployeeResponse$ = new Subject<AttorneyEmployeeResponse | any>();

export const getAttorneyEmployeeResponseFormFields = (comp: BaseComponent): FieldConfig[] => [
];

export function attorneyEmployeeResponseUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AttorneyEmployeeResponse) => {
      const formParameter: FormParameters = {
        model: data,
        title: 'Attorney Employee Response',
        fields: getAttorneyEmployeeResponseFormFields(comp),
        closeAction$: attorneyEmployeeResponse$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { undefined},
            mutation: undefined,
            successFn: (res) => attorneyEmployeeResponse$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Attorney Employee Response','uuid'),
  };
}

export function attorneyEmployeeResponseViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Attorney Employee Response',
    click: (data: AttorneyEmployeeResponse) => navigateRelativeTo(comp, 'attorney-employee-responses', data?.uuid),
    permissions: [],
  };
}

 export function attorneyEmployeeResponseDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AttorneyEmployeeResponse) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uuid: data.uuid},
        mutation: undefined,
        finalFn: (res) => attorneyEmployeeResponse$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Attorney Employee Response', 'departmentName'),
    permissions: [],
  };
}

export function attorneyEmployeeResponseTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        attorneyEmployeeResponseViewBtn(comp),
        attorneyEmployeeResponseUpsertBtn(comp),
        attorneyEmployeeResponseDeleteBtn(comp),
      ],
    },
  ];
}

