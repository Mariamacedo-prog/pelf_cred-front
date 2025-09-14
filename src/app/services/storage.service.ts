
import { createReducer, on, createAction, props, Store } from '@ngrx/store';

export interface AuthState {
  isLoggedIn: boolean;
  user: any;
  permissions: any; 
  token: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  permissions: null,
  token: ''
};

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: any, token: string }>()
);

export const logOutSuccess = createAction(
   '[Auth] Logout Success'
);

export const setPermissions = createAction(
  '[Auth] Set Permissions',
  props<{ permissions: any }>()
);

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { user, token }) => ({
    ...state,
    isLoggedIn: true,
    user: user,
    token: token
  })),
  on(logOutSuccess, (state) => ({
    ...state,
    isLoggedIn: false,
    user: null, 
    token: '', 
    permissions: {} 
  })),
  on(setPermissions, (state, { permissions }) => ({
    ...state,
    permissions: permissions
  }))
);