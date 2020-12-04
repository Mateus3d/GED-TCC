//index, show, store, update, destroy
const Adm = require('../models/Adm')
const DocPadrao = require('../models/DocPadrao')
const Documento = require('../models/Documento')
const Funcionario = require('../models/Funcionario')

//Campos compreende a criação de um formulário pelo ADM

module.exports = {
	async index(req,res) {
		const {id} = req.query
		let documentos
		if (id)
			documentos = await Documento.find({_id:id}).populate('docPadrao') //LISTAR 1 DOC
		else {
			documentos = await Documento.find().populate('docPadrao')
			.catch(e => {
				console.log(e)
				return res.status(400).json({error: 'Algo deu errado ao procurar'})
			})
		}
		return res.json(documentos)
	}, 

	async show(req,res) {
		const {id} = req.query
		//const documentos = await Documento.find({_id:id}).populate('campos') //LISTAR 1 DOC
		const documentos = await Documento.findById(id)
		.catch(e => {
			console.log(e)
			return res.status(400).json({error: 'Algo deu errado ao procurar'})
		})
		return res.json(documentos)
	}, 

	async store(req,res) {		
		const {adm_id, funcionario_id} = req.headers
		const {documento_id} = req.params
		const {camposObj} = req.body

		let adm = await Adm.findById(adm_id) 
		if (!adm) { 
			return res.status(400).json({error: 'Erro de autenticacao'})
		}
		let funcionario = await Funcionario.findById(funcionario_id) 
		if (!funcionario) { 
			return res.status(400).json({error: 'Funcionario não existe'})
		}
		let docPadrao = await DocPadrao.findById(documento_id) 
		if (!docPadrao) { 
			return res.status(400).json({error: 'Formulário referenciado não existe'})
		}
		
		const documentoNovo = await Documento.create({camposObj,adm: adm_id,funcionario: funcionario_id,docPadrao: documento_id})
		.catch(e => {
			console.log(e)
			return res.status(400).json({error: 'Erro ao criar documento'})
		})

		return res.json(documentoNovo)
	},
	async destroy(req,res) {
		const {documento_id} = req.params
		let documentos
		if (documento_id){ //DELETA 1
			documentos = await Documento.findByIdAndDelete(documento_id)
			.catch(e => res.status(400).json({error: 'Algo deu errado ao deletar'}))

			return res.json({message: 'Documento deletado!!!'})
		}/* 
		else { //DELETA TUDO
			documentos = await Documento.find()
			documentos.map(async item => {
				await Documento.findByIdAndDelete(item._id)
			})
			return res.json({message: 'TUDO deletado!!!'})
		} */
		
	},
	async update(req,res) {
		const {adm_id} = req.headers/* 
		const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		} */

		const {documento_id} = req.params
		const {camposObj} = req.body
		
		let documentos = await Documento.findById(documento_id)
		if(!documentos) {
			return res.status(400).json({error: 'Documento não encontrado para atualização'})
		}
		documentos = await Documento.findByIdAndUpdate({_id: documento_id},{camposObj},{new:true}).catch(err =>{ 
				if(err){
					console.log('deu ruim')
					res.status(400).json({error: 'Erro ao atualizar'})
				}
			})
		return res.json(documentos)
	}

}