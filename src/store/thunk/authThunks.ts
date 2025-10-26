import type { Dispatch } from 'redux';
import axios from 'axios';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../slice/authSlice';

export const login = (email: string, password: string) => {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(loginStart());
      
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'reqres-free-v1'
        },
      });

      dispatch(loginSuccess(response.data.token));
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch(loginFailure(errorMessage));
      throw new Error(errorMessage);
    }
  };
};