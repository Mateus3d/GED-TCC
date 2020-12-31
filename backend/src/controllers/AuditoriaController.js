//index, show, store, update, destroy
const Auditoria = require('../models/Auditoria') //O model (tabela do BD)
const dateFormat = require('dateformat')

module.exports = {
  async index(req, res) {
    const {adm_id} = req.headers  //colocar dps pra pegar da empresa certa
    const {identificador,descricao,data} = req.query
    let audit

    audit = await Auditoria.find({adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Erro ao listar auditoria'})
      })
      

    if (identificador || descricao || data) { //para pesquisa
      audit = audit.filter(au => {
        if (String(au.identificador).includes(identificador) &&
          au.descricao.toLowerCase().includes(descricao.toLowerCase()) &&
          String(dateFormat(au.data, 'dd/mm/yyyy')).includes(data)) {
          return au
        }
      })
    }     

    return res.json(audit)
  }, 

	async store(req,res) {
    const {identificador,descricao} = req.body
    const {adm_id} = req.headers //dps verifica
    
    let audit = await Auditoria.create({identificador,descricao,adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Algo deu errado ao cadastrar a auditoria!'})
      })
    return res.json(audit)

		
  },

  async destroy(req,res) {
    const {adm_id} = req.headers
    const {auditoria_id} = req.params

    let auditorias = await Auditoria.find({adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Erro de autenticação!!'})
      })
    

    auditorias.map(async (a) => {
       await Auditoria.findByIdAndDelete(a._id)
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Aconteceu algum erro!!'})
      })

    })
   
    return res.json({message: 'Auditoria Deletada com sucesso'})
  } 


}