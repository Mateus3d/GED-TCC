import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MenuAdm from './pages/MenuAdm'
import Documentos from './pages/Documentos'
import AddDocumento from './pages/AddDocumento'
import CriarPadrao from './pages/CriarPadrao'
import Funcionarios from './pages/Funcionarios'
import Auditoria from './pages/Auditoria'
import Verificacao from './pages/Verificacao'

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' exact component={Login} />
        <Route path='/cadastro' exact component={Cadastro} />
        <Route path='/menu' exact component={MenuAdm} />
        <Route path='/documentos' exact component={Documentos} />
        <Route path='/adicionardocumento' exact component={AddDocumento} />
        <Route path='/formulariopadrao' exact component={CriarPadrao} />
        <Route path='/funcionarios' exact component={Funcionarios} />
        <Route path='/auditoria' exact component={Auditoria} />
        <Route path='/verificacao' exact component={Verificacao} />

      </Switch>
    </BrowserRouter>

  )
}

export default Routes