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

import { CREATE_ACADEMIC_QUALIFICATION_LEVEL, DELETE_ACADEMIC_QUALIFICATION_LEVEL } from './academic-qualification-level.graphql';
import { AcademicQualificationLevel } from './academic-qualification-level.interface';

//Listener for all AcademicQualificationLevel actions 
export const academicQualificationLevel$ = new Subject<AcademicQualificationLevel | any>();

export const getAcademicQualificationLevelFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "code",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
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

export function academicQualificationLevelUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AcademicQualificationLevel) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Academic Qualification Level',
        fields: getAcademicQualificationLevelFormFields(comp),
        closeAction$: academicQualificationLevel$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_ACADEMIC_QUALIFICATION_LEVEL,
            successFn: (res) => academicQualificationLevel$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Academic Qualification Level','uuid'),
  };
}

export function academicQualificationLevelViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Academic Qualification Level',
    click: (data: AcademicQualificationLevel) => navigateRelativeTo(comp, 'academic-qualification-levels', data?.uuid),
    permissions: [],
  };
}

 export function academicQualificationLevelDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AcademicQualificationLevel) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {id:data.uuid},
        mutation: DELETE_ACADEMIC_QUALIFICATION_LEVEL,
        finalFn: (res) => academicQualificationLevel$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Academic Qualification Level', 'name'),
    permissions: [],
  };
}

export function academicQualificationLevelTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        academicQualificationLevelViewBtn(comp),
        academicQualificationLevelUpsertBtn(comp),
        academicQualificationLevelDeleteBtn(comp),
      ],
    },
  ];
}

