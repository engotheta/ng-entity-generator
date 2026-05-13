import { Client } from '@routes/gas-nomination/clients/clients.interface'
import { User } from '@routes/auth/auth.interface'
import { Plant } from '@routes/plants/plants/plant.interface'

export interface PlantReceivedData {
  active?: boolean;
  availableCapacity?: number;
  client?: Client;
  createdAt?: string;
  createdBy?: User;
  createdById?: number;
  deletedAt?: string;
  deletedBy?: number;
  deletedId?: number;
  flaredGas?: number;
  id?: number;
  isDeleted?: boolean;
  migrated?: boolean;
  ownUseGas?: number;
  plant?: Plant;
  producedGas?: number;
  receivedRawGasPressure?: number;
  receivedRawGasTemperature?: number;
  receivedRawGasVolume?: number;
  uid?: string;
  updatedAt?: string;
  updatedBy?: number;
  utilizedCapacity?: number;
}

export interface PlantReceivedDataDtoInput {
  availableCapacity?: number;
  clientUid?: string;
  flaredGas?: number;
  ownUseGas?: number;
  plantUid?: string;
  producedGas?: number;
  receivedRawGasPressure?: number;
  receivedRawGasTemperature?: number;
  receivedRawGasVolume?: number;
  uid?: string;
  utilizedCapacity?: number;
}

