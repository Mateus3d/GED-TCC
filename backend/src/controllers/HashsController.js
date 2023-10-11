//index, show, store, update, destroy
const Hash = require('../models/Hash') //O model (tabela do BD)
const crypto = require('crypto')
const fs = require('fs')
const { show } = require('./DocPadraoController')

module.exports = {
  async index(req, res) {
    const hashs = await Hash.find()
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Algo deu errado ao buscar os hashs' })
      })

    return res.json(hashs)
  },

  async show(req, res) { //Mando o arquivo e espero o retorno positivo (consta no BD) ou negativo (Ñ consta)
    const arquivo = req.file
    //console.log(arquivo)
    //Tenho q pegar o arquivo e fzr o hash dele!!!!!!!!!!
    let teste = fs.readFileSync(arquivo.path, 'base64')
    let sum = crypto.createHash('sha256');
    sum.update(teste);
    const hex = sum.digest('hex');
    //console.log('Hash:', hex);

    const hash = await Hash.findOne({ hashs: hex })
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Algo deu errado!!!!' })
      })
    //console.log(hash)

    if (hash) { //Bateu, existe!!
      return res.json({ validado: true })
    } else {
      return res.json({ validado: false })
    }
    //return res.json({msg: 'oi'})
  },

  async storeRaw(req, res) {
    const hash = req.params.h
    const {documento} = req.headers
    const novoHash = await Hash.create({ hashs: hash, documento })
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Algum erro ocorreu ao enviar o hash' })
      })
    return res.json(novoHash)
  },

  async store(req, res) { //Qnd mando um arquivo para cá ele deve gerar o hash e armazenar
    const arquivos = req.files
    const { documento } = req.body //id do documento q tem os arquivos
    let hashs
    if (arquivos) {
      hashs = arquivos.map(arq => {
        let teste = fs.readFileSync(arq.path, 'base64')
        let sum = crypto.createHash('sha256');
        sum.update(teste);
        const hex = sum.digest('hex');
        return hex
      })
    } else {
      return res.status(400).json({ error: 'Não detectei os arquivos!' })
    }

    if (hashs) {
      const novosHashs = await Hash.create({ hashs, documento })
        .catch(e => {
          console.error(e)
          return res.status(400).json({ error: 'Algum erro ocorreu ao enviar o hash' })
        })
      return res.json(novosHashs)
    }
    else if (hashs.length === 0 || !hashs) {
      return res.status(400).json({ error: 'Erro ao gerar os hashs' })
    } else {
      return res.status(400).json({ error: 'Algo deu errado com os hashs' })
    }
  },

  async destroy(req, res) { //Deleta 1!!!!!!!!
    const { documento_id } = req.params

    const hashDeletado = await Hash.findOneAndDelete({ documento: documento_id })
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Deu pau no hash pra deletar' })
      })

    if (hashDeletado) { //Se não for null é pq deletou
      return res.json(hashDeletado)
    } else {//Se é null é pq não encontrou
      return res.json({ message: 'Não encontrei pra deletar...' })
    }
  },

   async destroyAll(req, res) { //Deleta tudo!!!!!!!!!!!!!!!
    const hashs = await Hash.find()

    hashs.map(async hash => {
      await Hash.findByIdAndDelete(hash._id)
        .catch(e => {
          console.error(e)
          return res.status(400).json({ error: 'Deu pau' })
        })
    })

    return res.json({ message: 'Deletado tudo com sucesso' })
  } 

}