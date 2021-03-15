//index, show, store, update, destroy
const Adm = require('../models/Adm') //O model (tabela do BD)

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