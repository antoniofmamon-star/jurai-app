const Groq = require('groq-sdk');
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Sugerir membros para a mesa de júri
const sugerirJuri = async (tema, curso, docentes) => {
  try {
    const listaDocentes = docentes.map((d, i) =>
      `${i + 1}. Nome: ${d.nome} | Área: ${d.especialidade || 'Docente universitário'}`
    ).join('\n');

    const resposta = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'És um assistente académico especializado em composição de mesas de júri universitárias. Respondes sempre em português e apenas em formato JSON válido sem markdown.'
        },
        {
          role: 'user',
          content: `
O estudante vai defender o seguinte trabalho:
- Tema: ${tema}
- Curso: ${curso}

Lista de docentes disponíveis:
${listaDocentes}

Com base no tema e nas especialidades dos docentes, sugere:
1. O PRESIDENTE da mesa
2. O 1.º VOGAL
3. O SUPLENTE (pode substituir o Presidente ou o 1.º Vogal)

Responde APENAS em JSON sem markdown:
{
  "presidente": "Nome completo do docente",
  "primeiro_vogal": "Nome completo do docente",
  "suplente": "Nome completo do docente",
  "justificacao": "Explicação clara e académica de cada escolha em português"
}
          `
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const texto = resposta.choices[0].message.content;
    const textoLimpo = texto.replace(/```json/g, '').replace(/```/g, '').trim();
    const sugestao = JSON.parse(textoLimpo);

    return { sucesso: true, sugestao };

  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao gerar sugestão de júri.',
      erro: erro.message
    };
  }
};

// Chat com o agente IA
const chat = async (mensagem, contexto = '') => {
  try {
    const resposta = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `És o assistente do Sistema JURAI da Universidade Kimpa Vita. Ajudas administradores, docentes e estudantes com questões sobre gestão de bancas de defesa. Respondes sempre em português de Angola, de forma clara e profissional. ${contexto ? 'Contexto: ' + contexto : ''}`
        },
        {
          role: 'user',
          content: mensagem
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const texto = resposta.choices[0].message.content;
    return { sucesso: true, resposta: texto };

  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao processar a mensagem.',
      erro: erro.message
    };
  }
};

// Gerar texto do despacho
const gerarDespacho = async (dadosMesa) => {
  try {
    const resposta = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'És um assistente académico da Universidade Kimpa Vita. Rediges documentos formais académicos em português.'
        },
        {
          role: 'user',
          content: `
Redige o texto formal de um despacho de constituição de mesa de júri para defesa de trabalho de fim de curso.

Dados da mesa:
- Estudante: ${dadosMesa.nome_estudante}
- Tema: ${dadosMesa.tema}
- Curso: ${dadosMesa.curso}
- Ano: ${dadosMesa.ano}
- Data da defesa: ${dadosMesa.data_defesa}
- Hora: ${dadosMesa.hora_defesa}
- Local: ${dadosMesa.local_defesa}
- Presidente: ${dadosMesa.presidente}
- 1.º Vogal: ${dadosMesa.primeiro_vogal}
- 2.º Vogal (Tutor): ${dadosMesa.segundo_vogal_tutor}
- Suplente: ${dadosMesa.suplente}
- Secretário: ${dadosMesa.secretario}

Redige um despacho formal, respeitoso e académico em português, adequado para a Universidade Kimpa Vita em Angola.
          `
        }
      ],
      temperature: 0.5,
      max_tokens: 2000
    });

    const texto = resposta.choices[0].message.content;
    return { sucesso: true, despacho: texto };

  } catch (erro) {
    return {
      sucesso: false,
      mensagem: 'Erro ao gerar despacho.',
      erro: erro.message
    };
  }
};

module.exports = { sugerirJuri, chat, gerarDespacho };