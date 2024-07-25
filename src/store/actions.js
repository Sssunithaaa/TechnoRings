export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT = 'LOGOUT';

export const loginSuccess = (user, role,id) => ({
  type: LOGIN_SUCCESS,
  payload: { user, role ,id},
});

export const logout = () => ({
  type: LOGOUT,
});
