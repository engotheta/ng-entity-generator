import { Component, OnInit } from '@angular/core'
import { ANIMATION, ActionButton, ActionListener } from '@shared';
import { BaseComponent } from '@shared/view/base-component';
import { GeneralLedgerEntryActions } from '@store/entities/accounts/general-ledger-entry/general-ledger-entry.actions';
import { mapGeneralLedgerEntry } from '@store/entities/accounts/general-ledger-entry/general-ledger-entry.selectors';
import { getGeneralLedgerEntryUpsertButton } from './general-ledger-entry/general-ledger-entry.form';
import { getGeneralLedgerEntryButtons } from './general-ledger-entry/general-ledger-entry.form';


@Component({
  selector: 'app-general-ledger-entries',
  templateUrl: './general-ledger-entries.component.html',
  styleUrls: ['./general-ledger-entries.component.scss'],
})
export class GeneralLedgerEntriesComponent extends BaseComponent implements OnInit {
  title = 'General Ledger Entries';
  animation = ANIMATION;
  actionButtons: ActionButton[] = [];

  query =  undefined;
  queryVariables = { active: true };
  tableButtons: ActionButton[] = [];

  mapFunction = mapGeneralLedgerEntry;
  columnsKeys = ['description', 'credit', 'debit', 'entryDate', 'reference', 'runningBalance'];
  searchKeys = ['description'];

  reloadActions = [
    GeneralLedgerEntryActions.upsertGeneralLedgerEntry,
    GeneralLedgerEntryActions.deleteGeneralLedgerEntry
  ];

  ngOnInit(): void {
    this.setButtons();
    this.setTableOptions();
    this.listenToActions();
  }

  setButtons() {
    this.actionButtons = [getGeneralLedgerEntryUpsertButton(this, true, 'add')];
    this.tableButtons = [...getGeneralLedgerEntryButtons(this)];
  }

  listenToActions() {
    const listeners: ActionListener[] = [{ actions: this.reloadActions, callback: () => 0} ];
    this.addActionListeners(listeners);
  }
}
