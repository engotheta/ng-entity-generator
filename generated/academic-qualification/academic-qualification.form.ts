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

import { CREATE_ACADEMIC_QUALIFICATION, DELETE_ACADEMIC_QUALIFICATION } from './academic-qualification.graphql';
import { AcademicQualification } from './academic-qualification.interface';

//Listener for all AcademicQualification actions 
export const academicQualification$ = new Subject<AcademicQualification | any>();

export const getAcademicQualificationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "areaIds",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "attorney",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "country",
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
    key: "institution",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "level",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "programName",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "yearObtained",
    type: FieldType.number,
    validations: [VALIDATOR_REQUIRED],
  },
];

export function academicQualificationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AcademicQualification) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Academic Qualification',
        fields: getAcademicQualificationFormFields(comp),
        closeAction$: academicQualification$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_ACADEMIC_QUALIFICATION,
            successFn: (res) => academicQualification$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Academic Qualification','uuid'),
  };
}

export function academicQualificationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Academic Qualification',
    click: (data: AcademicQualification) => navigateRelativeTo(comp, 'academic-qualifications', data?.uuid),
    permissions: [],
  };
}

 export function academicQualificationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AcademicQualification) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {id:data.uuid},
        mutation: DELETE_ACADEMIC_QUALIFICATION,
        finalFn: (res) => academicQualification$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Academic Qualification', 'programName'),
    permissions: [],
  };
}

export function academicQualificationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        academicQualificationViewBtn(comp),
        academicQualificationUpsertBtn(comp),
        academicQualificationDeleteBtn(comp),
      ],
    },
  ];
}

