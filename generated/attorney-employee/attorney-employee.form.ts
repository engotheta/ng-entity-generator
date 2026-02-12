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

import { undefined, undefined } from './attorney-employee.graphql';
import { AttorneyEmployee } from './attorney-employee.interface';

//Listener for all AttorneyEmployee actions 
export const attorneyEmployee$ = new Subject<AttorneyEmployee | any>();

export const getAttorneyEmployeeFormFields = (comp: BaseComponent): FieldConfig[] => [
];

export function attorneyEmployeeUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AttorneyEmployee) => {
      const formParameter: FormParameters = {
        model: data,
        title: 'Attorney Employee',
        fields: getAttorneyEmployeeFormFields(comp),
        closeAction$: attorneyEmployee$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { undefined},
            mutation: undefined,
            successFn: (res) => attorneyEmployee$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Attorney Employee','uuid'),
  };
}

export function attorneyEmployeeViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Attorney Employee',
    click: (data: AttorneyEmployee) => navigateRelativeTo(comp, 'attorney-employees', data?.uuid),
    permissions: [],
  };
}

 export function attorneyEmployeeDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AttorneyEmployee) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uuid: data.uuid},
        mutation: undefined,
        finalFn: (res) => attorneyEmployee$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Attorney Employee', 'departmentName'),
    permissions: [],
  };
}

export function attorneyEmployeeTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        attorneyEmployeeViewBtn(comp),
        attorneyEmployeeUpsertBtn(comp),
        attorneyEmployeeDeleteBtn(comp),
      ],
    },
  ];
}

