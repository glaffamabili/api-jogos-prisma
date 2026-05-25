import { Router } from 'express';
import { createPlataforma, listPlataformas } from '../controllers/plataformasController';

const router = Router();

router.post('/', createPlataforma);
router.get('/', listPlataformas);

export default router;
