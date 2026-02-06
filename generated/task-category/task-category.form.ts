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

import { CREATE_OR_UPDATE_TASK_CATEGORY, DELETE_TASK_CATEGORY } from './task-category.graphql';
import { TaskCategory } from './task-category.interface';

//Listener for all TaskCategory actions 
export const taskCategory$ = new Subject<TaskCategory | any>();

export const getTaskCategoryFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "code",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
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

 export async function openTaskCategoryForm(comp: BaseComponent, taskCategory?: any) {
  const formParameter: FormParameters = {
    model: taskCategory,
    title: 'Task Category',
    fields: getTaskCategoryFormFields(comp),

    onSubmit: async (data: any) => {
      await comp.fs.fetch({
        notify: true,
        variables: { request:data},
        mutation: CREATE_OR_UPDATE_TASK_CATEGORY,
        successFn: (res) => taskCategory$.next(res?.data),
      });
   },
  };

  comp.vs?.openDialog({
    width: '96%',
    maxWidth: '720px',
    data: formParameter,
    component: FormComponent,
    closeAction$: taskCategory$,
   });
 }

export function taskCategoryViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Task Category',
    click: (data: TaskCategory) => navigateRelativeTo(comp, 'task-categories', data?.uid),
    permissions: [],
  };
}

export function taskCategoryUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    ...getUpsertBtnProps('Task Category'),
    click: (data?: TaskCategory) => openTaskCategoryForm(comp, data),
    permissions: [],
  };
}

 export function taskCategoryDeleteBtn(comp: BaseComponent):ActionButton {
  return {
    ...getDeleteBtnProps('Task Category', 'name'),
    permissions: [],

    click: async (data: TaskCategory) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: { id:data.uid},
        mutation: DELETE_TASK_CATEGORY,
        finalFn: (res) => taskCategory$.next(res?.data),
      });
    },
  };
}

export function taskCategoryTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        taskCategoryViewBtn(comp),
        taskCategoryUpsertBtn(comp),
        taskCategoryDeleteBtn(comp),
      ],
    },
  ];
}

