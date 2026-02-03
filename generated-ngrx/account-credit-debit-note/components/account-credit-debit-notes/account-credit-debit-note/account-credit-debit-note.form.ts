import { ActionButton,  ANIMATION_MODAL, BtnType, FormParameters} from "@shared";
import { FieldConfig } from "@shared/components/dynamic-forms-components/field.interface";
import { FieldType } from "@shared/components/dynamic-forms-components/field.interface";
import { REQUIRED_VALIDATOR } from "@shared/components/dynamic-forms-components/forms-constants";
import { FormComponent } from "@shared/components/form/form.component";
import { Base, BaseComponent } from "@shared/view/base-component";
import { getDeleteBtnMappers,  navigateRelativeTo, } from "@shared/view/view.helpers";
import { AccountCreditDebitNoteActions } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.actions";
import { AccountCreditDebitNote } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.model";
import {  ALL_INVOICES_PAGEABLE } from "@store/entities/accounts/account-invoice/account-invoice.graphql";
import {  ALL_ACCOUNT_CATEGORY_PAGEABLE } from "@store/entities/accounts/account-category/account-category.graphql";
import { CreditDebitNoteDtoInput } from "@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.model";

export type PartEntity = Partial<AccountCreditDebitNote>;

export const accountCreditDebitNoteFormFields: FieldConfig[] = [
  {
    key: "description",
    type: FieldType.textarea,
    validations: [],
    class: "col-md-12",
  },
  {
    key: "invoiceUid",
    type: FieldType.select,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
    optionsVariables : {
      query:ALL_INVOICES_PAGEABLE,
      variables: { active: true },
      pageableParam: { size: 50 },
      searchKeys: ["name"],
    }
  },
  {
    key: "items",
    type: FieldType.formGroupArray,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-12",
    fields:[
      {
		    key: "accountUid",
		    type: FieldType.select,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-6",
		    optionsVariables : {
		      query:ALL_ACCOUNT_CATEGORY_PAGEABLE,
		      variables: { active: true },
		      pageableParam: { size: 50 },
		      searchKeys: ["description", "name"],
		    }
		  },
		  {
		    key: "description",
		    type: FieldType.textarea,
		    validations: [REQUIRED_VALIDATOR],
		    class: "col-md-12",
		  },
		  {
		    key: "quantity",
		    type: FieldType.number,
		    validations: [],
		    class: "col-md-6",
		  },
		  {
		    key: "revenueBudgetItemUid",
		    type: FieldType.select,
		    validations: [],
		    class: "col-md-6",
		    optionsVariables : {
		      query:ALL_REVENUE_BUDGET_ITEM_PAGEABLE,
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
		    key: "unitPrice",
		    type: FieldType.number,
		    validations: [],
		    class: "col-md-6",
		  },
		],
  },
  {
    key: "noteDate",
    type: FieldType.date,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-6",
  },
  {
    key: "noteType",
    type: FieldType.formGroup,
    validations: [REQUIRED_VALIDATOR],
    class: "col-md-12",
    fields:[
    ],
  },
  {
    key: "reason",
    type: FieldType.input,
    validations: [],
    class: "col-md-6",
  },
  {
    key: "referenceNumber",
    type: FieldType.input,
    validations: [],
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

export function getAccountCreditDebitNoteButtons (base: Base, data?: PartEntity ): ActionButton[] {
  return [
  {
    icon: "more_actions",
    type: "icon",
    class: "border",
    buttons: [
      {
        label: "View Account Credit Debit Note",
        icon: "view",
        callback: (data: AccountCreditDebitNote) => navigateRelativeTo(base, "account-credit-debit-notes", data.uid),
        permissions: ["ROLE_VIEW_ACCOUNT_CREDIT_DEBIT_NOTE"],
      },
      getAccountCreditDebitNoteUpsertButton(base, true, "edit", data),
      {
        ...getDeleteBtnMappers("Account Credit Debit Note"),
        callback: (data: AccountCreditDebitNote) => deleteAccountCreditDebitNote(base, data),
        permissions: [ "ROLE_DELETE_ACCOUNT_CREDIT_DEBIT_NOTE", "ROLE_CREATE_ACCOUNT_CREDIT_DEBIT_NOTE"],
      },
    ],
  },
  ];
}

export function getAccountCreditDebitNoteUpsertButton( b: Base, label = true, t: BtnType, d?:PartEntity ) {
  return {
  icon: t == "add" ? "add" : "edit",
  label: label ? (t == "add" ? "Add" : "Edit") + "Account Credit Debit Note" : undefined,
  permissions: ["ROLE_CREATE_ACCOUNT_CREDIT_DEBIT_NOTE"],
  callback: (data: AccountCreditDebitNote) => openAccountCreditDebitNoteForm(b, { ...data, ...d }),
  };
}

export function deleteAccountCreditDebitNote( b: Base, d: PartEntity ) {
  b.store.dispatch(AccountCreditDebitNoteActions.deleteAccountCreditDebitNoteApi({ uid: d.uid }));
}

export function openAccountCreditDebitNoteForm( base: Base, data?: PartEntity ) {
  let fields: FieldConfig[] = accountCreditDebitNoteFormFields;

  const onSubmit = (input:CreditDebitNoteDtoInput) => {
  base.store.dispatch(AccountCreditDebitNoteActions.saveAccountCreditDebitNote({ input }) );
  };

  const fp: FormParameters = {
  fields,
  onSubmit,
  model: { ...data },
    title: `${data?.uid ? 'Edit' : 'Add'}Account Credit Debit Note`,
  closeAction: AccountCreditDebitNoteActions.upsertAccountCreditDebitNote,
  };

  base.viewService.openModal(FormComponent, fp, "50%", "auto", [ ANIMATION_MODAL, ]);
}

