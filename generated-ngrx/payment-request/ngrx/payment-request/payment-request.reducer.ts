import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { PaymentRequest } from './payment-request.model';
import { PaymentRequestActions } from './payment-request.actions';

export const paymentRequestsFeatureKey = 'paymentRequests';

export type State = EntityState<PaymentRequest>;

export const adapter: EntityAdapter<PaymentRequest> = createEntityAdapter<PaymentRequest>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(PaymentRequestActions.addPaymentRequest, (state, action) =>
  adapter.addOne(action.paymentRequest, state)
  ),
  on(PaymentRequestActions.upsertPaymentRequest, (state, action) =>
  adapter.upsertOne(action.paymentRequest, state)
  ),
  on(PaymentRequestActions.addPaymentRequests, (state, action) =>
  adapter.addMany(action.paymentRequests, state)
  ),
  on(PaymentRequestActions.upsertPaymentRequests, (state, action) =>
  adapter.upsertMany(action.paymentRequests, state)
  ),
  on(PaymentRequestActions.updatePaymentRequest, (state, action) =>
  adapter.updateOne(action.paymentRequest, state)
  ),
  on(PaymentRequestActions.updatePaymentRequests, (state, action) =>
  adapter.updateMany(action.paymentRequests, state)
  ),
  on(PaymentRequestActions.deletePaymentRequest, (state, action) =>
    adapter.removeOne(action.id, state)
  ),
  on(PaymentRequestActions.deletePaymentRequests, (state, action) =>
    adapter.removeMany(action.ids, state)
  ),
  on(PaymentRequestActions.loadPaymentRequests, (state, action) =>
  adapter.setAll(action.paymentRequests, state)
  ),
  on(PaymentRequestActions.clearPaymentRequests, state => adapter.removeAll(state))
);

export const paymentRequestsFeature = createFeature({
  name: paymentRequestsFeatureKey,
  reducer,
  extraSelectors: ({ selectPaymentRequestsState }) => ({
  ...adapter.getSelectors(selectPaymentRequestsState),
  }),
});

export const { selectIds, selectEntities, selectAll, selectTotal } = paymentRequestsFeature;
