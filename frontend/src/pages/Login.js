import React, { useEffect, useState } from 'react'
import { PlusCircle, CheckCircle } from 'react-feather'
import { Link, useHistory } from 'react-router-dom'
import api from '../services/api'

import '../styles/login.css'

function Login() {
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')

  const history = useHistory()

  useEffect(()=>{
    localStorage.clear()
  })

  function handleSubmit(e) {
    e.preventDefault()
    const data = {username,senha}
    api.post('/login', data)
        .then((response) => {
          alert('Deu certo')
          localStorage.setItem('user', response.data.id)
          //console.log(response.data) //Aqui tem o id e adm =true ou false
          if (response.data.adm){
            localStorage.setItem('adm',true) //Sei que não é o mais seguro, mas é um protótipó
            history.push('/menu')
          } else {
            localStorage.setItem('adm',false)
            history.push('/documentos')
          }
        })
        .catch(e => {
          alert('Deu ruim')
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
