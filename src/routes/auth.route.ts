import express from 'express';
import { signUp,login,logout } from '../controller/auth.controller';


const router= express.Router();

// signup and login routes
router.post('/signup',signUp);
router.post('/login',login);
router.get('/logout',logout);

export default router;