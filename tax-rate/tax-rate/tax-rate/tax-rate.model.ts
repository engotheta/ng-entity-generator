import { BaseEntity } from '../../base-entity/base-entity.model';

export interface ClientCategory extends BaseEntity {
  clientCategoryGroup?: ClientCategoryGroup;
  code?: string;
  migrated?: boolean;
  name?: string;
}

export interface ClientCategoryDtoInput {
  clientCategoryGroup: ClientCategoryGroup;
  code: string;
  name: string;
  uid?: string;
}

export enum ClientCategoryGroup {
  BOTH = 'BOTH',
  PROVIDER = 'PROVIDER',
  RECEIVER = 'RECEIVER',
}
