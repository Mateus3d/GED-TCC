const mongoose = require('mongoose')

const AuditoriaSchema = new mongoose.Schema({
    adm_id: mongoose.Schema.Types.ObjectId, //empresa q fez (so pra autenticar msm)
    identificador: {
      type: String,
      default: '9999' //Padrao q eu defini pra ADM
    }, //ID de quem fez 
    //nome: String, //quem fez
    descricao: String,
    data: {
			type: Date,
			default: Date.now
		}, 
    adm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Adm'
    },
})

module.exports = mongoose.model('Auditoria', AuditoriaSchema)