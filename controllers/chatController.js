import OpenAI from 'openai';
import Conversation from '../models/Conversation.js';
import dotenv from 'dotenv';

dotenv.config();

// Configurar OpenAI
let openai;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('La variable de entorno OPENAI_API_KEY no está definida');
  }

  openai = new OpenAI({ apiKey });
  console.log('✅ OpenAI configurado correctamente');
} catch (error) {
  console.error('Error al inicializar OpenAI:', error);
}

// Función 1: Chat general (respuestas del asistente)
export const generateChatResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es requerido' });
    }

    if (!openai) {
      return res.status(500).json({
        error: 'No se ha configurado correctamente la API de OpenAI',
        message: 'Error interno del servidor al configurar OpenAI'
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un asistente amigable y útil. Tus respuestas deben ser concisas (máximo 100 palabras), claras e incluir emojis relevantes. Usa párrafos cortos para mejor legibilidad."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    const conversation = new Conversation({
      prompt,
      response,
    });

    await conversation.save();

    res.json({ response });
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    res.status(500).json({
      error: 'Error al procesar la solicitud',
      details: error.message
    });
  }
};

// Función 2: Obtener historial
export const getConversationHistory = async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ createdAt: -1 }).limit(10);
    res.json(conversations);
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    res.status(500).json({ error: 'Error al obtener el historial de conversaciones' });
  }
};

// Función 3: Generar preguntas tipo quiz
export const generateQuestions = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'El tema es requerido' });
    }

    if (!openai) {
      return res.status(500).json({
        error: 'No se ha configurado correctamente la API de OpenAI',
        message: 'Error interno del servidor al configurar OpenAI'
      });
    }

    const prompt = `
      Eres un experto en el tema de "${topic}". 
      Genera 5 preguntas de opción múltiple sobre este tema, con 4 respuestas posibles para cada una. 
      Las respuestas incorrectas deben ser plausibles y difíciles de distinguir. 
      Formatea las preguntas de esta manera:

      Pregunta 1:
      [Pregunta aquí]
      a) [Opción A]
      b) [Opción B]
      c) [Opción C]
      d) [Opción D]
      Respuesta correcta: [Respuesta correcta]

      Repite esto para las siguientes 4 preguntas.
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Eres un asistente experto en generar preguntas de examen." },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    res.json({ quizText: response }); // Devuelve el texto sin procesar por ahora
  } catch (error) {
    console.error('Error al generar preguntas:', error);
    res.status(500).json({ error: 'Error al generar preguntas', details: error.message });
  }
};