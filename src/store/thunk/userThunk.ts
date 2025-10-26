import type { Dispatch } from 'redux';
import axios from 'axios';
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUserStart,
  createUserSuccess,
  createUserFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../slice/userSlice';
import type { User } from '../types';

export const fetchUsers = (page: number = 1, perPage: number = 5) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch(fetchUsersStart());
      
      const token = getState().auth.token;
      const response = await axios.get(`https://reqres.in/api/users?page=${page}&per_page=${perPage}`, {
        headers: token ? { Authorization: `Bearer ${token}` , "x-api-key": "reqres-free-v1" } : {},
      });

      dispatch(fetchUsersSuccess({
        users: response.data.data,
        page: response.data.page,
        total: response.data.total,
        totalPages: response.data.total_pages,
      }));
    } catch (error: any) {
      dispatch(fetchUsersFailure(
        error.response?.data?.error || 'Failed to fetch users'
      ));
    }
  };
};

export const createUser = (userData: Omit<User, 'id'>) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch(createUserStart());
      
      const token = getState().auth.token;
       await axios.post('https://reqres.in/api/users', userData, {
        headers: token ? { Authorization: `Bearer ${token}`, "x-api-key": "reqres-free-v1"  } : {},
      });

      const newUser: User = {
        id: Date.now(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        avatar: userData.avatar || 'https://reqres.in/img/faces/1-image.jpg',
      };

      dispatch(createUserSuccess(newUser));
      return newUser;
    } catch (error: any) {
      dispatch(createUserFailure(
        error.response?.data?.error || 'Failed to create user'
      ));
      throw error;
    }
  };
};

export const updateUser = (userId: number, userData: Partial<User>) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch(updateUserStart());
      
      const token = getState().auth.token;
      await axios.put(`https://reqres.in/api/users/${userId}`, userData, {
        headers: token ? { Authorization: `Bearer ${token}`, "x-api-key": "reqres-free-v1"  } : {},
      });

      const updatedUser: User = {
        id: userId,
        email: userData.email!,
        first_name: userData.first_name!,
        last_name: userData.last_name!,
        avatar: userData.avatar || 'https://reqres.in/img/faces/1-image.jpg',
      };

      dispatch(updateUserSuccess(updatedUser));
      return updatedUser;
    } catch (error: any) {
      dispatch(updateUserFailure(
        error.response?.data?.error || 'Failed to update user'
      ));
      throw error;
    }
  };
};

export const deleteUser = (userId: number) => {
  return async (dispatch: Dispatch, getState: any) => {
    try {
      dispatch(deleteUserStart());
      
      const token = getState().auth.token;
      await axios.delete(`https://reqres.in/api/users/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` , "x-api-key": "reqres-free-v1" } : {},
      });

      dispatch(deleteUserSuccess(userId));
    } catch (error: any) {
      dispatch(deleteUserFailure(
        error.response?.data?.error || 'Failed to delete user'
      ));
      throw error;
    }
  };
};