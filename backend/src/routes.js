const express = require('express')
const AdmsController = require('./controllers/AdmsController')
const DocPadraoController = require('./controllers/DocPadraoController')
const DocumentosController = require('./controllers/DocumentosController')
const FuncionariosController = require('./controllers/FuncionariosController')
const SessionsController = require('./controllers/SessionsController')
const AuditoriaController = require('./controllers/AuditoriaController')
const routes = express.Router()

//const db = require('./db')
//const admsController = require('./controllers/admsController')
//const usersController = require('./controllers/usersController')
routes.post('/login', SessionsController.store)

routes.post('/adms', AdmsController.store)
routes.get('/adms', AdmsController.index)
routes.delete('/adms/:id', AdmsController.destroy) // -D

routes.post('/funcionarios', FuncionariosController.store)//cadastrar
routes.get('/funcionarios', FuncionariosController.index)//listar e/ou pesquisar todos
routes.get('/funcionarios/:idFuncionario', FuncionariosController.show)//listar e/ou pesquisar todos
routes.put('/funcionarios/:idFuncionario', FuncionariosController.update)
routes.delete('/funcionarios/:idFuncionario', FuncionariosController.destroy)

routes.post('/docPadrao', DocPadraoController.store)
routes.get('/docPadrao', DocPadraoController.index)
routes.get('/docPadrao/:docPadrao_id', DocPadraoController.show)
routes.delete('/docPadrao/:_id', DocPadraoController.destroy)
routes.put('/docPadrao/:_id', DocPadraoController.update)

routes.post('/documentos/:documento_id', DocumentosController.store)
routes.get('/documentos/:documento_id', DocumentosController.show)
routes.get('/documentos', DocumentosController.index)
routes.delete('/documentos/:documento_id', DocumentosController.destroy)
routes.put('/documentos/:documento_id', DocumentosController.update)

routes.post('/auditoria', AuditoriaController.store)
routes.get('/auditoria', AuditoriaController.index)
routes.delete('/auditoria', AuditoriaController.destroy)

/*
routes.get('/funcionarios', usersController.index)
routes.post('/funcionarios', usersController.store)
routes.put('/funcionarios/:idUser', usersController.update)

*/
module.exports = routes