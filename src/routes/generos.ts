import { Router } from 'express';
import { createGenero, listGeneros } from '../controllers/generosController';

const router = Router();

router.post('/', createGenero);
router.get('/', listGeneros);

export default router;
