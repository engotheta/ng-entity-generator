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

import { undefined, SOFT_DELETE_ADDENDUM_CLAUSE_SPECIFICATION } from './addendum-clause-spec.graphql';
import { SAVE_OR_UPDATE_ADDENDUM_CLAUSE_SPECIFICATION  } from './addendum-clause-spec.graphql';
import { AddendumClauseSpec } from './addendum-clause-spec.interface';

//Listener for all AddendumClauseSpec actions 
export const addendumClauseSpec$ = new Subject<AddendumClauseSpec | any>();

export const getAddendumClauseSpecFormFields = (comp: BaseComponent): FieldConfig[] => [
  {
    key: "addendumClauseUid",
    type: FieldType.select,
    validations: [VALIDATOR_REQUIRED],
    optionsVariables : {
      fetchParameter:{ query:ALL_ADDENDUM_CLAUSE_PAGEABLE },
    }
  },
  {
    key: "refSpecificationUid",
    type: FieldType.select,
    validations: [],
    optionsVariables : {
      fetchParameter:{ query:ALL_REF_SPECIFICATION_PAGEABLE },
    }
  },
  {
    key: "requiredData",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "specification",
    type: FieldType.input,
    validations: [VALIDATOR_REQUIRED],
  },
  {
    key: "uuid",
    type: FieldType.input,
    validations: [],
    visible: false,
  },
];

export function addendumClauseSpecUpsertBtn(comp: BaseComponent):ActionButton {
  return {
    click: (data?: AddendumClauseSpec) => {
      const formParameter: FormParameters = {
        model: {...data},
        title: 'Addendum Clause Spec',
        fields: getAddendumClauseSpecFormFields(comp),
        closeAction$: addendumClauseSpec$,

        onSubmit: async (value: any) => {
          await comp.fs.fetch({
            notify: true,
            variables: !!data ? {input:value} : {undefined},
            mutation: !!data ? SAVE_OR_UPDATE_ADDENDUM_CLAUSE_SPECIFICATION : undefined,
            successFn: (res) => addendumClauseSpec$.next(res?.data),
          });
        },
      };

      comp.vs?.openModal(FormComponent, formParameter, '96%', '720px');
    },
    permissions: [],
    ...getUpsertBtnProps('Addendum Clause Spec','uuid'),
  };
}

export function addendumClauseSpecViewBtn(comp: BaseComponent):ActionButton {
  return {
    icon: 'view',
    label: 'View Addendum Clause Spec',
    click: (data: AddendumClauseSpec) => navigateRelativeTo(comp, 'addendum-clause-specs', data?.uuid),
    permissions: [],
  };
}

 export function addendumClauseSpecDeleteBtn(comp: BaseComponent):ActionButton {
  return {

    click: async (data: AddendumClauseSpec) => {
      await comp.fs.fetch({
        notify: true,
        loadingOn: 'content',
        variables: {addendumClauseSpecUuid:data.uuid},
        mutation: SOFT_DELETE_ADDENDUM_CLAUSE_SPECIFICATION,
        finalFn: (res) => addendumClauseSpec$.next(res?.data),
      });
    },
    ...getDeleteBtnProps('Addendum Clause Spec', 'name'),
    permissions: [],
  };
}

export function addendumClauseSpecTableBtns(comp: BaseComponent):ActionButton[] {
  return  [
    {
      ...MORE_BTN,
      buttons: [
        addendumClauseSpecViewBtn(comp),
        addendumClauseSpecUpsertBtn(comp),
        addendumClauseSpecDeleteBtn(comp),
      ],
    },
  ];
}

