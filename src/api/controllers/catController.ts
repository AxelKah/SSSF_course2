// TODO: create following functions:
// - catGetByUser - get all cats by current user id
// - catGetByBoundingBox - get all cats by bounding box coordinates (getJSON)
// - catPutAdmin - only admin can change cat owner
// - catDeleteAdmin - only admin can delete cat
// - catDelete - only owner can delete cat
// - catPut - only owner can update cat
//// - catGet - get cat by id
//// - catListGet - get all cats
//// - catPost - create new cat
import {Request, Response, NextFunction} from 'express';
import {MessageResponse} from '../../types/MessageTypes';
import catModel from '../models/catModel';
import {Cat} from '../../types/DBTypes';
import CustomError from '../../classes/CustomError';

const catGet = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Cat>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.findById(req.params.id).select('-__v');
    if (!cat) {
      throw new CustomError('No cat found', 404);
    }
    res.json(cat);
  } catch (error) {
    next(error);
  }
};

const catListGet = async (
  req: Request,
  res: Response<Cat[]>,
  next: NextFunction
) => {
  try {
    const cats = await catModel.find().select('-__v');
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

const catPost = async (
  req: Request<{}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {
  try {
    const cat = await catModel.create(req.body);
    const response = {
      message: 'Cat added',
      data: cat,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const catPut = async (
  req: Request<{id: string}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {};

const catGetByUser = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<Cat>,
  next: NextFunction
) => {};

const catGetByBoundingBox = async (
  req: Request<{}, {}, {}>,
  res: Response<Cat[]>,
  next: NextFunction
) => {};

const catPutAdmin = async (
  req: Request<{id: string}, {}, Omit<Cat, 'cat_id'>>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {};

const catDeleteAdmin = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {};

const catDelete = async (
  req: Request<{id: string}, {}, {}>,
  res: Response<MessageResponse & {data: Cat}>,
  next: NextFunction
) => {};

export {
  catPost,
  catListGet,
  catGet,
  catPut,
  catGetByUser,
  catGetByBoundingBox,
  catPutAdmin,
  catDeleteAdmin,
  catDelete,
};
