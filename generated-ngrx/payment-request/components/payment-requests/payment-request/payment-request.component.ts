import { Component, OnInit } from "@angular/core";
import { ANIMATION, QueryParameter, COMMON_FIELD_STRINGS, HIGHLIGHT  } from "@shared";
import { ActionListener  } from "@shared";
import { BaseComponent } from "@shared/view/base-component";
import { cloneDeep } from "@apollo/client/utilities";
import { ViewParameter } from "@shared/components/view-component/view-interface";
import { ContentParameter } from "@shared/components/view-component/view-interface";
import { getPaymentRequestUpsertButton } from "./payment-request.form";
import { PaymentRequestActions } from "@store/entities/accounts/payment-request/payment-request.actions";
import { PaymentRequest } from "@store/entities/accounts/payment-request/payment-request.model";
import { mapPaymentRequest } from "@store/entities/accounts/payment-request/payment-request.selectors";
import { FIND_PAYMENT_REQUEST } from "@store/entities/accounts/payment-request/payment-request.graphql";
import { getPaymentRequestItemUpsertButton } from "./payment-request-item.form";
import { getPaymentRequestItemButtons } from "./payment-request-item.form";
import { PaymentRequestItemActions } from "@store/entities/accounts/payment-request/payment-request-item.actions";
import { PaymentRequestItem } from "@store/entities/accounts/payment-request/payment-request-item.model";
import { mapPaymentRequestItem } from "@store/entities/accounts/payment-request/payment-request-item.selectors";
import { getPaymentVoucherUpsertButton } from "./payment-voucher.form";
import { getPaymentVoucherButtons } from "./payment-voucher.form";
import { PaymentVoucherActions } from "@store/entities/accounts/payment-request/payment-voucher.actions";
import { PaymentVoucher } from "@store/entities/accounts/payment-request/payment-voucher.model";
import { mapPaymentVoucher } from "@store/entities/accounts/payment-request/payment-voucher.selectors";

@Component({
  selector: "app-payment-request",
   template: `<view-component [viewParameter]="viewParameter"></view-component>`
})
export class PaymentRequestComponent extends BaseComponent implements OnInit {
  title = "Payment Request";
  animation = ANIMATION;
  viewParameter: ViewParameter;

  paymentRequest: PaymentRequest;
  reloadActions = [ PaymentRequestActions.upsertPaymentRequest ];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.setContentParameters();
    this.onNavigateToSelf(() => this.ngOnInit());
  }

  async loadData() {
    let query = FIND_PAYMENT_REQUEST;
    let qp: QueryParameter = { mapFunction: mapPaymentRequest };
    let uid = this.route.snapshot?.paramMap?.get("uid");
    this.paymentRequest = cloneDeep(await this.fs.getData(qp, query, uid));
  }

  setContentParameters() {
    let data = {paymentRequestUid:this.paymentRequest.uid};
    let subtitle = this.paymentRequest.title;

    let contentsParameters: ContentParameter[] = [
      {
        icon: "item",
        type: "details",
        slug: "payment-request",
        name: subtitle,
        headerButtons: [getPaymentRequestUpsertButton(this, false, "edit")],
        entity: this.paymentRequest,

        fieldsStrings:[
          `title, finalApprovedByUsername, processName, description valueClass(${HIGHLIGHT})`,
          ...COMMON_FIELD_STRINGS,
        ],

        children: [
          {
            type: "table",
            slug: "payment-request-item",
            name: "Payment Request Item",
            icon: "item",
            columnsKeys: ['title', 'finalApprovedByUsername', 'processName', 'description', 'amount', 'chapter'],
            searchStatesValues: [{ key: "paymentRequest.uid", value: this.paymentRequest.uid }],
            mapFunction: mapPaymentRequestItem,
            actionButtons: getPaymentRequestItemButtons(this, data),
            headerButtons: [getPaymentRequestItemUpsertButton(this, false, "add", data)], 
            query: ALL_PAYMENT_REQUEST_ITEM_PAGEABLE, //TODO: put query
            reloadActions: [PaymentRequestItemActions.upsertPaymentRequestItem, PaymentRequestItemActions.deletePaymentRequestItem],
          },
          {
            type: "table",
            slug: "payment-voucher",
            name: "Payment Voucher",
            icon: "item",
            columnsKeys: ['title', 'finalApprovedByUsername', 'processName', 'description', 'amount', 'chapter'],
            searchStatesValues: [{ key: "paymentRequest.uid", value: this.paymentRequest.uid }],
            mapFunction: mapPaymentVoucher,
            actionButtons: getPaymentVoucherButtons(this, data),
            headerButtons: [getPaymentVoucherUpsertButton(this, false, "add", data)], 
            query: ALL_PAYMENT_VOUCHER_PAGEABLE, //TODO: put query
            reloadActions: [PaymentVoucherActions.upsertPaymentVoucher, PaymentVoucherActions.deletePaymentVoucher],
          },
        ],
      },
    ];

    //set view
    this.viewParameter = {
      animation: this.animation,
      title: this.title,
      subtitle: subtitle,
      contentsParameters,
    };
  }

  listenToActions() {
    const listeners: ActionListener[] = [
      { actions: [...this.reloadActions], callback: () => this.loadData()},
    ];

    this.addActionListeners(listeners);
  }
}
