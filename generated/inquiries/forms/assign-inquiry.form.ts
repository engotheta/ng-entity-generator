import { FormComponent } from '@shared/components/generic-form/form.component';
import { FormParameters } from '@shared/components/generic-form/form.interface';
import { BaseComponent } from '@shared/components/base-componet/base-component';
import { VALIDATOR_REQUIRED } from '@shared/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@shared/components/generic-form/field.interface';
import { ActionButton } from '@shared/components/action-buttons/action-buttons.inteface';

import { ASSIGN_INQUIRY } from '../inquiry.graphql';
import { Inquiry } from '../inquiry.interface';
import { inquiry$ } from './inquiry.form';

export const getAssignInquiryFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "assignedTo",
    type: FieldType.input,
    validations: [],
    class: "col-span-full",
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

export function assignInquiryBtn(comp: BaseComponent): ActionButton {
  return {
    label: 'Assign Inquiry',
    icon: 'flash',
    click: (data?: Inquiry) => {
      const formParameter: FormParameters = {
        model: { ...data },
        title: 'Assign Inquiry',
        fields: getAssignInquiryFormFields(comp),
        closeAction$: inquiry$,
        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: { assignmentDto: value },
            mutation: ASSIGN_INQUIRY,
            successFn: (res) => inquiry$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%');
    },
    permissions: [],
  };
}
