import express from 'express';
import { getUserLogs,getAllUsers } from '../controller/user.controller';
import { authorization } from '../middleware/auth.middleware';

const router= express.Router();

router.get('/getUserLogs',authorization,getUserLogs);
router.get('/getAllUsers', authorization,getAllUsers);

export default router;