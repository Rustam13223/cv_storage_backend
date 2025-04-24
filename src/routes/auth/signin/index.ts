import { Router } from 'express';
import { signin } from '@/controllers/auth/signin';

const router = Router();

router.post('/signin', signin);

export default router;
