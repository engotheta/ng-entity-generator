import { createSelector } from '@ngrx/store';
import { paymentRequestsFeatureKey } from './payment-request.reducer';
import * as fromPaymentRequest from './payment-request.reducer';
import { AppState } from '../../../index';
import { PaymentRequest } from './payment-request.model';
import { formatDates } from '@shared/data/data.helpers';

export const currentPaymentRequestsState = (state: AppState) => state[paymentRequestsFeatureKey];

export const selectPaymentRequestFromReducer = createSelector(
  currentPaymentRequestsState,
  fromPaymentRequest.selectAll
);

export const selectPaymentRequests = createSelector(selectPaymentRequestFromReducer, (items:PaymentRequest[]) => {
  return items?.map((item:PaymentRequest) => mapPaymentRequest(item));
});

export const mapPaymentRequest = (item: PaymentRequest) => {
  return {
    ...item,
    ...formatDates(item), // adds createdAtMod,...etc,
    activeMod: item?.active ? 'Active' : 'In Active',
  };
};

export const selectPaymentRequestById = (id: number) =>
  createSelector(selectPaymentRequests, items => items.find(item => item.id === id));

export const selectPaymentRequestByUid = (uid: string) =>
  createSelector(selectPaymentRequests, items => items.find(item => item.uid === uid));
