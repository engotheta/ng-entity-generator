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

import { CREATE_AREA, REMOVE_AREA_FROM_TASK } from './area.graphql';
import { Area } from './area.interface';

//Listener for all Area actions 
export const area$ = new Subject<Area | any>();

export const getAreaFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "code",
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

export function areaUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: Area) => {
      const formParameter: FormParameters = {
        model: data,
        title: 'Area',
        fields: getAreaFormFields(comp),
        closeAction$: area$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_AREA,
            successFn: (res) => area$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Area','uuid'),
  };
}

export function areaViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Area',
    click: (data: Area) => navigateRelativeTo(comp, 'areas', data?.uuid),
    permissions: [],
  };
}

 export function areaDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: Area) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uuid:data.uuid},
        mutation: REMOVE_AREA_FROM_TASK,
        finalFn: (res) => area$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Area', 'name'),
    permissions: [],
  };
}

export function areaTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        areaViewBtn(comp),
        areaUpsertBtn(comp),
        areaDeleteBtn(comp),
      ],
    },
  ];
}

