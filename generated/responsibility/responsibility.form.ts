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

import { CREATE_RESPONSIBILITY, DELETE_RESPONSIBILITY } from './responsibility.graphql';
import { Responsibility } from './responsibility.interface';

//Listener for all Responsibility actions 
export const responsibility$ = new Subject<Responsibility | any>();

export const getResponsibilityFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "areaIds",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [VALIDATOR_REQUIRED],
    class: "col-span-full",
  },
  {
    key: "id",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "name",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
];

export function responsibilityUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: Responsibility) => {
      const formParameter: FormParameters = {
        model: data,
        title: 'Responsibility',
        fields: getResponsibilityFormFields(comp),
        closeAction$: responsibility$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_RESPONSIBILITY,
            successFn: (res) => responsibility$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Responsibility','uuid'),
  };
}

export function responsibilityViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Responsibility',
    click: (data: Responsibility) => navigateRelativeTo(comp, 'responsibilities', data?.uuid),
    permissions: [],
  };
}

 export function responsibilityDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: Responsibility) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {id:data.uuid},
        mutation: DELETE_RESPONSIBILITY,
        finalFn: (res) => responsibility$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Responsibility', 'name'),
    permissions: [],
  };
}

export function responsibilityTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        responsibilityViewBtn(comp),
        responsibilityUpsertBtn(comp),
        responsibilityDeleteBtn(comp),
      ],
    },
  ];
}

