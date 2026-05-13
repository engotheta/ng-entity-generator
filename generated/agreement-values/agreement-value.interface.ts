import { AgreementDTO } from '@features/agreements/agreements/agreement.interface'

export interface AgreementValue {
  agreementDTO?: AgreementDTO;
  agreementUuid?: string;
  createdAt?: string;
  createdBy?: number;
  currencyDTO?: CurrencyDTO;
  currencyUuid?: string;
  exchangeRate?: number;
  exchangeRateDate?: string;
  uuid?: string;
  valueVatExclusive?: number;
  valueVatInclusive?: number;
}

export interface CurrencyDTO {
  active?: boolean;
  code?: string;
  isDefault?: boolean;
  name?: string;
  uuid?: string;
}

export interface AgreementValueDTOInput {
  agreementDTO?: AgreementDTOInput;
  agreementUuid?: string;
  createdAt?: string;
  createdBy?: number;
  currencyDTO?: CurrencyDTOInput;
  currencyUuid?: string;
  exchangeRate?: number;
  exchangeRateDate?: string;
  uuid?: string;
  valueVatExclusive?: number;
  valueVatInclusive?: number;
}

