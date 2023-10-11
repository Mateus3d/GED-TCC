const PDFKit = require('pdfkit');
const fs = require('fs');
const Adm = require('../models/Adm');

module.exports = {
  async store(req, res) {
    const { labels, inputs, titulo } = req.body
    // const { adm_id } = req.headers

    console.log(labels)
    console.log(inputs)

    const pdf = new PDFKit();
    //Titulo
    pdf.font('Times-Bold')
    pdf.fontSize(28)
    pdf.text(titulo, {
      align: 'center',
    })

    pdf.moveDown(1)
    //Corpo
    labels.map((label, i) => {
      pdf.fontSize(12)
      pdf.font('Times-Bold').text(label + ':', { continued: true })
      pdf.font('Times-Roman').text('  ' + inputs[i] + '.')
      pdf.moveDown(1)
    })
    res.setHeader('Content-disposition', 'attachment; filename="' + encodeURIComponent(titulo) + '.pdf' + '"')
    res.setHeader('Content-type', 'application/pdf')

    //pdf.pipe(fs.createWriteStream('../testePDF.pdf'));
    pdf.pipe(res)
    pdf.end();

    //return res.json({msg: 'opa'})


    /* let adm = await Adm.findOne().or([{ cnpj },{username}]) //encontre alguem com cnpj = cnpj or username = username

    if(!adm) { //se ñ encontrar o adm entao cria
      adm = await Adm.create({cnpj,username,senha})
      .catch(e =>{
        return res.status(400).json({error: 'Algo deu errado ao cadastrar'})
      })
      return res.json(adm)
    }else {
      return res.status(400).json({error: 'Essa Conta já está cadastrada!'})
    } */

  },


}