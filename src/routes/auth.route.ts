import express from 'express';
import { signUp,login,logout } from '../controller/auth.controller';
import { authorization } from '../middleware/auth.middleware';


const router= express.Router();

// signup and login routes
router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',authorization,logout);

export default router;