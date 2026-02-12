import { Subject } from 'rxjs';
import { MORE_BTN } from '@common/table/data-grid-constants';
import { FormComponent } from '@common/components/generic-form/form.component';
import { FormParameters } from '@common/components/generic-form/form.interface';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { getDeleteBtnProps } from '@common/components/contents-view/view.helpers';
import { getUpsertBtnProps } from '@common/components/contents-view/view.helpers';
import { navigateRelativeTo } from '@common/components/contents-view/view.helpers';
import { VALIDATOR_REQUIRED } from '@common/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@common/components/generic-form/field.interface';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';

import { undefined, undefined } from './attorney-cv.graphql';
import { AttorneyCv } from './attorney-cv.interface';

//Listener for all AttorneyCv actions 
export const attorneyCv$ = new Subject<AttorneyCv | any>();

export const getAttorneyCvFormFields = (comp: BaseComponent): FieldConfig[] => [
];

 export async function openAttorneyCvForm(comp: BaseComponent, attorneyCv?: any) {
  const formParameter: FormParameters = {
    model: attorneyCv,
    title: 'Attorney Cv',
    fields: getAttorneyCvFormFields(comp),

    onSubmit: async (data: any) => {
      await comp.fs.fetch({
        notify: true,
        variables: { undefined},
        mutation: undefined,
        successFn: (res) => attorneyCv$.next(res?.data),
      });
   },
  };

  comp.vs?.openDialog({
    width: '96%',
    maxWidth: '720px',
    data: formParameter,
    component: FormComponent,
    closeAction$: attorneyCv$,
   });
 }

export function attorneyCvViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Attorney Cv',
    click: (data: AttorneyCv) => navigateRelativeTo(comp, 'attorney-cvs', data?.uid),
    permissions: [],
  };
}

export function attorneyCvUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    ...getUpsertBtnProps('Attorney Cv'),
    click: (data?: AttorneyCv) => openAttorneyCvForm(comp, data),
    permissions: [],
  };
}

 export function attorneyCvDeleteBtn(comp: BaseComponent):ActionButton {
  return {
    ...getDeleteBtnProps('Attorney Cv', 'name'),
    permissions: [],

    click: async (data: AttorneyCv) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: { uid: 'data.uid'},
        mutation: undefined,
        finalFn: (res) => attorneyCv$.next(res?.data),
      });
    },
  };
}

export function attorneyCvTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        attorneyCvViewBtn(comp),
        attorneyCvUpsertBtn(comp),
        attorneyCvDeleteBtn(comp),
      ],
    },
  ];
}

