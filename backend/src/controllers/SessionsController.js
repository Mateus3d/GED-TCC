//index, show, store, update, destroy
const Adm = require('../models/Adm') //O model (tabela do BD)
const Funcionario = require('../models/Funcionario')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
	async store(req,res) { //Verifica se a conta existe
    try {
      const {username,senha} = req.body
      if ((typeof username !== 'string') || (typeof senha !== 'string')) {
        return res.status(400).json({msg: 'Usuário ou senha inválidos Z!'})
      }
      let adm_id
      let isAdm = false
      let adm = await Adm.findOne({ username })
      let funcionario = await Funcionario.findOne({ username })
      if (!adm && !funcionario) {
        return res.status(400).json({msg: 'Usuário ou senha inválidos X!'})
      }

    
      const checkPasswordAdm = adm && await bcrypt.compare(senha, adm.senha) //Compara a senha plaintext enviada na req com o hash do adm cujo username foi informado
      const checkPasswordFunci = funcionario && await bcrypt.compare(senha, funcionario.senha) //Compara a senha plaintext enviada na req com o hash do funci cujo username foi informado
      if (!checkPasswordAdm && !checkPasswordFunci) {
        return res.status(400).json({msg: 'Usuário ou senha inválidos Y!'})
      }
      const secret = process.env.SECRET
      let idUser

      if(adm) {
        console.log(adm)
        idUser = adm._id
        isAdm = true
        adm_id = adm._id
        // return res.json({id: adm._id, adm:true})
      } else if (funcionario) {
        console.log(funcionario)
        idUser = funcionario._id
        isAdm = false
        adm_id = funcionario.adm
        // return res.json({id: funcionario._id})
      }
      else return res.status(404).json({error: 'Usuário não encontrado'})

      const token = jwt.sign(
        {
          adm: isAdm,
          adm_id
        // id: idUser // dados adicionais
        },
        secret,
        {subject: String(idUser)}
      )
      return res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})

    } catch(err) {
      console.log(err);
      res.status(500).json({msg: 'Falha no servidor, tente novamente!'})
    }
    
		// if(adm) {
		// 	console.log(adm)
		// 	return res.json({id: adm._id, adm:true})
		// } else if (funcionario) {
		// 	console.log(funcionario)
		// 	return res.json({id: funcionario._id})
		// }
		// else return res.status(400).json({error: 'Usuário não encontrado'})

		//return res.json(adm)
	}

}