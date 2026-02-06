
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
}

export interface TaskCategoryFilterInput {
  active?: boolean;
  code?: string;
  id?: number;
  name?: string;
  uid?: string;
}

export interface TaskCategoryResponse {
  active?: boolean;
  code?: string;
  createdAt?: string;
  description?: string;
  name?: string;
  updatedAt?: string;
  uuid?: string;
}

