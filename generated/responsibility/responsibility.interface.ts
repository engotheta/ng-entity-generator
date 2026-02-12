
export interface Responsibility {
  active: boolean;
  description: string;
  name: string;
  areas?: AreaResponse[];
  uuid?: string;
}

export interface ResponsibilityFilterInput {
  active?: boolean;
  id?: number;
  name?: string;
  uid?: string;
}

export interface ResponsibilityRequestInput {
  areaIds: string[];
  description: string;
  id?: string;
  name: string;
}

