
export interface Area {
  active: boolean;
  code: string;
  description: string;
  name: string;
  uuid?: string;
}

export interface AreaFilterInput {
  active?: boolean;
  code?: string;
  id?: number;
  name?: string;
  uid?: string;
}

export interface AreaRequestInput {
  code: string;
  description: string;
  id?: string;
  name: string;
}

