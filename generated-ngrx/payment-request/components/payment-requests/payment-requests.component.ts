import { Component, OnInit } from '@angular/core'
import { ANIMATION, ActionButton, ActionListener } from '@shared';
import { BaseComponent } from '@shared/view/base-component';
import { PaymentRequestActions } from '@store/entities/accounts/payment-request/payment-request.actions';
import { mapPaymentRequest } from '@store/entities/accounts/payment-request/payment-request.selectors';
import { getPaymentRequestUpsertButton } from './payment-request/payment-request.form';
import { getPaymentRequestButtons } from './payment-request/payment-request.form';

import { ALL_PAYMENT_REQUEST_PAGEABLE } from '@store/entities/accounts/payment-request/payment-request.graphql';

@Component({
  selector: 'app-payment-requests',
  templateUrl: './payment-requests.component.html',
  styleUrls: ['./payment-requests.component.scss'],
})
export class PaymentRequestsComponent extends BaseComponent implements OnInit {
  title = 'Payment Requests';
  animation = ANIMATION;
  actionButtons: ActionButton[] = [];

  query =  ALL_PAYMENT_REQUEST_PAGEABLE;
  queryVariables = { active: true };
  tableButtons: ActionButton[] = [];

  mapFunction = mapPaymentRequest;
  columnsKeys = ['title', 'finalApprovedByUsername', 'processName', 'description', 'amount', 'chapter'];
  searchKeys = ['title', 'finalApprovedByUsername', 'processName', 'description'];

  reloadActions = [
    PaymentRequestActions.upsertPaymentRequest,
    PaymentRequestActions.deletePaymentRequest
  ];

  ngOnInit(): void {
    this.setButtons();
    this.setTableOptions();
    this.listenToActions();
  }

  setButtons() {
    this.actionButtons = [getPaymentRequestUpsertButton(this, true, 'add')];
    this.tableButtons = [...getPaymentRequestButtons(this)];
  }

  listenToActions() {
    const listeners: ActionListener[] = [{ actions: this.reloadActions, callback: () => 0} ];
    this.addActionListeners(listeners);
  }
}
