import { BaseEntity } from '../../base-entity/base-entity.model';
import { ApprovalStatus } from '@store/entities/approval-flow/approval-pocess-stage/approval-pocess-stage.model'
import { Chapter } from '@store/entities/settings/chapter/chapter.model'
import { ApprovalProcessStage } from '@store/entities/approval-flow/approval-pocess-stage/approval-pocess-stage.model'
import { Role } from '@store/entities/user-management/role/role.model'
import { User } from '@store/entities/user-management/user/user.model'
import { Division } from '@store/entities/hrm/settings/division/division.model'
import { ExchangeRate } from '@store/entities/accounts/exchange-rate/exchange-rate.model'
import { FinancialYear } from '@store/entities/planning/financial-year/financial-year.model'
import { SubActivity } from '@store/entities/planning/sub-activity/sub-activity.model'
import { ChartOfAccount } from '@store/entities/accounts/chart-of-account/chart-of-account.model'
import { Client } from '@store/entities/client/client/client.model'
import { Employee } from '@store/entities/hrm/employee/employee.model'
import { ExpenditureBudgetItem } from '@store/entities/budget/expenditure-budget/expenditure-budget.model'
import { BankAccount } from '@store/entities/accounts/bank-account/bank-account.model'
import { PaymentStatusEnum } from '@store/entities/accounting/payment/payment.model'
import { TaxRate } from '@store/entities/accounts/tax-rate/tax-rate.model'
import { ChequeSeries } from '@store/entities/accounts/cheque-series/cheque-series.model'

export interface PaymentRequest extends BaseEntity {
  amount?: number;
  approvalStatus?: ApprovalStatus;
  chapter?: Chapter;
  contentEditable?: boolean;
  currentApprovalStage?: ApprovalProcessStage;
  currentApprovalStageAssignedDate?: string;
  currentAssignedGroup?: Role;
  currentAssignedUserAccount?: User;
  department?: Division;
  description?: string;
  endDate?: string;
  exchangeRate?: ExchangeRate;
  finalApprovedBy?: User;
  finalApprovedByUsername?: string;
  finalApprovedDate?: string;
  financialYear?: FinancialYear;
  isApprovalCompleted?: boolean;
  items?: PaymentRequestItem;
  migrated?: boolean;
  paymentStatus?: PaymentRequestStatus;
  paymentVouchers?: PaymentVoucher;
  post?: Division;
  processName?: string;
  requestNumber?: string;
  startDate?: string;
  subActivity?: SubActivity;
  systemNumber?: string;
  title?: string;
}

export interface PaymentRequestItem extends BaseEntity {
  account?: ChartOfAccount;
  amount?: number;
  balance?: number;
  clientCode?: string;
  clientName?: string;
  clientPayee?: Client;
  description?: string;
  employeeName?: string;
  employeePayee?: Employee;
  expenditureBudgetItem?: ExpenditureBudgetItem;
  migrated?: boolean;
  paymentAmount?: number;
  paymentRequest?: PaymentRequest;
  paymentStatus?: PaymentRequestStatus;
  unitCost?: number;
}

export interface PaymentVoucher extends BaseEntity {
  accrualEntry?: boolean;
  amount?: number;
  approvalStatus?: ApprovalStatus;
  bankAccount?: BankAccount;
  chequeList?: ChequeList;
  chequeListItem?: ChequeListItem;
  chequeNumber?: string;
  chequeStatus?: ChequeStatus;
  client?: Client;
  contentEditable?: boolean;
  currentApprovalStage?: ApprovalProcessStage;
  currentApprovalStageAssignedDate?: string;
  currentAssignedGroup?: Role;
  currentAssignedUserAccount?: User;
  department?: Division;
  description?: string;
  entrySource?: string;
  expenseBudget?: boolean;
  finalApprovedBy?: User;
  finalApprovedByUsername?: string;
  finalApprovedDate?: string;
  financialYear: FinancialYear;
  isApprovalCompleted?: boolean;
  isCredit?: boolean;
  lines?: PaymentVoucherLine;
  memo?: string;
  migrated?: boolean;
  paymentDate?: string;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  paymentRequest?: PaymentRequest;
  paymentStatus?: PaymentStatusEnum;
  post?: Division;
  postedAt?: string;
  postedBy?: User;
  postedById?: number;
  processName?: string;
  recordEntryMethod?: RecordEntryMethod;
  reference?: string;
  requestFrom?: RequestFrom;
  sourceId?: number;
  status?: PaymentApprovalStatus;
  systemNumber?: string;
  taxRate?: TaxRate;
  title: string;
  totalVoucherAmount?: number;
  voucherDate: string;
  voucherNumber?: string;
  voucherType?: VoucherType;
}

export interface ChequeList extends BaseEntity {
  amount?: number;
  approvalStatus?: ApprovalStatus;
  bankAccount?: BankAccount;
  chequeListItems?: ChequeListItem;
  chequeListNumber?: string;
  chequeSeries?: ChequeSeries;
  contentEditable?: boolean;
  creatorDesignationId?: number;
  currentApprovalStage?: ApprovalProcessStage;
  currentApprovalStageAssignedDate?: string;
  currentAssignedGroup?: Role;
  currentAssignedUserAccount?: User;
  department?: Division;
  description?: string;
  entryDate?: string;
  finalApprovedBy?: User;
  finalApprovedByUsername?: string;
  finalApprovedDate?: string;
  financialYear?: FinancialYear;
  isApprovalCompleted?: boolean;
  migrated?: boolean;
  paymentMethod?: PaymentMethod;
  post?: Division;
  processName?: string;
  systemNumber?: string;
  title?: string;
}

export interface ChequeListItem extends BaseEntity {
  amount: number;
  chequeList?: ChequeList;
  chequeNumber?: string;
  chequeStatus: ChequeStatus;
  migrated?: boolean;
  payee: string;
  paymentStatus?: ChequeListItemPaymentStatus;
  paymentVoucher?: PaymentVoucher;
}

export interface PaymentVoucherLine extends BaseEntity {
  account?: ChartOfAccount;
  clientCode?: string;
  clientName?: string;
  clientPayee?: Client;
  description?: string;
  employeeName?: string;
  employeePayee?: Employee;
  grossAmount?: number;
  migrated?: boolean;
  netAmount?: number;
  paymentVoucher?: PaymentVoucher;
  withholdingAmount?: number;
}

export interface PaymentRequestDtoInput {
  chapterUid: string;
  departmentUid: string;
  description?: string;
  endDate?: string;
  items: PaymentRequestItemDtoInput;
  startDate?: string;
  subActivityUid: string;
  title: string;
  uid?: string;
}

export interface PaymentRequestItemDtoInput {
  amount: number;
  chartOfAccountUid: string;
  clientPayeeUid?: string;
  description?: string;
  employeePayeeUid?: string;
  expenditureBudgetItemUid: string;
  uid?: string;
  unitCost: number;
}

export enum PaymentRequestStatus {
  FULLY_PAID = 'FULLY_PAID',
  NOT_PAID = 'NOT_PAID',
  PARTIAL_PAID = 'PARTIAL_PAID',
}
export enum ChequeStatus {
  CLOSED_CHEQUE = 'CLOSED_CHEQUE',
  OPEN_CHEQUE = 'OPEN_CHEQUE',
}
export enum VoucherType {
  DUMMY_TRANSACTION_VOUCHER = 'DUMMY_TRANSACTION_VOUCHER',
  JOURNAL_VOCHER = 'JOURNAL_VOCHER',
  PAYMENT_VOUCHER = 'PAYMENT_VOUCHER',
  PETTY_CASH_VOUCHER = 'PETTY_CASH_VOUCHER',
}
export enum PaymentApprovalStatus {
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  CONFIRMED = 'CONFIRMED',
  DEFERRED = 'DEFERRED',
  DRAFT = 'DRAFT',
  INCOMPLETE = 'INCOMPLETE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
export enum RequestFrom {
  HR_PAYROLL = 'HR_PAYROLL',
  LOAN = 'LOAN',
  OTHER = 'OTHER',
}
export enum RecordEntryMethod {
  EXTERNAL_INTEGRATION = 'EXTERNAL_INTEGRATION',
  GEOS = 'GEOS',
  IMPORTED = 'IMPORTED',
  INTERNAL_INTEGRATION = 'INTERNAL_INTEGRATION',
  USER = 'USER',
}
export enum PaymentMethod {
  CHEQUE = 'CHEQUE',
  MOBILE_MONEY = 'MOBILE_MONEY',
  TISS = 'TISS',
  TRANSFER = 'TRANSFER',
}

export enum ChequeListItemPaymentStatus {
  CANCELLED = 'CANCELLED',
  UN_APPLIED = 'UN_APPLIED',
  UN_APPLIED_COMPLETED = 'UN_APPLIED_COMPLETED',
}
