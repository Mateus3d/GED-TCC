//index, show, store, update, destroy
const Adm = require('../models/Adm')
const DocPadrao = require('../models/DocPadrao')
//const Documento = require('../models/Documento')
const Funcionario = require('../models/Funcionario')
const { update, show } = require('./DocumentosController')

//Campos compreende a criação de um formulário pelo ADM

module.exports = {
  async index(req, res) { //Lista tudo e/ou pesquisa
    const { func_id, adm_id } = req.headers
    let docPadrao
    let funcionario = null

    if (func_id) {
      funcionario = await Funcionario.findById(func_id)
        .catch(e => {
          console.error(e)
          return res.status(400).json({ error: 'Algo deu errado com relação ao funcionário!' })
        })
    }

    if (funcionario !== null) {
      docPadrao = await DocPadrao.find({ area: funcionario.area, adm: funcionario.adm })//.populate('adm') se quiser popular com os dados da empresa (adm)
        .catch(e => {
          console.error(e)
          return res.status(400).json({ error: 'Algo deu errado ao buscar os documentos!' })
        })
    } /* else {
      return res.status(400).json({ error: 'Funcionário não encontrado' })
    } */

    if (adm_id && !func_id) {
      docPadrao = await DocPadrao.find({ adm:adm_id })//.populate('adm') se quiser popular com os dados da empresa (adm)
        .catch(e => {
          console.error(e)
          return res.status(400).json({ error: 'Algo deu errado ao buscar os documentos!' })
        })
    }
    //console.log(funcionario)
    if (docPadrao) {
      if (docPadrao.length == 0) {
        console.log('Vazio')
        //return res.json({ error: 'Documento não encontrado!' })
        return res.json(docPadrao)
      }
      else {
        //console.log(docPadrao)
        return res.json(docPadrao)
      }
    } else {
      return res.status(400).json({error: 'Houve algum erro'})
    }
    
  },

  async show(req, res) {
    const { docPadrao_id } = req.params
    let docPadrao = await DocPadrao.findById(docPadrao_id)
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Formulário não encontrado!' })
      })
    return res.json(docPadrao)

  },

  async store(req, res) {
    const { adm_id } = req.headers
    const { identificador, titulo, descricao, area, camposObj } = req.body

    let adm = await Adm.findById(adm_id) //Vê se tem algum adm com esse id recebido do header
    if (!adm) { //Se ñ existir esse adm então retorna erro
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }

    let docPadrao = await DocPadrao.findOne({ identificador, adm: adm_id }) //verifica se o documento já existe

    if (!docPadrao) { //se ñ encontrar o documento entao cria os campos
      docPadrao = await DocPadrao.create({ identificador, titulo, descricao, area, camposObj, adm: adm_id })
        .catch(e => res.status(400).json({ error: 'Erro ao adicionar documento' }))

      return res.json(docPadrao)
    } else {
      //ISSSO PRO CASO DO IDENTIFICADOR SER ÚNICO!!!!!!!!!!!!!!!!!
      return res.status(400).json({ error: 'O Identificador desse documento já existe' })
    }
  },

  async update(req, res) {
    const { _id } = req.params
    const { adm_id } = req.headers
    const { identificador, titulo, descricao, area, camposObj } = req.body

    let adm = await Adm.findById(adm_id)
      .catch(e => res.status(400).json({ error: 'Algum erro aconteceu' })) //Vê se tem algum adm com esse id recebido do header
    if (!adm) { //Se ñ existir esse adm então retorna erro
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }
    //vou colocar só area por enquanto
    //let docPadrao = await DocPadrao.findByIdAndUpdate(_id, { area }, { new: true }) //Pra atualizar a area
    let docPadrao = await DocPadrao.findByIdAndUpdate(_id, { camposObj }, { new: true }) //Pra atualizar o camposObj
      .catch(err => {
        console.log('deu ruim')
        res.status(400).json({ error: 'Erro ao atualizar' })
      })

    return res.json(docPadrao)
  },

  async destroy(req, res) {

    const docPadrao = await DocPadrao.findByIdAndDelete(req.params)
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Algo deu errado ao deletar!' })
      })

    return res.json({ message: 'Deletado' })
  }

}