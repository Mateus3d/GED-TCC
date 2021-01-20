const mongoose = require('mongoose')

const HashSchema = new mongoose.Schema({
  hashs: [String], //as hashs geradas por aquele doc
  documento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Documento' //Referencia o Model
  }
})

module.exports = mongoose.model('Hash', HashSchema)