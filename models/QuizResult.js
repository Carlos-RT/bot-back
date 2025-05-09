import mongoose from 'mongoose';

const quizResultSchema = new mongoose.Schema({
  tema: {
    type: String,
    required: true,
  },
  porcentaje: {
    type: Number,
    required: true,
  },
  correctas: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  detalle: [
    {
      pregunta: String,
      correcta: String,
      seleccionada: String,
      esCorrecta: Boolean,
    }
  ],
  creadoEn: {
    type: Date,
    default: Date.now,
  }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

export default QuizResult;