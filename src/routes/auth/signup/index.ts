import { Router } from 'express';
import { signup } from '@/controllers/auth/signup';

const router = Router();

router.post('/signup', signup);

export default router;
