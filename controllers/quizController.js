import QuizResult from '../models/QuizResult.js';

// Guardar resultado de quiz
export const guardarResultado = async (req, res) => {
  try {
    const { tema, porcentaje, correctas, total, detalle } = req.body;

    if (!tema || porcentaje == null || correctas == null || !Array.isArray(detalle)) {
      return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }

    const resultado = new QuizResult({ tema, porcentaje, correctas, total, detalle });
    await resultado.save();

    res.status(201).json({ message: 'Resultado guardado con éxito' });
  } catch (error) {
    console.error('Error al guardar resultado:', error);
    res.status(500).json({ error: 'Error del servidor al guardar resultado' });
  }
};

// Obtener los últimos resultados (opcional)
export const obtenerResultados = async (req, res) => {
  try {
    const resultados = await QuizResult.find().sort({ creadoEn: -1 }).limit(10);
    res.json(resultados);
  } catch (error) {
    console.error('Error al obtener resultados:', error);
    res.status(500).json({ error: 'Error del servidor al obtener resultados' });
  }
};