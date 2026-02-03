import { Component, OnInit } from '@angular/core'
import { ANIMATION, ActionButton, ActionListener } from '@shared';
import { BaseComponent } from '@shared/view/base-component';
import { AccountCreditDebitNoteActions } from '@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.actions';
import { mapAccountCreditDebitNote } from '@store/entities/accounts/account-credit-debit-note/account-credit-debit-note.selectors';
import { getAccountCreditDebitNoteUpsertButton } from './account-credit-debit-note/account-credit-debit-note.form';
import { getAccountCreditDebitNoteButtons } from './account-credit-debit-note/account-credit-debit-note.form';


@Component({
  selector: 'app-account-credit-debit-notes',
  templateUrl: './account-credit-debit-notes.component.html',
  styleUrls: ['./account-credit-debit-notes.component.scss'],
})
export class AccountCreditDebitNotesComponent extends BaseComponent implements OnInit {
  title = 'Account Credit Debit Notes';
  animation = ANIMATION;
  actionButtons: ActionButton[] = [];

  query =  undefined;
  queryVariables = { active: true };
  tableButtons: ActionButton[] = [];

  mapFunction = mapAccountCreditDebitNote;
  columnsKeys = ['finalApprovedByUsername', 'processName', 'description', 'amountApplied', 'balance', 'client'];
  searchKeys = ['finalApprovedByUsername', 'processName', 'description'];

  reloadActions = [
    AccountCreditDebitNoteActions.upsertAccountCreditDebitNote,
    AccountCreditDebitNoteActions.deleteAccountCreditDebitNote
  ];

  ngOnInit(): void {
    this.setButtons();
    this.setTableOptions();
    this.listenToActions();
  }

  setButtons() {
    this.actionButtons = [getAccountCreditDebitNoteUpsertButton(this, true, 'add')];
    this.tableButtons = [...getAccountCreditDebitNoteButtons(this)];
  }

  listenToActions() {
    const listeners: ActionListener[] = [{ actions: this.reloadActions, callback: () => 0} ];
    this.addActionListeners(listeners);
  }
}
