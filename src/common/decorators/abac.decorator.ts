import { SetMetadata } from '@nestjs/common';

export const Abac_Action_key = 'action';
export const AbacAction = (action: string) =>
  SetMetadata(Abac_Action_key, action);
