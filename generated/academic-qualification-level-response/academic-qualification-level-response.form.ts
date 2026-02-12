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

import { CREATE_ACADEMIC_QUALIFICATION_LEVEL, DELETE_ACADEMIC_QUALIFICATION_LEVEL } from './academic-qualification-level-response.graphql';
import { AcademicQualificationLevelResponse } from './academic-qualification-level-response.interface';

//Listener for all AcademicQualificationLevelResponse actions 
export const academicQualificationLevelResponse$ = new Subject<AcademicQualificationLevelResponse | any>();

export const getAcademicQualificationLevelResponseFormFields = (comp: BaseComponent): FieldConfig[] => [
];

export function academicQualificationLevelResponseUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AcademicQualificationLevelResponse) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Academic Qualification Level Response',
        fields: getAcademicQualificationLevelResponseFormFields(comp),
        closeAction$: academicQualificationLevelResponse$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_ACADEMIC_QUALIFICATION_LEVEL,
            successFn: (res) => academicQualificationLevelResponse$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Academic Qualification Level Response','uuid'),
  };
}

export function academicQualificationLevelResponseViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Academic Qualification Level Response',
    click: (data: AcademicQualificationLevelResponse) => navigateRelativeTo(comp, 'academic-qualification-level-responses', data?.uuid),
    permissions: [],
  };
}

 export function academicQualificationLevelResponseDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AcademicQualificationLevelResponse) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {id:data.uuid},
        mutation: DELETE_ACADEMIC_QUALIFICATION_LEVEL,
        finalFn: (res) => academicQualificationLevelResponse$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Academic Qualification Level Response', 'name'),
    permissions: [],
  };
}

export function academicQualificationLevelResponseTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        academicQualificationLevelResponseViewBtn(comp),
        academicQualificationLevelResponseUpsertBtn(comp),
        academicQualificationLevelResponseDeleteBtn(comp),
      ],
    },
  ];
}

