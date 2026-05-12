const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const gerarPDFDespacho = (dadosMesa, despachoTexto) => {
  return new Promise((resolve, reject) => {
    try {
      // Criar pasta de outputs se não existir
      const pastaOutputs = path.join(__dirname, '../../outputs');
      if (!fs.existsSync(pastaOutputs)) {
        fs.mkdirSync(pastaOutputs, { recursive: true });
      }

      // Nome do ficheiro
      const nomeFicheiro = `despacho_mesa_${dadosMesa.id}_${Date.now()}.pdf`;
      const caminhoFicheiro = path.join(pastaOutputs, nomeFicheiro);

      // Criar o documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 80, bottom: 80, left: 80, right: 80 }
      });

      // Guardar o PDF num ficheiro
      const stream = fs.createWriteStream(caminhoFicheiro);
      doc.pipe(stream);

      // ── CABEÇALHO ──
      doc.fontSize(14)
         .font('Helvetica-Bold')
         .text('UNIVERSIDADE KIMPA VITA', { align: 'center' });

      doc.fontSize(11)
         .font('Helvetica')
         .text('Sistema de Gestão de Bancas de Defesa — JURAI', { align: 'center' });

      doc.moveDown(0.5);

      // Linha separadora
      doc.moveTo(80, doc.y)
         .lineTo(515, doc.y)
         .stroke();

      doc.moveDown(1);

      // ── TÍTULO ──
      doc.fontSize(13)
         .font('Helvetica-Bold')
         .text('DESPACHO DE CONSTITUIÇÃO DE MESA DE JÚRI', { align: 'center' });

      doc.moveDown(1.5);

      // ── DADOS DO ESTUDANTE ──
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('DADOS DA DEFESA');

      doc.moveDown(0.5);

      doc.fontSize(10).font('Helvetica');

      const dados = [
        ['Estudante:', dadosMesa.nome_estudante],
        ['Tema:', dadosMesa.tema],
        ['Curso:', dadosMesa.curso],
        ['Ano:', dadosMesa.ano],
        ['Data da Defesa:', new Date(dadosMesa.data_defesa).toLocaleDateString('pt-PT')],
        ['Hora:', dadosMesa.hora_defesa || 'A definir'],
        ['Local:', dadosMesa.local_defesa || 'A definir'],
      ];

      dados.forEach(([label, valor]) => {
        doc.font('Helvetica-Bold').text(label, { continued: true })
           .font('Helvetica').text(' ' + valor);
      });

      doc.moveDown(1);

      // Linha separadora
      doc.moveTo(80, doc.y)
         .lineTo(515, doc.y)
         .stroke();

      doc.moveDown(1);

      // ── COMPOSIÇÃO DA MESA ──
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('COMPOSIÇÃO DA MESA DE JÚRI');

      doc.moveDown(0.5);

      const membros = [
        ['Presidente:', dadosMesa.presidente],
        ['1.º Vogal:', dadosMesa.primeiro_vogal],
        ['2.º Vogal (Tutor):', dadosMesa.segundo_vogal_tutor],
        ['Suplente:', dadosMesa.suplente],
        ['Secretário:', dadosMesa.secretario],
      ];

      membros.forEach(([cargo, nome]) => {
        doc.fontSize(10)
           .font('Helvetica-Bold').text(cargo, { continued: true })
           .font('Helvetica').text(' ' + nome);
      });

      doc.moveDown(1);

      // Linha separadora
      doc.moveTo(80, doc.y)
         .lineTo(515, doc.y)
         .stroke();

      doc.moveDown(1);

      // ── TEXTO DO DESPACHO ──
      doc.fontSize(11)
         .font('Helvetica-Bold')
         .text('DESPACHO OFICIAL');

      doc.moveDown(0.5);

      doc.fontSize(10)
         .font('Helvetica')
         .text(despachoTexto, { align: 'justify', lineGap: 4 });

      doc.moveDown(2);

      // ── ASSINATURAS ──
      doc.moveTo(80, doc.y)
         .lineTo(515, doc.y)
         .stroke();

      doc.moveDown(1);

      const dataActual = new Date().toLocaleDateString('pt-PT', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      doc.fontSize(10)
         .font('Helvetica')
         .text(`Luanda, ${dataActual}`, { align: 'right' });

      doc.moveDown(2);

      doc.text('_________________________________', { align: 'center' });
      doc.text('O Reitor da Universidade Kimpa Vita', { align: 'center' });

      doc.moveDown(0.5);
      doc.fontSize(9)
         .font('Helvetica')
         .text('Documento gerado pelo Sistema JURAI', { align: 'center', color: 'grey' });

      // Finalizar o documento
      doc.end();

      stream.on('finish', () => {
        resolve({ sucesso: true, caminho: caminhoFicheiro, nome: nomeFicheiro });
      });

      stream.on('error', (erro) => {
        reject({ sucesso: false, erro: erro.message });
      });

    } catch (erro) {
      reject({ sucesso: false, erro: erro.message });
    }
  });
};

module.exports = { gerarPDFDespacho };