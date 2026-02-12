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

import { CREATE_WORK_EXPERIENCE, DELETE_WORK_EXPERIENCE } from './work-experience.graphql';
import { WorkExperience } from './work-experience.interface';

//Listener for all WorkExperience actions 
export const workExperience$ = new Subject<WorkExperience | any>();

export const getWorkExperienceFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attorney",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "currentlyWorkingHere",
    type: FieldType.checkbox,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "endDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "id",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "institutionName",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "position",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "responsibilities",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "startDate",
    type: FieldType.date,
    validations: [VALIDATOR_REQUIRED],
  },
];

export function workExperienceUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: WorkExperience) => {
      const formParameter: FormParameters = {
        model: data,
        title: 'Work Experience',
        fields: getWorkExperienceFormFields(comp),
        closeAction$: workExperience$,

        onSubmit: async (data: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { ent:data},
            mutation: CREATE_WORK_EXPERIENCE,
            successFn: (res) => workExperience$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Work Experience','uuid'),
  };
}

export function workExperienceViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Work Experience',
    click: (data: WorkExperience) => navigateRelativeTo(comp, 'work-experiences', data?.uuid),
    permissions: [],
  };
}

 export function workExperienceDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: WorkExperience) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {id:data.uuid},
        mutation: DELETE_WORK_EXPERIENCE,
        finalFn: (res) => workExperience$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Work Experience', 'institutionName'),
    permissions: [],
  };
}

export function workExperienceTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        workExperienceViewBtn(comp),
        workExperienceUpsertBtn(comp),
        workExperienceDeleteBtn(comp),
      ],
    },
  ];
}

