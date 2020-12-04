//index, show, store, update, destroy
const Adm = require('../models/Adm')
const DocPadrao = require('../models/DocPadrao')
//const Documento = require('../models/Documento')
const Funcionario = require('../models/Funcionario')

//Campos compreende a criação de um formulário pelo ADM

module.exports = {
	async index(req,res) { //Lista tudo e/ou pesquisa
		const docPadrao = await DocPadrao.find(req.query)//.populate('adm') se quiser popular com os dados da empresa (adm)
    
    if (docPadrao.length == 0 ){
      console.log('teste')
      return res.status(400).json({error: 'Documento não encontrado!'})
    }
    else {
      //console.log(docPadrao)
      return res.json(docPadrao)
    }
	},

	async store(req,res) {		
		const {adm_id} = req.headers
		const {identificador, titulo, descricao, camposObj} = req.body

		let adm = await Adm.findById(adm_id) //Vê se tem algum adm com esse id recebido do header
		if (!adm) { //Se ñ existir esse adm então retorna erro
			return res.status(400).json({error: 'Erro de autenticacao'})
		}

		let docPadrao = await DocPadrao.findOne({identificador}) //verifica se o documento já existe

		if(!docPadrao) { //se ñ encontrar o documento entao cria os campos
			docPadrao = await DocPadrao.create({identificador, titulo, descricao, camposObj,adm: adm_id})
			.catch(e => res.status(400).json({error: 'Erro ao adicionar documento'}))
				
				return res.json(docPadrao)
		}else {
			//ISSSO PRO CASO DO IDENTIFICADOR SER ÚNICO!!!!!!!!!!!!!!!!!
			return res.status(400).json({error: 'O Identificador desse documento já existe'})
		}
	},

	async update(req,res) {
		const {adm_id} = req.headers
		/* const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		} */

		const {idFuncionario} = req.params
		const {identificador, nome, area, username, senha} = req.body
		
		const funcionarioAtualizado = await Funcionario.findById(idFuncionario)
		if(!funcionarioAtualizado) {
			return res.status(400).json({error: 'Funcionario não encontrado para atualização'})
		}
		await Funcionario.findByIdAndUpdate({_id: idFuncionario,
			identificador, nome, area, username, senha}, err =>{ 
				if(err){
					console.log('deu ruim')
					res.status(400).json({error: 'Erro ao atualizar'})
				}
			})
		return res.json({message: `Funcionario ${funcionarioAtualizado.nome} Atualizado`})
	},

	async destroy(req,res) {/* 
		const {adm_id} = req.headers
		const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		} */
		/* const docsPadrao = await DocPadrao.find()
		docsPadrao.map(async item => {
			await DocPadrao.findByIdAndDelete(item._id)
		}) */
    
    const docPadrao = await DocPadrao.findByIdAndDelete(req.params)

		return res.json({message: 'Deletado'})
		//const {idFuncionario} = req.params
		//let funcionarioDeletado = await Funcionario.findById(idFuncionario)
		/* if(funcionarioDeletado) {
			await Funcionario.findByIdAndDelete(idFuncionario)
			return res.json({message: `Funcionario ${funcionarioDeletado.nome} removido com sucesso`})
		}
		else {
			return res.status(400).json({error: 'Funcionario nao encontrado!'})
		} */
	} 

}