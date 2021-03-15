//index, show, store, update, destroy
const Adm = require('../models/Adm')
const Funcionario = require('../models/Funcionario')

module.exports = {
  async index(req, res) { //Lista tudo e/ou pesquisa
    const { identificador, nome, area, username } = req.query
    const { adm_id } = req.headers

    let funcionarios = await Funcionario.find({ adm: adm_id })
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Houve algum erro!' })
      })//.populate('adm') se quiser popular com os dados da empresa (adm)

    if (identificador || nome || area || username) {
      funcionarios = funcionarios.filter(func => {
        if (func.nome.toLowerCase().includes(nome.toLowerCase()) &&
          func.area.toLowerCase().includes(area.toLowerCase()) &&
          func.username.toLowerCase().includes(username.toLowerCase()) &&
          func.identificador.includes(identificador)//Incluir os outros campos
        ) {
          return func
        }
      })
    }
    //console.log(funcionarios[0].nome)
    return res.json(funcionarios)
  },
  async show(req, res) {
    const { idFuncionario } = req.params
    let funcionario = await Funcionario.findById(idFuncionario)
      .catch(e => {
        console.error(e)
        res.status(400).json({ error: 'Erro ao encontrar funcionario' })
      })
    res.json(funcionario)

  },

  async store(req, res) {
    const { adm_id } = req.headers
    const { identificador, nome, area, username, senha } = req.body
    var numbers = /^[0-9]+$/; //regex pra verificar se é numero
    if(!identificador.match(numbers))
      return res.status(400).json({error: 'ID só aceita números!'})

    let adm = await Adm.findById(adm_id) //Vê se tem algum adm com esse id recebido do header
    if (!adm) { //Se ñ existir esse adm então retorna erro
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }

    let funcionario = await Funcionario.findOne({ identificador }, {adm: adm_id })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let funcionarioLoginExistente = await Funcionario.findOne({ username })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let admLogin = await Adm.findOne({ username })
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

    funcionario = await Funcionario.create({
      adm: adm_id,
      identificador,
      nome,
      area,
      username,
      senha
    }).catch(e => {
      console.error(e)
      return res.status(400).json({ error: 'Ocorreu algum erro ao criar o funcionario' })
    })

    return res.json(funcionario)
  },

  async update(req, res) {
    const { adm_id } = req.headers
    const adm = await Funcionario.findOne({ adm: adm_id })
    if (!adm) {
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }

    const { idFuncionario } = req.params
    const { identificador, nome, area, username, senha } = req.body

    var numbers = /^[0-9]+$/; //regex pra verificar se é numero
    if(!identificador.match(numbers))
      return res.status(400).json({error: 'ID só aceita números!'})
      
    let funcionarioRepetido = await Funcionario.find({
       identificador , adm: adm_id,
      _id: { $ne: idFuncionario } //Pra não confundir com ele mesmo
    })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    let funcionarioLoginExistente = await Funcionario.find({ username, _id: { $ne: idFuncionario } })  //verifica se o funcionario já existe
      .catch(e => {
        console.error(e)
        return res.status(400).json({ error: 'Ocorreu algum erro ao procurar o funcionario' })
      })
    //console.log(funcionarioRepetido)
    let admLogin = await Adm.findOne({ username })
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

    funcionarioAtualizado = await Funcionario.findByIdAndUpdate({ _id: idFuncionario }, { identificador, nome, area, username, senha }, { new: true })
      .catch(err => {
        if (err) {
          console.log('deu ruim')
          res.status(400).json({ error: 'Erro ao atualizar' })
        }
      })
    return res.json(funcionarioAtualizado)
  },

  async destroy(req, res) {
    const { adm_id } = req.headers
    const adm = await Funcionario.findOne({ adm: adm_id })
    if (!adm) {
      return res.status(400).json({ error: 'Erro de autenticacao' })
    }

    const { idFuncionario } = req.params
    let funcionarioDeletado = await Funcionario.findById(idFuncionario)
    if (funcionarioDeletado) {
      await Funcionario.findByIdAndDelete(idFuncionario)
      return res.json({ message: `Funcionario ${funcionarioDeletado.nome} removido com sucesso` })
    }
    else {
      return res.status(400).json({ error: 'Funcionario nao encontrado!' })
    }
  }

}