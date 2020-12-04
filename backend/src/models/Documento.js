const mongoose = require('mongoose')
//Esse é o doc preenchido
const DocumentoSchema = new mongoose.Schema({
   /*  identificador: String,
    titulo: String,
    descricao: String,*/
    camposObj: {},
		data: {
			type: Date,
			default: Date.now
		},  

    adm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Adm' //Referencia o Model
    },
    funcionario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Funcionario' //Referencia o Model
		},
		docPadrao: {
			type: mongoose.Schema.Types.ObjectId,
      ref: 'DocPadrao'
		}
})

module.exports = mongoose.model('Documento', DocumentoSchema)