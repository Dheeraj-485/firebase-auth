export enum AbacActionEnum {
  //FOR USER ROLE
  GET_PROFILE = 'getProfile',
  UPDATE_PROFILE = 'updateProfile',
  CREATE_PROFILE = 'createProfile',
  //DELETE_PROFILE="deleteProfile" If a user can delete his own profile

  //FOR ADMIN ROLE
  DELETE_USER = 'deleteUser',
  GET_USERS = 'getUsers',

  // Address Actions
  CREATE_ADDRESS = 'createAddress',
  GET_ADDRESSES = 'getAddresses',
  DELETE_ADDRESS = 'deleteAddress',
  GET_ALL_ADDRESSES = 'getAllAddresses',

  //FOR SUPERADMIN ROLE
}
