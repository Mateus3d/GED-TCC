//index, show, store, update, destroy
const Adm = require('../models/Adm')
const DocPadrao = require('../models/DocPadrao')
const Documento = require('../models/Documento')
const Funcionario = require('../models/Funcionario')
const dateFormat = require('dateformat')

//Campos compreende a criação de um formulário pelo ADM

module.exports = {
  async index(req, res) { //Por questão de seguranca acho q vou ter q mudar aqui
    const { func_id } = req.headers
    let { adm_id } = req.headers
    const { identificador, titulo, descricao, data } = req.query
    let documentos, funcionario

    if (func_id) {
      funcionario = await Funcionario.findById(func_id)
        .catch(e => {
          return res.status(400).json({ error: 'Algo deu errado com o funcionário!' })
        })
      adm_id = funcionario.adm //Se ñ vier do adm diretamente, o funcionario preenche
      if (funcionario.length === 0)
        return res.status(400).json({error: 'Funcionário não encontrado!'})
    }

    documentos = await Documento.find({adm: adm_id}) //como adm está dentro de docPadrao preciso popular pra dps filtrar
      .populate('docPadrao') //Lista todos pq tenho q popular pra dps filtrar
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Algo deu errado ao procurar' })
      })
    //console.log(documentos)

    if (func_id) {
      if (funcionario !== null) { //GAMBIARRA!!
        documentos = documentos.filter(doc => {
          return doc.docPadrao.area === funcionario.area
        })
      }
    }


    if (identificador || titulo || descricao || data) { //para pesquisa
      documentos = documentos.filter(doc => {
        if (doc.docPadrao.titulo.toLowerCase().includes(titulo.toLowerCase()) &&
          doc.docPadrao.identificador.includes(identificador) &&
          doc.docPadrao.descricao.toLowerCase().includes(descricao.toLowerCase()) &&
          String(dateFormat(doc.data, 'dd/mm/yyyy')).includes(data)) {
          return doc
        }
      })
    }

    return res.json(documentos)
  },

  async show(req, res) {
    const { documento_id } = req.params
    documentos = await Documento.findById(documento_id).populate('docPadrao')//LISTAR 1 DOC
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Algo deu errado ao procurar!!' })
      })
    if (documentos.length === 0) {
      return res.status(400).json({ error: 'Documento não encontrado!!' })
    }
    else {
      return res.json(documentos)
    }
  },

  async store(req, res) {
    //const { func_id } = req.headers
    let { adm_id, func_id } = req.headers
    const { documento_id } = req.params
    const { camposObj } = req.body
    let documentoNovo

    if (documento_id) {
      let docPadrao = await DocPadrao.findById(documento_id)
        .catch(e => {
          console.error(e)
          return res.status(400)
        })
      if (docPadrao.length === 0) {
        return res.status(400).json({ error: 'Formulário referenciado não existe' })
      }
    }

    if (adm_id) { //Se vier pelo header, então QUEM ESTÁ CRIANDO é um ADM
      documentoNovo = await Documento.create({ camposObj, adm: adm_id, funcionario: adm_id, docPadrao: documento_id })
        .catch(e => {
          console.log(e)
          return res.status(400).json({ error: 'Erro ao criar documento' })
        })
      return res.json(documentoNovo)
    }
    else if (func_id) {
      let funcionario = await Funcionario.findById(func_id)
        .catch(e => {
          console.error(e)
          return res.status(400)
        })
      if (funcionario.length === 0) {
        return res.status(400).json({ error: 'Funcionario não existe' })
      }
      if (!adm_id) {
        adm_id = funcionario.adm
        //console.log(adm_id)
      }

      // PROBLEMA!! O ADM_ID É MEIO FODA DE FICAR MANDANDO TODA VEZ. TEM Q VER SE DEIXA OU TIRA..
      documentoNovo = await Documento.create({ camposObj, adm: adm_id, funcionario: func_id, docPadrao: documento_id })
        .catch(e => {
          console.log(e)
          return res.status(400).json({ error: 'Erro ao criar documento' })
        })

      return res.json(documentoNovo)
    } else {
      return res.status(400).json({error: 'Não recebi dados nem do funcionario ou adm'})
    }
  },

  async destroy(req, res) {
    const { documento_id } = req.params
    let documentos
    if (documento_id) { //DELETA 1
      documentos = await Documento.findByIdAndDelete(documento_id).populate('docPadrao')
        .catch(e => res.status(400).json({ error: 'Algo deu errado ao deletar' }))

      return res.json(documentos)
    }/* 
		else { //DELETA TUDO
			documentos = await Documento.find()
			documentos.map(async item => {
				await Documento.findByIdAndDelete(item._id)
			})
			return res.json({message: 'TUDO deletado!!!'})
		} */

  },
  async update(req, res) {
    const { adm_id } = req.headers/* 
		const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		} */

    const { documento_id } = req.params
    const { camposObj } = req.body
    console.log(documento_id)

    let documentos = await Documento.findById(documento_id)
      .catch(e => {
        //console.log(e)
        return res.status(400).json({ error: 'Documento nao encontrado!' }
        )
      })

    if (!documentos) {
      return res.status(400).json({ error: 'Documento não encontrado para atualização' })
    }
    documentos = await Documento.findByIdAndUpdate({ _id: documento_id }, { camposObj }, { new: true })
      .populate('docPadrao')
      .catch(err => {
        if (err) {
          console.log('deu ruim', err)
          return res.status(400).json({ error: 'Erro ao atualizar' })
        }
      })

    return res.json(documentos)

  }

}