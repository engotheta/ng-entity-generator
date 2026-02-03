import { ActionButton,  ANIMATION_MODAL, BtnType, FormParameters} from "@shared";
import { FieldConfig } from "@shared/components/dynamic-forms-components/field.interface";
import { FieldType } from "@shared/components/dynamic-forms-components/field.interface";
import { REQUIRED_VALIDATOR } from "@shared/components/dynamic-forms-components/forms-constants";
import { FormComponent } from "@shared/components/form/form.component";
import { Base, BaseComponent } from "@shared/view/base-component";
import { getDeleteBtnMappers,  navigateRelativeTo, } from "@shared/view/view.helpers";
import { GeneralLedgerEntryDtoActions } from "@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.actions";
import { GeneralLedgerEntryDto } from "@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.model";

export type PartEntity = Partial<GeneralLedgerEntryDto>;

export const generalLedgerEntryDtoFormFields: FieldConfig[] = [
  {
    type: FieldType.button,
    label: "Save",
    class: "col-md-12",
  },
];

export function getGeneralLedgerEntryDtoButtons (base: Base, data?: PartEntity ): ActionButton[] {
  return [
  {
    icon: "more_actions",
    type: "icon",
    class: "border",
    buttons: [
      {
        label: "View General Ledger Entry Dto",
        icon: "view",
        callback: (data: GeneralLedgerEntryDto) => navigateRelativeTo(base, "general-ledger-entry-dtos", data.uid),
        permissions: ["ROLE_VIEW_GENERAL_LEDGER_ENTRY_DTO"],
      },
      getGeneralLedgerEntryDtoUpsertButton(base, true, "edit", data),
      {
        ...getDeleteBtnMappers("General Ledger Entry Dto"),
        callback: (data: GeneralLedgerEntryDto) => deleteGeneralLedgerEntryDto(base, data),
        permissions: [ "ROLE_DELETE_GENERAL_LEDGER_ENTRY_DTO", "ROLE_CREATE_GENERAL_LEDGER_ENTRY_DTO"],
      },
    ],
  },
  ];
}

export function getGeneralLedgerEntryDtoUpsertButton( b: Base, label = true, t: BtnType, d?:PartEntity ) {
  return {
  icon: t == "add" ? "add" : "edit",
  label: label ? (t == "add" ? "Add" : "Edit") + "General Ledger Entry Dto" : undefined,
  permissions: ["ROLE_CREATE_GENERAL_LEDGER_ENTRY_DTO"],
  callback: (data: GeneralLedgerEntryDto) => openGeneralLedgerEntryDtoForm(b, { ...data, ...d }),
  };
}

export function deleteGeneralLedgerEntryDto( b: Base, d: PartEntity ) {
  b.store.dispatch(GeneralLedgerEntryDtoActions.deleteGeneralLedgerEntryDtoApi({ uid: d.uid }));
}

export function openGeneralLedgerEntryDtoForm( base: Base, data?: PartEntity ) {
  let fields: FieldConfig[] = generalLedgerEntryDtoFormFields;

  const onSubmit = (input:undefined) => {
  base.store.dispatch(GeneralLedgerEntryDtoActions.saveGeneralLedgerEntryDto({ input }) );
  };

  const fp: FormParameters = {
  fields,
  onSubmit,
  model: { ...data },
    title: `${data?.uid ? 'Edit' : 'Add'}General Ledger Entry Dto`,
  closeAction: GeneralLedgerEntryDtoActions.upsertGeneralLedgerEntryDto,
  };

  base.viewService.openModal(FormComponent, fp, "50%", "auto", [ ANIMATION_MODAL, ]);
}

