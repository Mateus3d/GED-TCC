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
    const data = {cnpj, username, senha}
    if (senha === confirmSenha) {
      //console.log({cnpj, username, senha})
      api.post('/adms',data).then(()=>{
        alert('Cadastrado com sucesso!')
        history.push('/') //poderia colocar um modal de sucesso ou não dps, mas ñ é necessário
      }).catch(e => {
        alert(`Erro ao cadastrar!\n${e.response.data.error}`)
        //console.log(e.response.data.error)
      })
      
    }
    else alert('A senha deve ser a mesma em confirmar senha!')
   
  }

  return (

    <div id='page-cadastro'>
      <Header3DBack title='3D GED' />
      <div className='container'>
        <div className='side-content'>
          <strong>Essa conta é administradora e tem acesso total ao GED da empresa</strong>
        </div>
        <main className='main-content'>
          <form onSubmit={handleSubmit}>
            <h2>Cadastro</h2>
            <input placeholder="CNPJ" type='number' 
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
