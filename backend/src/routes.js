const express = require('express')
const multer = require('multer')
const uploadConfig = require('./config/upload')
const AdmsController = require('./controllers/AdmsController')
const DocPadraoController = require('./controllers/DocPadraoController')
const DocumentosController = require('./controllers/DocumentosController')
const FuncionariosController = require('./controllers/FuncionariosController')
const SessionsController = require('./controllers/SessionsController')
const AuditoriaController = require('./controllers/AuditoriaController')
const HashsController = require('./controllers/HashsController')
const PDFController = require('./controllers/PDFController')
const {checkToken, checkIfIsAdm, checkIfIsSameUsrParams} = require('./controllers/AuthController.js')

const routes = express.Router()
const upload = multer(uploadConfig)


routes.post('/login', SessionsController.store)

routes.post('/adms', AdmsController.store)
routes.get('/adms', AdmsController.index) // 
routes.delete('/adms/:id', AdmsController.destroy) // -D

routes.post('/funcionarios', checkToken, checkIfIsAdm, FuncionariosController.store)//cadastrar
routes.get('/funcionarios', checkToken, checkIfIsAdm, FuncionariosController.index)//listar e/ou pesquisar todos
routes.get('/funcionarios/:idFuncionario', checkToken, FuncionariosController.show)//listar e/ou pesquisar todos
routes.put('/funcionarios/:idFuncionario', checkToken, checkIfIsAdm,FuncionariosController.update)
routes.delete('/funcionarios/:idFuncionario', checkToken, checkIfIsAdm, FuncionariosController.destroy)

routes.post('/docPadrao', checkToken, checkIfIsAdm, DocPadraoController.store)
routes.get('/docPadrao', checkToken,DocPadraoController.index)
routes.get('/docPadrao/:docPadrao_id', checkToken,DocPadraoController.show)
routes.delete('/docPadrao/:_id', checkToken, checkIfIsAdm,DocPadraoController.destroy)
routes.put('/docPadrao/:_id', checkToken, checkIfIsAdm,DocPadraoController.update)

routes.post('/documentos/:docPadrao_id', checkToken, upload.array('arquivos'), DocumentosController.store)
routes.get('/documentos/:documento_id', checkToken, DocumentosController.show)
routes.get('/documentos', checkToken, DocumentosController.index)
routes.delete('/documentos/:documento_id', checkToken, DocumentosController.destroy)
routes.put('/documentos/:documento_id', checkToken, upload.array('arquivos'), DocumentosController.update)

routes.post('/auditoria', checkToken, AuditoriaController.store)
routes.get('/auditoria', checkToken, checkIfIsAdm, AuditoriaController.index)
routes.delete('/auditoria', checkToken, checkIfIsAdm, AuditoriaController.destroy)

routes.post('/hash', checkToken, upload.array('arquivos'), HashsController.store)
routes.post('/hash/:h', checkToken, HashsController.storeRaw) //guarda o hash já processado
routes.get('/hash/tudo', checkToken, HashsController.index) //-D
//routes.delete('/hash/tudo', HashsController.destroy) //-D Deleta tudo
routes.delete('/hash/tudo', HashsController.destroyAll) //-D
routes.delete('/hash/:documento_id', HashsController.destroy) //-D

routes.post('/verifica', upload.single('arquivo'), HashsController.show) //Verificação!!

routes.post('/gerarpdf',checkToken, PDFController.store)
/*
routes.get('/funcionarios', usersController.index)
routes.post('/funcionarios', usersController.store)
routes.put('/funcionarios/:idUser', usersController.update)

*/
module.exports = routes