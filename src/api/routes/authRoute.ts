import express from 'express';
import {login} from '../controllers/authController';
import {body} from 'express-validator';
import {validationErrors} from '../../middlewares';

const router = express.Router();

router.post(
  '/login',
  body('username').notEmpty().escape(),
  body('password').notEmpty().escape(),
  validationErrors,
  login
);

export default router;
