const mongoose = require('mongoose')

const AdmSchema = new mongoose.Schema({
    cnpj: String, 
    username: String,
    senha: String
})

module.exports = mongoose.model('Adm', AdmSchema)