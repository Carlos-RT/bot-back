import express from 'express';
import { guardarResultado, obtenerResultados } from '../controllers/quizController.js';

const router = express.Router();

router.post('/guardar', guardarResultado);
router.get('/ultimos', obtenerResultados); // opcional

export { router };