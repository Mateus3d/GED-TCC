const mongoose = require('mongoose')

const AdmSchema = new mongoose.Schema({
    cnpj: Number,
    username: String,
    senha: String
})

module.exports = mongoose.model('Adm', AdmSchema)