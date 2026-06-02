import { FormComponent } from '@shared/components/generic-form/form.component';
import { FormParameters } from '@shared/components/generic-form/form.interface';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { VALIDATOR_REQUIRED } from '@shared/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@shared/components/generic-form/field.interface';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';

import { ATTEND_INQUIRY } from '../inquiry.graphql';
import { Inquiry } from '../inquiry.interface';
import { inquiry$ } from './inquiry.form';

export const getAttendInquiryFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "attachmentDtos",
    type: FieldType.formGroupArray,
    validations: [],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "comment",
    type: FieldType.input,
    validations: [],
    class: "col-span-full",
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function attendInquiryBtn(comp: BaseComponent): ActionButton {
  return {
    label: 'Attend Inquiry',
    icon: 'flash',
    click: (data?: Inquiry) => {
      const formParameter: FormParameters = {
        model: { ...data },
        title: 'Attend Inquiry',
        fields: getAttendInquiryFormFields(comp),
        closeAction$: inquiry$,
        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { attendInquiryDto: value },
            mutation: ATTEND_INQUIRY,
            successFn: (res) => inquiry$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
  };
}
