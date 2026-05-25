import { Router } from 'express';
import {
  addPlataformasToJogo,
  createJogo,
  listJogos,
} from '../controllers/jogosController';

const router = Router();

router.post('/', createJogo);
router.get('/', listJogos);
router.post('/:id/plataformas', addPlataformasToJogo);

export default router;
