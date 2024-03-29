//index, show, store, update, destroy
const Adm = require('../models/Adm')
const Funcionario = require('../models/Funcionario')
const bcrypt = require('bcrypt')

module.exports = {
  async index(req, res) { //Lista tudo e/ou pesquisa
    const { identificador, nome, area, username } = req.query
    // const { adm_id } = req.headers
    const adm_id = req.sub
    // console.log(adm_id)

    let funcionarios = await Funcionario.find({ adm: adm_id })
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Houve algum erro!' })
      })//.populate('adm') se quiser popular com os dados da empresa (adm)

    //Filtrando pelos QueryParams  
    if (identificador) {
      funcionarios = funcionarios.filter(func => {
        if (func.identificador.includes(identificador)) {return func}
      })
    }
    if (nome) {
      funcionarios = funcionarios.filter(func => {
        if (func.nome.toLowerCase().includes(nome?.toLowerCase())) {return func}
      })
    }
    if (area) {
      funcionarios = funcionarios.filter(func => {
        if (func.area.toLowerCase().includes(area?.toLowerCase())) {return func}
      })
    }
    if (username) {
      funcionarios = funcionarios.filter(func => {
        if (func.username.toLowerCase().includes(username?.toLowerCase())) {return func}
      })
    }
    
    return res.json(funcionarios)
  },
  async show(req, res) {
    const { idFuncionario } = req.params
    const adm_id = req.adm_id
    
    let funcionario = await Funcionario.findOne({_id: idFuncionario, adm: adm_id}, '-senha')
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Erro ao encontrar funcionario' })
      })
    console.log('Funci: ',funcionario)
    if (!funcionario) 
      return res.status(404).json({ msg: 'Funcionario não encontrado!'})
    else 
      return res.json(funcionario)
  },

  async store(req, res) {
    // const { adm_id } = req.headers
    const adm_id = req.sub
    
    const { identificador, nome, area, username, senha } = req.body
    var numbers = /^[0-9]+$/; //regex pra verificar se é numero
    if(!String(identificador).match(numbers))
      return res.status(400).json({error: 'ID só aceita números!'})

    let funcionario = await Funcionario.findOne({ identificador, adm: adm_id })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let funcionarioLoginExistente = await Funcionario.findOne({ username })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let admLogin = await Adm.findOne({ username }) //verifica se já existe username para outro ADM
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o ADM' })
      })

    if (funcionario)
      return res.status(400).json({ error: 'Id inválido, já existe outro funcionário com esse dado!' })
    if (funcionarioLoginExistente || admLogin)
      return res.status(400).json({ error: 'Já existe outro usuário com esse login!' })

    if (identificador == '' || nome == '' || area == '' || username == '' || senha == '')
      return res.status(400).json({ error: 'Preencha todos os campos!' })
    
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)
      
    funcionario = await Funcionario.create({
      adm: adm_id,
      identificador,
      nome,
      area,
      username,
      senha: passwordHash
    }).catch(e => {
      console.error(e)
      return res.status(400).json({ error: 'Ocorreu algum erro ao criar o funcionario' })
    })

    return res.json(funcionario)
  },

  async update(req, res) {
    const { idFuncionario } = req.params
    const { identificador, nome, area, username, senha } = req.body
    const adm_id = req.sub

    var numbers = /^[0-9]+$/; //regex pra verificar se é numero
    if(!String(identificador).match(numbers))
      return res.status(400).json({error: 'ID só aceita números!'})
      
    let funcionarioRepetido = await Funcionario.find({
       identificador , adm: adm_id,
      _id: { $ne: idFuncionario } //Pra não confundir com ele mesmo
    })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let funcionarioLoginExistente = await Funcionario.find({ username, _id: { $ne: idFuncionario } })  //verifica se o (novo) username não conflita com outro existente
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    //console.log(funcionarioRepetido)
    let admLogin = await Adm.findOne({ username }) //Verifica se o (novo) username não é o username de algum outro usuário ADM
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o ADM' })
      })

    if (funcionarioRepetido.length > 0)
      return res.status(400).json({ error: 'Id inválido, já existe outro funcionário com esse dado!' })
    if (funcionarioLoginExistente.length > 0 || admLogin)
      return res.status(400).json({ error: 'Já existe outro usuário com esse login!' })
    if (identificador == '' || nome == '' || area == '' || username == '' || senha == '')
      return res.status(400).json({ error: 'Preencha todos os campos!' })


    let funcionarioAtualizado = await Funcionario.findById(idFuncionario)
    if (!funcionarioAtualizado) {
      return res.status(400).json({ error: 'Funcionario não encontrado para atualização' })
    }

    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(senha, salt)

    funcionarioAtualizado = await Funcionario.findByIdAndUpdate({ _id: idFuncionario }, { identificador, nome, area, username, senha: passwordHash }, { new: true })
      .catch(err => {
        if (err) {
          console.log('deu ruim')
          res.status(400).json({ error: 'Erro ao atualizar' })
        }
      })
    return res.json(funcionarioAtualizado)
  },

  async destroy(req, res) {
    const adm_id = req.sub
    const { idFuncionario } = req.params
    let funcionarioDeletado = await Funcionario.findOne({_id: idFuncionario, adm: adm_id})
    if (funcionarioDeletado) {
      await Funcionario.findByIdAndDelete(idFuncionario)
      return res.json({ message: `Funcionario ${funcionarioDeletado.nome} removido com sucesso` })
    }
    else {
      return res.status(400).json({ error: 'Funcionario nao encontrado!' })
    }
  }
    //Deletar tudo!!!
   /* const funcionarios = await Funcionario.find()
    funcionarios.map(async item => {
      await Funcionario.findByIdAndDelete(item._id)
    })
    return res.json({message: 'TUDO deletado!!!'})
  }*/

}