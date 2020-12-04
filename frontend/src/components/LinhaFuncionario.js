import React, { useState } from 'react'
import { Check, Edit3, Eye, PlusCircle, Share2, XCircle } from 'react-feather';
import './linhaFuncionario.css'

//props.title, props.search,props.adm: boolean,
function LinhaFuncionario(props) {
  const [edita, setEdita] = useState(false)

  function toggleEnableEdit() {
    setEdita(!edita)
  }

  return (

    <div className="row-funcionario">
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={props.id}
        onChange={e => {props.id = e.target.value}}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={props.nome} 
        onChange={props.funcInput}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={props.area} 
        onChange={props.funcInput}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={props.login} 
        onChange={props.handleLogin}
      />
      <input disabled={!edita} type={!edita ? 'password' : 'text'}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={props.senha} 
        onChange={props.handleSenha}
      />

      <div className="edit-remove-button">
        <button className='edit-button' onClick={toggleEnableEdit}
          style={edita ? { backgroundColor: 'lightGreen' } : { backgroundColor: 'var(--azul2)' }}
        >
          {edita ? (<Check />) : <Edit3 />}
        </button>
        <button className='remove-button'>
          <XCircle />
        </button>
      </div>
    </div>
  )
}

export default LinhaFuncionario;