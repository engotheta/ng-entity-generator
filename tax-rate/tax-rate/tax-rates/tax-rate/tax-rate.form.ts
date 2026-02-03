import { ActionButton,  ANIMATION_MODAL, BtnType, FormParameters} from "@shared";
import { FieldConfig } from "@shared/components/dynamic-forms-components/field.interface";
import { FieldType } from "@shared/components/dynamic-forms-components/field.interface";
import { REQUIRED_VALIDATOR } from "@shared/components/dynamic-forms-components/forms-constants";
import { FormComponent } from "@shared/components/form/form.component";
import { Base, BaseComponent } from "@shared/view/base-component";
import { getDeleteBtnMappers,  navigateRelativeTo, } from "@shared/view/view.helpers";
import { TaxRateActions } from "@store/entities/tax-rate/tax-rate.actions";
import { TaxRate } from "@store/entities/tax-rate/tax-rate.model";
import { TaxRateDtoInput } from "@store/entities/tax-rate/tax-rate.model";

export type PartEntity = Partial<TaxRate>;

export const taxRateFormFields: FieldConfig[] = [
  {
    type: FieldType.button,
    label: "Save",
    class: "col-md-12",
  },
];

export function getTaxRateButtons (base: Base, data?: PartEntity ): ActionButton[] {
  return [
    {
      icon: "more_actions",
      type: "icon",
      class: "border",
      buttons: [
        {
          label: "View Tax Rate",
          icon: "view",
          callback: (data: TaxRate) => navigateRelativeTo(base, "tax-rates", data.uid),
          permissions: ["ROLE_VIEW_TAX_RATE"],
        },
        getTaxRateUpsertButton(base, true, "edit", data),
        {
          ...getDeleteBtnMappers("Tax Rate"),
          callback: (data: TaxRate) => deleteTaxRate(base, data),
          permissions: [ "ROLE_DELETE_TAX_RATE", "ROLE_CREATE_TAX_RATE"],
        },
      ],
    },
  ];
}

export function getTaxRateUpsertButton( b: Base, label = true, t: BtnType, d?:PartEntity ) {
  return {
    icon: t == "add" ? "add" : "edit",
    label: label ? (t == "add" ? "Add" : "Edit") + "Tax Rate" : undefined,
    permissions: ["ROLE_CREATE_TAX_RATE"],
    callback: (data: TaxRate) => openTaxRateForm(b, { ...data, ...d }),
  };
}

export function deleteTaxRate( b: Base, d: PartEntity ) {
  b.store.dispatch(TaxRateActions.deleteTaxRateApi({ uid: d.uid }));
}

export function openTaxRateForm( base: Base, data?: PartEntity ) {
  let fields: FieldConfig[] = taxRateFormFields;

  const onSubmit = (input:TaxRateDtoInput) => {
    base.store.dispatch(TaxRateActions.saveTaxRate({ input }) );
  };

  const fp: FormParameters = {
    fields,
    onSubmit,
    model: { ...data },
    title: `${data?.uid ? 'Edit' : 'Add'}Tax Rate`,
    closeAction: TaxRateActions.upsertTaxRate,
  };

  base.viewService.openModal(FormComponent, fp, "50%", "auto", [ ANIMATION_MODAL, ]);
}

