const mongoose = require('mongoose')

const FuncionarioSchema = new mongoose.Schema({
    identificador: String,
    nome: String,
    area: String,
    username: String,
    senha: String,
    adm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Adm' //Referencia o Model
    }
})

module.exports = mongoose.model('Funcionario', FuncionarioSchema)