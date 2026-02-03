import { Component, OnInit } from '@angular/core'
import { ANIMATION, ActionButton, ActionListener } from '@shared';
import { BaseComponent } from '@shared/view/base-component';
import { GeneralLedgerEntryDtoActions } from '@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.actions';
import { mapGeneralLedgerEntryDto } from '@store/entities/accounts/general-ledger-entry-dto/general-ledger-entry-dto.selectors';
import { getGeneralLedgerEntryDtoUpsertButton } from './general-ledger-entry-dto/general-ledger-entry-dto.form';
import { getGeneralLedgerEntryDtoButtons } from './general-ledger-entry-dto/general-ledger-entry-dto.form';


@Component({
  selector: 'app-general-ledger-entry-dtos',
  templateUrl: './general-ledger-entry-dtos.component.html',
  styleUrls: ['./general-ledger-entry-dtos.component.scss'],
})
export class GeneralLedgerEntryDtosComponent extends BaseComponent implements OnInit {
  title = 'General Ledger Entry Dtos';
  animation = ANIMATION;
  actionButtons: ActionButton[] = [];

  query =  undefined;
  queryVariables = { active: true };
  tableButtons: ActionButton[] = [];

  mapFunction = mapGeneralLedgerEntryDto;
  columnsKeys = ['description', 'credit', 'debit', 'entryDate', 'reference', 'runningBalance'];
  searchKeys = ['description'];

  reloadActions = [
    GeneralLedgerEntryDtoActions.upsertGeneralLedgerEntryDto,
    GeneralLedgerEntryDtoActions.deleteGeneralLedgerEntryDto
  ];

  ngOnInit(): void {
    this.setButtons();
    this.setTableOptions();
    this.listenToActions();
  }

  setButtons() {
    this.actionButtons = [getGeneralLedgerEntryDtoUpsertButton(this, true, 'add')];
    this.tableButtons = [...getGeneralLedgerEntryDtoButtons(this)];
  }

  listenToActions() {
    const listeners: ActionListener[] = [{ actions: this.reloadActions, callback: () => 0} ];
    this.addActionListeners(listeners);
  }
}
