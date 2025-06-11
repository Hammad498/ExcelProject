import { Router } from 'express';
import { body } from 'express-validator';
import { register, login,userInfo } from '../controllers/authController.js';
import { validate } from '../middlewares/validateRequest.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').exists()],
  validate,
  login
);

router.get('/profile',authenticate,  userInfo)

export default router;
