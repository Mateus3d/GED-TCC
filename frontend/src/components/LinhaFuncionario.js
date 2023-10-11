import React, { useEffect, useState } from 'react'
import { Check, Edit3, Eye, PlusCircle, Share2, XCircle } from 'react-feather';
import api from '../services/api';
import './linhaFuncionario.css'
import { parseJwt } from '../Utils';

//props.title, props.search,props.adm: boolean,
function LinhaFuncionario(props) {
  const [edita, setEdita] = useState(false)
  const [identificador, setIdentificador] = useState(props.ident)
  const [nome, setNome] = useState(props.nome)
  const [area, setArea] = useState(props.area)
  const [login, setLogin] = useState(props.login)
  const [senha, setSenha] = useState(props.senha)

  const adm_id = parseJwt().sub

  useEffect(() => {
    if (props.editaInicial)
      setEdita(true)
  })

  function toggleEnableEdit() {
    setEdita(!edita)
    if (edita) {
      if (!props.id) { //entende-se q não foi criado ainda
        console.log('bora criar')
        async function newFuncionario() {
          await api.post('/funcionarios', { identificador, nome, area, username: login, senha },
            { headers: { adm_id } })
            .then(() => {
              alert('Funcionario acrescentado!')
              props.removeNovoFunc()

              let descricao = `Administrador Adicionou Funcionário - ${identificador} ${nome} - em ${area}`

              api.post('/auditoria', { descricao }, { headers: { adm_id } })
                .then(() => {
                  alert('Auditado!')
                })
                .catch(e => {
                  alert('Deu ruim na auditoria')
                  console.error(e)
                })
            })
            .catch((e) => {
              alert(`Erro!\n${e.response.data.error}`)
              console.error(e)
              props.removeNovoFunc()
            })
          props.handleUpdateListaFunc()
        }
        newFuncionario()

      } else {
        console.log('update nele')
        console.log('id: ', props.id)
        api.put(`/funcionarios/${props.id}`, { identificador, nome, area, username: login, senha },
          { headers: { adm_id } })
          .then(() => {
            alert('Funcionário Atualizado!')
            let descricao = `Administrador Atualizou Funcionário - ${identificador} ${nome} - em ${area}`
            api.post('/auditoria', { descricao }, { headers: { adm_id } })
              .then(() => {
                alert('Auditado!')
              })
              .catch(e => {
                alert('Deu ruim na auditoria')
                console.error(e)
              })
          })
          .catch(e => {
            alert(`Erro ao Atualizar!\n${e.response.data.error}`)
            console.error(e)
            //props.handleUpdateListaFunc()
            window.location.reload()
          })

      }
    }
  }

  function handleRemove() {
    if (props.id) {
      console.log('bora deletar')
      async function funcionarios() {
        await api.delete(`/funcionarios/${props.id}`, { headers: { adm_id } })
          .then(() => {
            alert('Funcionario Removido!')
            props.handleUpdateListaFunc()
            let descricao = `Administrador Removeu Funcionário - ${identificador} ${nome} - de ${area}`
            api.post('/auditoria', { descricao }, { headers: { adm_id } })
              .then(() => {
                alert('Auditado!')
              })
              .catch(e => {
                alert('Deu ruim na auditoria')
                console.error(e)
              })
          })
          .catch(e => {
            alert('Algo deu errado!')
            console.error(e)
          })
      }
      funcionarios()

    } else {
      props.removeNovoFunc()
    }
  }

  return (

    <div className="row-funcionario">
      <input disabled={!edita} type="number"
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={identificador}
        onChange={e => {
          setIdentificador(e.target.value)
        }}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={nome}
        onChange={e => { setNome(e.target.value) }}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={area}
        onChange={e => { setArea(e.target.value) }}
      />
      <input disabled={!edita}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        value={login}
        onChange={e => { setLogin(e.target.value) }}
      />
      <input disabled={!edita} type={!edita ? 'password' : 'text'}
        style={!edita ? { color: 'var(--cinzaTextDisabled)' } : { color: 'black' }}
        // value={senha}
        placeholder={'***'}
        onChange={e => { setSenha(e.target.value) }}
      />

      <div className="edit-remove-button">
        <button className='edit-button' onClick={toggleEnableEdit}
          style={edita ? { backgroundColor: 'lightGreen' } : { backgroundColor: 'var(--azul2)' }}
        >
          {edita ? (<Check />) : <Edit3 />}
        </button>
        <button className='remove-button' onClick={handleRemove}>
          <XCircle />
        </button>
      </div>
    </div>
  )
}

export default LinhaFuncionario;