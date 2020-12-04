//index, show, store, update, destroy
const Adm = require('../models/Adm') //O model (tabela do BD)
const Funcionario = require('../models/Funcionario')

module.exports = {
	async store(req,res) { //Verifica se a conta existe

		const {username,senha} = req.body

		let adm = await Adm.findOne({ username, senha})
		let funcionario = await Funcionario.findOne({ username, senha})

		if(adm) { //se ñ encontrar o adm entao cria
			console.log(adm)
			return res.json({id: adm._id, adm:true})
		} else if (funcionario) {
			console.log(funcionario)
			return res.json({id: funcionario._id})
		}
		else return res.status(400).json({error: 'Usuário não encontrado'})

		//return res.json(adm)
	}

}