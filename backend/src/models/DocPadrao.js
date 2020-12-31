//Aqui tlvs vao os campos em forma de array
const mongoose = require('mongoose')
//Esse é o doc a ser preenchido pelo funcionario posteriormente em Documento
const DocPadraoSchema = new mongoose.Schema({
  identificador: String,
  titulo: String,
  descricao: String,
  area: String,
  /* data: {
      type: Date,
      default: Date.now()
}, */
  camposObj: {},
  funcionario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Funcionario' //Referencia o Model
  },

  adm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adm'
  },
  /* 
  documento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documento'
  } //Diz a qual documento pertence */
})

module.exports = mongoose.model('DocPadrao', DocPadraoSchema)
