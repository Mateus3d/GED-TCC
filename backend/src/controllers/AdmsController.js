//index, show, store, update, destroy
const Adm = require('../models/Adm') //O model (tabela do BD)
const { destroy } = require('./FuncionariosController')

module.exports = {
  async index(req, res) {
    const adms = await Adm.find()

    return res.json(adms)
  },

	async store(req,res) {
		const {cnpj,username,senha} = req.body

		let adm = await Adm.findOne().or([{ cnpj },{username}]) //encontre alguem com cnpj = cnpj or username = username

		if(!adm) { //se ñ encontrar o adm entao cria
      adm = await Adm.create({cnpj,username,senha})
      .catch(e =>{
        return res.status(400).json({error: 'Algo deu errado ao cadastrar'})
      })
      return res.json(adm)
		}else {
      return res.status(400).json({error: 'Essa Conta já está cadastrada!'})
    }
		
  },

  async destroy(req,res) {
    const {id} = req.params
    await Adm.findByIdAndDelete(id)
    return res.json({message: 'ADM Deletado com sucesso'})
  } 


}