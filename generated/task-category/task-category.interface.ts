
export interface TaskCategoryRequestInput {
  code: string;
  description?: string;
  id?: string;
  name: string;
}

export interface TaskCategory {
  active?: boolean;
  code: string;
  description?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  uuid?: string;
}

export interface TaskCategoryFilterInput {
  active?: boolean;
  code?: string;
  id?: number;
  name?: string;
  uid?: string;
}

