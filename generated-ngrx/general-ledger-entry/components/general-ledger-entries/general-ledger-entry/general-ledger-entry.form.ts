import { ActionButton,  ANIMATION_MODAL, BtnType, FormParameters} from "@shared";
import { FieldConfig } from "@shared/components/dynamic-forms-components/field.interface";
import { FieldType } from "@shared/components/dynamic-forms-components/field.interface";
import { REQUIRED_VALIDATOR } from "@shared/components/dynamic-forms-components/forms-constants";
import { FormComponent } from "@shared/components/form/form.component";
import { Base, BaseComponent } from "@shared/view/base-component";
import { getDeleteBtnMappers,  navigateRelativeTo, } from "@shared/view/view.helpers";
import { GeneralLedgerEntryActions } from "@store/entities/accounts/general-ledger-entry/general-ledger-entry.actions";
import { GeneralLedgerEntry } from "@store/entities/accounts/general-ledger-entry/general-ledger-entry.model";

export type PartEntity = Partial<GeneralLedgerEntry>;

export const generalLedgerEntryFormFields: FieldConfig[] = [
  {
    type: FieldType.button,
    label: "Save",
    class: "col-md-12",
  },
];

export function getGeneralLedgerEntryButtons (base: Base, data?: PartEntity ): ActionButton[] {
  return [
  {
    icon: "more_actions",
    type: "icon",
    class: "border",
    buttons: [
      {
        label: "View General Ledger Entry",
        icon: "view",
        callback: (data: GeneralLedgerEntry) => navigateRelativeTo(base, "general-ledger-entries", data.uid),
        permissions: ["ROLE_VIEW_GENERAL_LEDGER_ENTRY"],
      },
      getGeneralLedgerEntryUpsertButton(base, true, "edit", data),
      {
        ...getDeleteBtnMappers("General Ledger Entry"),
        callback: (data: GeneralLedgerEntry) => deleteGeneralLedgerEntry(base, data),
        permissions: [ "ROLE_DELETE_GENERAL_LEDGER_ENTRY", "ROLE_CREATE_GENERAL_LEDGER_ENTRY"],
      },
    ],
  },
  ];
}

export function getGeneralLedgerEntryUpsertButton( b: Base, label = true, t: BtnType, d?:PartEntity ) {
  return {
  icon: t == "add" ? "add" : "edit",
  label: label ? (t == "add" ? "Add" : "Edit") + "General Ledger Entry" : undefined,
  permissions: ["ROLE_CREATE_GENERAL_LEDGER_ENTRY"],
  callback: (data: GeneralLedgerEntry) => openGeneralLedgerEntryForm(b, { ...data, ...d }),
  };
}

export function deleteGeneralLedgerEntry( b: Base, d: PartEntity ) {
  b.store.dispatch(GeneralLedgerEntryActions.deleteGeneralLedgerEntryApi({ uid: d.uid }));
}

export function openGeneralLedgerEntryForm( base: Base, data?: PartEntity ) {
  let fields: FieldConfig[] = generalLedgerEntryFormFields;

  const onSubmit = (input:undefined) => {
  base.store.dispatch(GeneralLedgerEntryActions.saveGeneralLedgerEntry({ input }) );
  };

  const fp: FormParameters = {
  fields,
  onSubmit,
  model: { ...data },
    title: `${data?.uid ? 'Edit' : 'Add'}General Ledger Entry`,
  closeAction: GeneralLedgerEntryActions.upsertGeneralLedgerEntry,
  };

  base.viewService.openModal(FormComponent, fp, "50%", "auto", [ ANIMATION_MODAL, ]);
}

