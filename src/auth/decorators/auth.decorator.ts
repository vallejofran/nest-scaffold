import { SetMetadata } from '@nestjs/common'

/* Authentication constants */
export const jwtConstants = {
  secret:
    'DO_NOT_USE_THIS_VALUE_INSTEAD_CREATE_A_COMPLEX_SECRET_AND_KEEP_IT_SAFE_OUTSIDE_OF_THE_SOURCE_CODE',
}
export const IS_PUBLIC_KEY = 'isPublic'
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)
