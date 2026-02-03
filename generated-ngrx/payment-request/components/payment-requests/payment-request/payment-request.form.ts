import { ActionButton,  ANIMATION_MODAL, BtnType, FormParameters} from "@shared";
import { FieldConfig } from "@shared/components/dynamic-forms-components/field.interface";
import { FieldType } from "@shared/components/dynamic-forms-components/field.interface";
import { REQUIRED_VALIDATOR } from "@shared/components/dynamic-forms-components/forms-constants";
import { FormComponent } from "@shared/components/form/form.component";
import { Base, BaseComponent } from "@shared/view/base-component";
import { getDeleteBtnMappers,  navigateRelativeTo, } from "@shared/view/view.helpers";
import { PaymentRequestActions } from "@store/entities/accounts/payment-request/payment-request.actions";
import { PaymentRequest } from "@store/entities/accounts/payment-request/payment-request.model";
import {  GET_ALL_CHAPTER_PAGEABLE } from "@store/entities/settings/chapter/chapter.graphql";
import {  ALL_ACCOUNTS_PAGEABLE } from "@store/entities/accounts/accounts/accounts.graphql";
import {  ALL_CLIENT_PAGEABLE } from "@store/entities/client/client/client.graphql";
import {  GET_ALL_EMPLOYEE_ACTIVE_PAGEABLE } from "@store/entities/hrm/employee/employee.graphql";
import {  ALL_SUB_ACTIVITY_PAGEABLE } from "@store/entities/planning/sub-activity/sub-activity.graphql";
import { PaymentRequestDtoInput } from "@store/entities/accounts/payment-request/payment-request.model";

export type PartEntity = Partial<PaymentRequest>;

export const paymentRequestFormFields: FieldConfig[] = [
  {
    key: "chapterUid",
    type: FieldType.select,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
    optionsVariables : {
      query:GET_ALL_CHAPTER_PAGEABLE,
      variables: { active: true },
      pageableParam: { size: 50 },
      searchKeys: ["code", "description", "name"],
    }
  },
  {
    key: "departmentUid",
    type: FieldType.select,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
    optionsVariables : {
      query:ALL_DEPARTMENT_PAGEABLE,
      variables: { active: true },
      pageableParam: { size: 50 },
      searchKeys: [],// TODO: put in nameFields
    }
  },
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
    class: "col-md-12",
  },
  {
    key: "endDate",
    type: FieldType.date,
    validations: [],
    class: "col-md-6",
  },
  {
    key: "items",
    type: FieldType.formGroupArray,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-12",
    fields:[
      {
		    key: "amount",
		    type: FieldType.number,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-6",
		  },
		  {
		    key: "chartOfAccountUid",
		    type: FieldType.select,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-6",
		    optionsVariables : {
		      query:ALL_ACCOUNTS_PAGEABLE,
		      variables: { active: true },
		      pageableParam: { size: 50 },
		      searchKeys: ["code", "description"],
		    }
		  },
		  {
		    key: "clientPayeeUid",
		    type: FieldType.select,
		    validations: [],
		    class: "col-md-6",
		    optionsVariables : {
		      query:ALL_CLIENT_PAGEABLE,
		      variables: { active: true },
		      pageableParam: { size: 50 },
		      searchKeys: [],// TODO: put in nameFields
		    }
		  },
		  {
		    key: "description",
		    type: FieldType.textarea,
		    validations: [],
		    class: "col-md-12",
		  },
		  {
		    key: "employeePayeeUid",
		    type: FieldType.select,
		    validations: [],
		    class: "col-md-6",
		    optionsVariables : {
		      query:GET_ALL_EMPLOYEE_ACTIVE_PAGEABLE,
		      variables: { active: true },
		      pageableParam: { size: 50 },
		      searchKeys: [],// TODO: put in nameFields
		    }
		  },
		  {
		    key: "expenditureBudgetItemUid",
		    type: FieldType.select,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-6",
		    optionsVariables : {
		      query:ALL_EXPENDITURE_BUDGET_ITEM_PAGEABLE,
		      variables: { active: true },
		      pageableParam: { size: 50 },
		      searchKeys: [],// TODO: put in nameFields
		    }
		  },
		  {
		    key: "uid",
		    type: FieldType.input,
		    validations: [],
		    class: "col-md-6",
		    visible: false,
		  },
		  {
		    key: "unitCost",
		    type: FieldType.number,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-6",
		  },
		],
  },
  {
    key: "startDate",
    type: FieldType.date,
    validations: [],
    class: "col-md-6",
  },
  {
    key: "subActivityUid",
    type: FieldType.select,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
    optionsVariables : {
      query:ALL_SUB_ACTIVITY_PAGEABLE,
      variables: { active: true },
      pageableParam: { size: 50 },
      searchKeys: ["code", "description", "title"],
    }
  },
  {
    key: "title",
    type: FieldType.input,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
  },
  {
    key: "uid",
    type: FieldType.input,
    validations: [],
    class: "col-md-6",
    visible: false,
  },
  {
    type: FieldType.button,
    label: "Save",
    class: "col-md-12",
  },
];

export function getPaymentRequestButtons (base: Base, data?: PartEntity ): ActionButton[] {
  return [
  {
    icon: "more_actions",
    type: "icon",
    class: "border",
    buttons: [
      {
        label: "View Payment Request",
        icon: "view",
        callback: (data: PaymentRequest) => navigateRelativeTo(base, "payment-requests", data.uid),
        permissions: ["ROLE_VIEW_PAYMENT_REQUEST"],
      },
      getPaymentRequestUpsertButton(base, true, "edit", data),
      {
        ...getDeleteBtnMappers("Payment Request"),
        callback: (data: PaymentRequest) => deletePaymentRequest(base, data),
        permissions: [ "ROLE_DELETE_PAYMENT_REQUEST", "ROLE_CREATE_PAYMENT_REQUEST"],
      },
    ],
  },
  ];
}

export function getPaymentRequestUpsertButton( b: Base, label = true, t: BtnType, d?:PartEntity ) {
  return {
  icon: t == "add" ? "add" : "edit",
  label: label ? (t == "add" ? "Add" : "Edit") + "Payment Request" : undefined,
  permissions: ["ROLE_CREATE_PAYMENT_REQUEST"],
  callback: (data: PaymentRequest) => openPaymentRequestForm(b, { ...data, ...d }),
  };
}

export function deletePaymentRequest( b: Base, d: PartEntity ) {
  b.store.dispatch(PaymentRequestActions.deletePaymentRequestApi({ uid: d.uid }));
}

export function openPaymentRequestForm( base: Base, data?: PartEntity ) {
  let fields: FieldConfig[] = paymentRequestFormFields;

  const onSubmit = (input:PaymentRequestDtoInput) => {
  base.store.dispatch(PaymentRequestActions.savePaymentRequest({ input }) );
  };

  const fp: FormParameters = {
  fields,
  onSubmit,
  model: { ...data },
    title: `${data?.uid ? 'Edit' : 'Add'}Payment Request`,
  closeAction: PaymentRequestActions.upsertPaymentRequest,
  };

  base.viewService.openModal(FormComponent, fp, "50%", "auto", [ ANIMATION_MODAL, ]);
}

