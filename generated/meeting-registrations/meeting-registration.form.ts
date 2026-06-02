import { Subject } from 'rxjs';
import { MORE_BTN } from '@shared/components/data-grid/data-grid.constants';
import { FormComponent } from '@shared/components/generic-form/form.component';
import { FormParameters } from '@shared/components/generic-form/form.interface';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { getDeleteBtnProps } from '@shared/components/view-component/view.helpers';
import { getUpsertBtnProps } from '@shared/components/view-component/view.helpers';
import { navigateRelativeTo } from '@shared/components/view-component/view.helpers';
import { VALIDATOR_REQUIRED } from '@shared/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@shared/components/generic-form/field.interface';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';

import { SAVE_OR_UPDATE_MEETING_REGISTRATION } from './meeting-registration.graphql';
import { MeetingRegistration } from './meeting-registration.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  MeetingCategory} from './meeting-registration.interface';
import {  MinuteStatus} from './meeting-registration.interface';

//Listener for all MeetingRegistration actions 
export const meetingRegistration$ = new Subject<MeetingRegistration | any>();

export const getMeetingRegistrationFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "category",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(MeetingCategory)  },
  {
    key: "conductedDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "confirmationDate",
    type: FieldType.date,
    validations: [],
  },
  {
    key: "minuteStatus",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(MinuteStatus)  },
  {
    key: "name",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
  {
    key: "upcomingSchedule",
    type: FieldType.date,
    validations: [],
  },
];

export function meetingRegistrationUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: MeetingRegistration) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Meeting Registration',
        fields: getMeetingRegistrationFormFields(comp),
        closeAction$: meetingRegistration$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {meetingRegistrationDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_MEETING_REGISTRATION : undefined,
            successFn: (res) => meetingRegistration$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Meeting Registration'),
  };
}

export function meetingRegistrationViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Meeting Registration',
    click: (data: MeetingRegistration) => navigateRelativeTo(comp, 'meeting-registrations', data?.uid),
    permissions: [],
  };
}

 export function meetingRegistrationDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: MeetingRegistration) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        successFn: (res) => meetingRegistration$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Meeting Registration', 'name'),
    permissions: [],
  };
}

export function meetingRegistrationTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        meetingRegistrationViewBtn(comp),
        meetingRegistrationUpsertBtn(comp),
        meetingRegistrationDeleteBtn(comp),
      ],
    },
  ];
}

