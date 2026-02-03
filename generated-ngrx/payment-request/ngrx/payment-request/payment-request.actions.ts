import { PaymentRequest, PaymentRequestDtoInput } from './payment-request.model';
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export const PaymentRequestActions = createActionGroup({
  source: 'PaymentRequest/API',
  events: {
  'Load Payment Requests': props<{ paymentRequests: PaymentRequest[] }>(),
  'Add Payment Request': props<{ paymentRequest: PaymentRequest }>(),
  'Upsert Payment Request': props<{ paymentRequest: PaymentRequest }>(),
  'Add Payment Requests': props<{ paymentRequests: PaymentRequest[] }>(),
  'Upsert Payment Requests': props<{ paymentRequests: PaymentRequest[] }>(),
  'Update Payment Request': props<{ paymentRequest: Update<PaymentRequest> }>(),
  'Update Payment Requests': props<{ paymentRequests: Update<PaymentRequest>[] }>(),
  'Delete Payment Request': props<{ id: number }>(),
  'Delete Payment Requests': props<{ ids: number[] }>(),
  'Clear Payment Request': emptyProps(),
  'Clear Payment Requests': emptyProps(),

    // API
  'Save Payment Request': props<{ input:PaymentRequestDtoInput }>() ,
  'Simple Approve Payment Request': props<{ uid:String, bankAccountUid:String }>() ,
  'Simple Approve Payment Request Success': props<{ data:any }>() ,
  'Delete Payment Request Api': props<{ uid:String }>() ,
  },
});
