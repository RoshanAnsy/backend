import express from 'express';
import { getUserLog,getAllUsers } from '../controller/user.controller';
import { authorization } from '../middleware/auth.middleware';

const router= express.Router();

router.get('/getUserLogs',authorization,getUserLog);
router.get('/getAllUsers', authorization,getAllUsers);

export default router;