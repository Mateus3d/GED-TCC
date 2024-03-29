import React, { useContext, useEffect, useState } from 'react'
import { PlusCircle, CheckCircle } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import api from '../services/api'
import '../styles/login.css'
import utils from '../Utils'
import { Context } from '../context/AuthContext'

function Login() {
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const { authenticated, setAuthenticated, setLoading/*, handleLogin*/ } = useContext(Context)
  const history = useHistory()

  useEffect(()=>{
    // localStorage.clear()
    // api.defaults.headers.Authorization = undefined
    // setAuthenticated(false)
    // console.log('Autenticado:', authenticated)
  }/*,[authenticated]*/)

  function handleSubmit(e) {
    e.preventDefault()
    const data = {username,senha}
    // handleLogin(data)
    api.post('/login', data)
        .then((response) => {
          alert('Bem vindo!')
          // localStorage.setItem('user', response.data.id)
          console.log(response.data) //Aqui tem o id e adm =true ou false
          const jwt = response.data.token
          localStorage.setItem('jwt', JSON.stringify(jwt))
          const isAdm = utils.parseRawJwt(jwt).adm
          // handleLogin(data)
          setAuthenticated(true)
          // console.log('Autenticado:', authenticated)
          setLoading(false)
          api.defaults.headers.Authorization = `Bearer ${jwt}`
          // console.log(isAdm)
          if (isAdm){
            history.push('/menu')
          } else {
            history.push('/documentos')
          }
        })
        .catch(e => {
          setAuthenticated(false)
          setLoading(false)
          history.push('/')
          // console.log('Autenticado:', authenticated)
          alert('Usuário ou senha incorretos!')
        })
  }

  return (
    <div id='page-login'>
      <div className="header">
        <h1>3D GED</h1>
      </div>
      <div className='container'>
        <div className='side-content'>
          <Link to="/cadastro"><PlusCircle className='icon' size={100} strokeWidth={0.5} /></Link>
          <strong>Cadastrar Nova Empresa</strong>
        </div>
        <main className='main-content'>
          <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
            <input placeholder="Senha" 
              type='password' 
              value={senha} onChange={e => setSenha(e.target.value)}
            />

            <button type="submit">Entrar</button>
          </form>
        </main>
        <div className='side-content'>
          <Link to="/verificacao"><CheckCircle className='icon' size={100} strokeWidth={0.5} /></Link>
          <strong>Verificar um documento</strong>
        </div>
      </div>
    </div>
  );
}

export default Login;
