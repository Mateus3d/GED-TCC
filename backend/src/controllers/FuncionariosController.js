//index, show, store, update, destroy
const Adm = require('../models/Adm')
const Funcionario = require('../models/Funcionario')

module.exports = {
	async index(req,res) { //Lista tudo e/ou pesquisa
		const funcionarios = await Funcionario.find(req.query)//.populate('adm') se quiser popular com os dados da empresa (adm)
		return res.json(funcionarios)
	},

	async store(req,res) {		
		const {adm_id} = req.headers
		const {identificador, nome, area, username, senha} = req.body

		let adm = await Adm.findById(adm_id) //Vê se tem algum adm com esse id recebido do header
		if (!adm) { //Se ñ existir esse adm então retorna erro
			return res.status(400).json({error: 'Erro de autenticacao'})
		}

		let funcionario = await Funcionario.findOne({ username } || {identificador}) //verifica se o funcionario já existe

		if(!funcionario) { //se ñ encontrar o funcionario entao cria
			funcionario = await Funcionario.create({
				adm: adm_id,
				identificador,
				nome,
				area,
				username,
				senha
			})
		}

		return res.json(funcionario)
	},

	async update(req,res) {
		const {adm_id} = req.headers
		const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		}

		const {idFuncionario} = req.params
		const {identificador, nome, area, username, senha} = req.body
		
		let funcionarioAtualizado = await Funcionario.findById(idFuncionario)
		if(!funcionarioAtualizado) {
			return res.status(400).json({error: 'Funcionario não encontrado para atualização'})
		}
		funcionario = await Funcionario.findByIdAndUpdate({_id: idFuncionario},{identificador, nome, area, username, senha},{new:true})
		.catch(err =>{ 
				if(err){
					console.log('deu ruim')
					res.status(400).json({error: 'Erro ao atualizar'})
				}
			})
		return res.json(funcionario)
	},

	async destroy(req,res) {
		const {adm_id} = req.headers
		const adm = await Funcionario.findOne({adm: adm_id})
		if (!adm) {
			return res.status(400).json({error: 'Erro de autenticacao'})
		}

		const {idFuncionario} = req.params
		let funcionarioDeletado = await Funcionario.findById(idFuncionario)
		if(funcionarioDeletado) {
			await Funcionario.findByIdAndDelete(idFuncionario)
			return res.json({message: `Funcionario ${funcionarioDeletado.nome} removido com sucesso`})
		}
		else {
			return res.status(400).json({error: 'Funcionario nao encontrado!'})
		}
	}

}