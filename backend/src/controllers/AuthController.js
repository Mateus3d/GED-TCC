const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = {
  checkToken(req,res,next) {
    // console.log(req.path)
    // const pathsSemAuth = ['/login','/adms']
    // if (req.path === '/login') {
    //   next()
    //   return
    // }
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] //Se authHeader então pegar fazer split por espaço e pegar segunda parte
  
    if (!token){
      return res.status(401).json({msg: 'Acesso Negado!'})
    }
  
    try {
      const secret = process.env.SECRET
      jwt.verify(token, secret,(err, decoded)=>{
        if (err /*|| decoded.sub !== req.*/)
          return res.status(401).json({msg: 'Token inválido!'});
        else {
          req.isAdm = decoded.adm
          req.adm_id = decoded.adm_id
          req.sub = decoded.sub
          // console.log('Subject (user_id): ',req.sub)
        }
      })
      next() //Se verificado o token, prossegue para o destino da rota
    } catch(err){
      console.log(err)
      res.status(401).json({msg: 'Token inválido!'})
    } 
  },
  async checkIfIsAdm(req,res,next) {
    const isAdm = req.isAdm
    // let adm = await Adm.findById(adm_id) //Vê se tem algum adm com esse id recebido do header
    // if (!adm)  //Se ñ existir esse adm então retorna erro
    //   return res.status(403).json({ error: 'Usuário Logado não é Administrador' })
    if (!isAdm)
      return res.status(403).json({ error: 'Usuário Logado não é Administrador' })
    else
      next()
    // const pathsSemAuth = ['/login','/adms']
    // if (req.path === '/login') {
    //   next()
    //   return
    // }
  },
  async checkIfIsSameUsrParams(req,res,next) {
    const isAdm = req.isAdm
    const isSameUsr = req.sub == req.params
    if (!isSameUsr || isAdm)
      return res.status(403).json({ error: 'Usuário Logado é o mesmo da requisição! (usr_token != usr_params) ou não é ADM!' })
    else
      next()
  }

}