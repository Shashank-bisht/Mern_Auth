import express from 'express';
import { signup } from '../controllers/auth.controller.js';
import { signin } from '../controllers/auth.controller.js';
import { google } from '../controllers/auth.controller.js';
import { signout } from '../controllers/auth.controller.js';
import { forgetpass } from '../controllers/auth.controller.js';
import { resetPassword } from '../controllers/auth.controller.js';
const router = express.Router();

router.post('/signup', signup)
router.post('/signin', signin)
router.post('/google', google)
router.get('/signout',signout)
router.post('/forgot-password',forgetpass)
router.post('/reset-password/:id/:token', resetPassword)
export default router;