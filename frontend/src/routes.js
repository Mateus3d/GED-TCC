import React, { useContext } from 'react'
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
import VEDocumento from './pages/VEDocumento'
import AddAnexo from './pages/AddAnexo'
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { parseJwt } from './Utils'
import { Context } from './context/AuthContext'

// function isAuthenticated() {
//   return true
//   // const isAdm = parseJwt(localStorage.getItem('jwt')).adm
//   // return isAdm
// }

/*const PrivateRoute = ({component: Component, ...rest}) => (
  <Route 
    {...rest}
    render={props => 
      {
        const {authenticated, loading} = useContext(Context)
        if (loading) { //leva tempo pra realizar o useEffect e as vezes ñ consegue antes de seguir com a requisição
          return //Se não tiver carregado ñ prossegue pra renderização
        }
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{pathname:'/', state: { from: props.location} }} />
        )
      }
    }
  />
)*/

function PrivateRoute({onlyAdm,...rest}) {
  const {authenticated, loading} = useContext(Context)
  
  // console.log('OnlyAdm',onlyAdm)
  if (loading) { //leva tempo pra realizar o useEffect e as vezes ñ consegue antes de seguir com a requisição
    return <h1>Loading..</h1>//Se não tiver carregado ñ prossegue pra renderização
  }
  // console.log('Loading', loading)
  const parsedJwt = parseJwt()
  // console.log('JWT', parsedJwt)
  const isAdm = true//parseJwt().adm
  // console.log('isAdm',isAdm)
  // console.log('Authenticated', authenticated)
  if (!authenticated) {
    return <Redirect to='/' />
  }
  if (onlyAdm && !isAdm) {
    return <Redirect to='/' />
  }

  return <Route {...rest} />
}

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' onlyAdm exact component={Login} />
        <Route path='/cadastro' onlyAdm exact component={Cadastro} />
        <PrivateRoute path='/menu' onlyAdm exact component={MenuAdm} />
        <PrivateRoute path='/documentos' exact component={Documentos} />
        <PrivateRoute path='/adicionardocumento' onlyAdm exact component={AddDocumento} />
        <PrivateRoute path='/formulariopadrao' onlyAdm exact component={CriarPadrao} />
        <PrivateRoute path='/funcionarios' onlyAdm exact component={Funcionarios} />
        <PrivateRoute path='/auditoria' onlyAdm exact component={Auditoria} />
        <Route path='/verificacao' exact component={Verificacao} />
        <PrivateRoute path='/documento' exact component={VEDocumento} /> {/* Gambiarra pura, mas fzr oq */}
        <PrivateRoute path='/addanexo' exact component={AddAnexo} />
      </Switch>
    </BrowserRouter>

  )
}

export default Routes