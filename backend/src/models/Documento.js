const mongoose = require('mongoose')
//Esse é o doc preenchido
const DocumentoSchema = new mongoose.Schema({
   /*  identificador: String,
    titulo: String,
    descricao: String,*/
    camposObj: {},
    arquivos: [],
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
}, {
  toJSON: {
    virtuals: true
  }
})

DocumentoSchema.virtual('arquivos_url').get(function() {
  let arquivosURLArray = []
  if (this.arquivos) {
    this.arquivos.map(arq => {
      return arquivosURLArray.push(`http://localhost:3333/files/${arq}`)
    })  
  }  
  return arquivosURLArray
})

module.exports = mongoose.model('Documento', DocumentoSchema)