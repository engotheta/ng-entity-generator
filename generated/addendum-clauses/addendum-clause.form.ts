import { Subject } from 'rxjs';
import { MORE_BTN } from '@common/components/data-grid/data-grid.constants';
import { FormComponent } from '@common/components/generic-form/form.component';
import { FormParameters } from '@common/components/generic-form/form.interface';
import { BaseComponent } from '@common/components/base-componet/base-component';
import { getDeleteBtnProps } from '@common/components/contents-view/view.helpers';
import { getUpsertBtnProps } from '@common/components/contents-view/view.helpers';
import { navigateRelativeTo } from '@common/components/contents-view/view.helpers';
import { VALIDATOR_REQUIRED } from '@common/components/generic-form/form-constants';
import { FieldConfig, FieldType } from '@common/components/generic-form/field.interface';
import { ActionButton } from '@common/components/action-buttons/action-buttons.inteface';

import { undefined, DELETE_ADDENDUM_CLAUSE } from './addendum-clause.graphql';
import { SAVE_OR_UPDATE_ADDENDUM_CLAUSE  } from './addendum-clause.graphql';
import { AddendumClause } from './addendum-clause.interface';

//Listener for all AddendumClause actions 
export const addendumClause$ = new Subject<AddendumClause | any>();

export const getAddendumClauseFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "action",
    type: FieldType.formGroup,
    validations: [VALIDATOR_REQUIRED],
    class: "col-span-full",
    fields:[
    ],
  },
  {
    key: "addendumSectionUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_ADDENDUM_SECTION_PAGEABLE },
    }
  },
  {
    key: "clauseNumber",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "clauseOrder",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "clauseText",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "clauseTitle",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "isMandatory",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "isNegotiable",
    type: FieldType.checkbox,
    validations: [],
  },
  {
    key: "legalReference",
    type: FieldType.input,
    validations: [],
  },
  {
    key: "reasonForAmendment",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "refClauseUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_REF_CLAUSE_PAGEABLE },
    }
  },
  {
    key: "uuid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function addendumClauseUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AddendumClause) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Addendum Clause',
        fields: getAddendumClauseFormFields(comp),
        closeAction$: addendumClause$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {input:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_ADDENDUM_CLAUSE : undefined,
            successFn: (res) => addendumClause$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Addendum Clause','uuid'),
  };
}

export function addendumClauseViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Addendum Clause',
    click: (data: AddendumClause) => navigateRelativeTo(comp, 'addendum-clauses', data?.uuid),
    permissions: [],
  };
}

 export function addendumClauseDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AddendumClause) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {clauseUid:data.uuid},
        mutation: DELETE_ADDENDUM_CLAUSE,
        finalFn: (res) => addendumClause$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Addendum Clause', 'clauseTitle'),
    permissions: [],
  };
}

export function addendumClauseTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        addendumClauseViewBtn(comp),
        addendumClauseUpsertBtn(comp),
        addendumClauseDeleteBtn(comp),
      ],
    },
  ];
}

