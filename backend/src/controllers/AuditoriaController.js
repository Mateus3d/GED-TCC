//index, show, store, update, destroy
const Auditoria = require('../models/Auditoria') //O model (tabela do BD)
const dateFormat = require('dateformat')

module.exports = {
  async index(req, res) {
    const adm_id = req.adm_id  //colocar dps pra pegar da empresa certa
    const {identificador,descricao,data} = req.query
    let audit
    console.log(adm_id)
    audit = await Auditoria.find({adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Erro ao listar auditoria'})
      })
      

    if (identificador || descricao || data) { //para pesquisa
      if (identificador) {
        audit = audit.filter(au => {
          if (String(au.identificador).includes(identificador)) { return au }
        })
      }
      if (descricao) {
        audit = audit.filter(au => {
          if (au.descricao?.toLowerCase().includes(descricao.toLowerCase())) { return au }
        })
      }
      if (data) {
        audit = audit.filter(au => {
          if (String(dateFormat(au.data, 'dd/mm/yyyy')).includes(data)) { return au }
        })
      }      
    } 
    return res.json(audit)
  }, 

	async store(req,res) {
    const {identificador,descricao} = req.body
    const adm_id = req.adm_id //dps verifica
    
    let audit = await Auditoria.create({identificador,descricao,adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Algo deu errado ao cadastrar a auditoria!'})
      })
    return res.json(audit)

		
  },

  async destroy(req,res) {
    const adm_id = req.adm_id
    const {auditoria_id} = req.params

    let auditorias = await Auditoria.find({adm_id})
      .catch(e => {
        console.error(e)
        return res.status(400).json({error: 'Houve algum erro inesperado!'})
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