// TODO: create the following functions:
// - userGet - get user by id
// - userListGet - get all users
// - userPost - create new user. Remember to hash password
// - userPutCurrent - update current user
// - userDeleteCurrent - delete current user
// - checkToken - check if current user token is valid: return data from res.locals.user as UserOutput. No need for database query

import {Request, Response, NextFunction} from 'express';
import {User} from '../../types/DBTypes';
import {MessageResponse} from '../../types/MessageTypes';
import userModel from '../models/userModel';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcrypt';

const userListGet = async (
  req: Request,
  res: Response<User[]>,
  next: NextFunction
) => {
  try {
    const users = await userModel.find().select('-password -__v -role');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<User>,
  next: NextFunction
) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .select('-password -__v -role');
    if (!user) {
      throw new CustomError('No user found', 404);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, Omit<User, 'user_id'>>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction
) => {
  try {
    req.body.role = 'user';
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    let user = await userModel.create(req.body);
    user = await userModel.findById(user._id).select('-password -__v -role');
    const response = {
      message: 'User added',
      data: user,
    };
    console.log(response);
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userPutCurrent = async (
  req: Request<{}, {}, User>,
  res: Response<MessageResponse & {data: User}>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    let user = await userModel.findByIdAndUpdate(
      res.locals.user._id,
      req.body,
      {new: true}
    );
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    user = await userModel.findById(user._id).select('-password -__v -role');
    const response = {
      message: 'User updated',
      data: user as User,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDeleteCurrent = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const user = await userModel.findByIdAndDelete(res.locals.user._id);
    if (!user) {
      throw new CustomError('User not found', 404);
    }
    res.json({
      message: 'User deleted',
      data: {user_name: user.user_name, email: user.email},
    } as MessageResponse & {data: {user_name: string; email: string}});
  } catch (error) {
    next(error);
  }
};

const checkToken = async (
  req: Request,
  res: Response<MessageResponse>,
  next: NextFunction
) => {
  try {
    if (!res.locals.user) {
      throw new CustomError('Not authorized', 401);
    }
    const user = await res.locals.user;

    const filteredUser = {...user};
    delete filteredUser.password;
    delete filteredUser.role;

    console.log(filteredUser);
    res.json(filteredUser);
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPutCurrent,
  userDeleteCurrent,
  checkToken,
};