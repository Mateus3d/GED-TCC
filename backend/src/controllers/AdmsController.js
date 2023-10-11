//index, show, store, update, destroy
const Adm = require('../models/Adm') //O model (tabela do BD)
const bcrypt = require('bcrypt')

module.exports = {
  async index(req, res) {
    const adms = await Adm.find()

    return res.json(adms)
  },

	async store(req,res) {
		const {cnpj,username,senha} = req.body //Atribui os dados recebidos do corpo da requisição
    var numbers = /^[0-9]+$/; //regex pra verificar se é numero
    if(!cnpj.match(numbers))
      return res.status(400).json({error: 'CNPJ só aceita números!'})

		let adm = await Adm.findOne().or([{ cnpj },{username}]) 
    //procura alguma conta que já contenha os mesmos dados

		if(!adm) { //se não encontrar um adm com esses dados, então permite a criação

      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(senha, salt)

      adm = await Adm.create({cnpj,username,senha: passwordHash})
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
    const adm = await Adm.findByIdAndDelete(id)
    .catch(e => {
      return res.status(400).json({error: 'Algo deu errado!'})
    })
    if (adm) {
      return res.json({message: 'ADM Deletado com sucesso'})
    } else {
      return res.status(400).json({message: 'ADM não foi localizado!'})
    }
  } 


}