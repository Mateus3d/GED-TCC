//index, show, store, update, destroy
const Adm = require('../models/Adm')
const DocPadrao = require('../models/DocPadrao')
const Documento = require('../models/Documento')
const Funcionario = require('../models/Funcionario')
const dateFormat = require('dateformat')

//Campos compreende a criação de um formulário pelo ADM
async function geraidentificadorDoc(documento_id, adm_id, docPadrao) {
  let documentos
  documentos = await Documento.find({ adm: adm_id }).populate('docPadrao') //Tem ainda q buscar o adm_id se for func
    .catch(e => {
      console.error(e)
      return res.json({ error: 'Problema ao buscar documentos' })
    })
  if (documentos) {
    documentos = documentos.filter(doc => {
      return doc.docPadrao._id == documento_id
    }) 
  }
  //Para deixar no formato 0012 e.g.
  var str = "" + (documentos.length+1)
  var pad = "0000"
  var numeracao = pad.substring(0, pad.length - str.length) + str
  const identificador_doc = docPadrao.identificador + '-' + numeracao
  return identificador_doc
  //console.log(identificador_doc)
}

module.exports = {
  async index(req, res) { //Por questão de seguranca acho q vou ter q mudar aqui
    const { func_id } = req.headers
    let { adm_id } = req.headers
    const { identificador_doc, titulo, descricao, data } = req.query
    let documentos, funcionario

    if (func_id) {
      funcionario = await Funcionario.findById(func_id)
        .catch(e => {
          return res.status(400).json({ error: 'Algo deu errado com o funcionário!' })
        })
      adm_id = funcionario.adm //Se ñ vier do adm diretamente, o funcionario preenche
      if (funcionario.length === 0)
        return res.status(400).json({ error: 'Funcionário não encontrado!' })
    }

    documentos = await Documento.find({ adm: adm_id }) //como adm está dentro de docPadrao preciso popular pra dps filtrar
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

    if (identificador_doc || titulo || descricao || data) { //para pesquisa
      console.log(identificador_doc)      
      documentos = documentos.filter(doc => {
        if (doc.docPadrao.titulo.toLowerCase().includes(titulo.toLowerCase()) &&
          doc.identificador_doc.toLowerCase().includes(identificador_doc) &&
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
    const { documento_id } = req.params //id do DocPadrao
    const camposObj = req.body //Agr estou transformando oq vem como multipart no camposObj
    let identificador_doc //FR01-0023 e.g.
    let docPadrao
    //let documentos //pesquiso quantos documentos já foram preenchidos pra colocar no identificador do documento
    var filenames = req.files.map(file => {
      return file.filename;
    })
    let documentoNovo
    console.log(req.body)
    console.log(req.files)

    if (documento_id) {
      docPadrao = await DocPadrao.findById(documento_id)
        .catch(e => {
          console.error(e)
          return res.status(400)
        })
      if (docPadrao)
        if (docPadrao.length === 0)
          return res.status(400).json({ error: 'Formulário referenciado não existe' })
    }

    if (adm_id) { //Se vier pelo header, então QUEM ESTÁ CRIANDO é um ADM
      identificador_doc = await geraidentificadorDoc(documento_id, adm_id, docPadrao)
      documentoNovo = await Documento
        .create({
          identificador_doc,camposObj, adm: adm_id, funcionario: adm_id, docPadrao: documento_id,
          arquivos: filenames
        })
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
      //Mandando como funcionário
      identificador_doc = await geraidentificadorDoc(documento_id, adm_id, docPadrao)
      documentoNovo = await Documento
        .create({ identificador_doc, camposObj, adm: adm_id, funcionario: func_id, 
          docPadrao: documento_id, arquivos: filenames })
        .catch(e => {
          console.log(e)
          return res.status(400).json({ error: 'Erro ao criar documento' })
        })

      return res.json(documentoNovo)
    } else {
      return res.status(400).json({ error: 'Não recebi dados nem do funcionario ou adm' })
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
    const { adm_id } = req.headers
    const adm = await Adm.findById(adm_id)
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Houve algum erro com o adm' })
      })
    if (!adm) {
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }

    const { documento_id } = req.params
    const camposObj = req.body
    if (req.files) {
      var filenames = req.files.map(file => {
        return file.filename;
      })
    }
    //console.log(camposObj) 
    //console.log(req.files)

    let documentos = await Documento.findById(documento_id)
      .catch(e => {
        //console.log(e)
        return res.status(400).json({ error: 'Documento nao encontrado!' }
        )
      })

    if (!documentos) {
      return res.status(400).json({ error: 'Documento não encontrado para atualização' })
    }
    documentos = await Documento
      .findByIdAndUpdate({ _id: documento_id }, { camposObj, arquivos: filenames }, { new: true })
      .populate('docPadrao')
      .catch(err => {
        if (err) {
          console.log('deu ruim', err)
          return res.status(400).json({ error: 'Erro ao atualizar' })
        }
      })

    return res.json(documentos)
    //return res.json({msg: 'oi'})
  }

}