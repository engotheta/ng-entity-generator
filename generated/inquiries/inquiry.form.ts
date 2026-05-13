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

import { undefined, undefined } from './inquiry.graphql';
import { SAVE_OR_UPDATE_INQUIRY  } from './inquiry.graphql';
import { Inquiry } from './inquiry.interface';
import { enumToObjectArray } from '@shared/utilities/object.helpers';
import {  InquiryNature} from './inquiry.interface';
import {  InquiryCategory} from './inquiry.interface';
import {  InquiryPriority} from './inquiry.interface';
import {  InquiryType} from './inquiry.interface';

//Listener for all Inquiry actions 
export const inquiry$ = new Subject<Inquiry | any>();

export const getInquiryFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachments",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "clientName",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
    class: "col-span-full",
  },
  {
    key: "destination",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InquiryNature)  },
  {
    key: "inquiryCategory",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InquiryCategory)  },
  {
    key: "nature",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InquiryNature)  },
  {
    key: "phone",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "priority",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InquiryPriority)  },
  {
    key: "subWardUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_SUB_WARD_PAGEABLE },
    }
  },
  {
    key: "trackingId",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_TRACKIN_PAGEABLE },
    }
  },
  {
    key: "type",
    type: FieldType.select,
    validations: [],
    options: enumToObjectArray(InquiryType)  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function inquiryUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: Inquiry) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Inquiry',
        fields: getInquiryFormFields(comp),
        closeAction$: inquiry$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {inquiryDto:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_INQUIRY : undefined,
            successFn: (res) => inquiry$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
    ...getUpsertBtnProps('Inquiry'),
  };
}

export function inquiryViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Inquiry',
    click: (data: Inquiry) => navigateRelativeTo(comp, 'inquiries', data?.uid),
    permissions: [],
  };
}

 export function inquiryDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: Inquiry) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {uid: data.uid},
        mutation: undefined,
        finalFn: (res) => inquiry$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Inquiry', 'clientName'),
    permissions: [],
  };
}

export function inquiryTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        inquiryViewBtn(comp),
        inquiryUpsertBtn(comp),
        inquiryDeleteBtn(comp),
      ],
    },
  ];
}

