import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Header3DBack from '../components/Header3DBack';
import api from '../services/api';
import '../styles/cadastro.css'

function Cadastro() {
  const [cnpj, setcnpj] = useState('') //DPS POSSO MUDAR PRA STRING
  const [username,setUsername] = useState('')
  const [senha,setSenha] = useState('')
  const [confirmSenha,setConfirmSenha] = useState('')
  const history = useHistory()

  function handleSubmit(e) {
    e.preventDefault()
    const data = {cnpj, username, senha} //dados digitados reunidos em uma variável
    if (cnpj === '' || username==='' || senha==='')//Verifica se preencheu os campos
      return alert('Todos os campos são obrigatórios!')
    if (senha !== confirmSenha)
      return alert('A senha deve ser a mesma em confirmar senha!')   
    
    api.post('/adms',data).then(()=>{ //Envio da requisição
      alert('Cadastrado com sucesso!')
      history.push('/') //Redireciona o usuário para tela de login
    }).catch(e => {
      alert(`Erro ao cadastrar!\n${e.response.data.error}`)
    })
  }
  return ( //Daqui em diante é estrutura HTML
    <div id='page-cadastro'>
      <Header3DBack title='3D GED' /> {/* Componente definido para estrutura do topo */}
      <div className='container'>
        <div className='side-content'>
          <strong>Essa conta é administradora e tem acesso total ao GED da empresa</strong>
        </div>
        <main className='main-content'>
          <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>
            <input placeholder="CNPJ" type='number' /* Evita colocar e,-,+,. */
              value={cnpj} 
              onChange={e =>{setcnpj(e.target.value)}}              
            />
            <input placeholder="Login" value={username} onChange={e =>{setUsername(e.target.value)}} />
            <input placeholder="Senha" 
              type='password'
              value={senha} onChange={e =>{setSenha(e.target.value)}} />
            <input placeholder="Confirmar Senha" 
              type='password'
              value={confirmSenha} onChange={e =>{setConfirmSenha(e.target.value)}} 
            />

            <button type="submit">Cadastrar</button>
          </form>
        </main>
        <div className='side-content'>
          <strong>Não passe sua senha para ninguém!</strong>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;
