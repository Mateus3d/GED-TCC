import React from 'react'
import { Edit3, Eye, PlusCircle, Share2, XCircle } from 'react-feather';
import { useHistory } from 'react-router-dom';
import './linhaDocumento.css'

//props.title, props.search,props.adm: boolean,
function LinhaDocumento(props) {
  const history = useHistory()

  function handleEdit(e) {
    localStorage.setItem('documento_id', props.id)
    history.push('/documento') //Aqui é para editar ou visualizar
    //console.log(props.id)
  }

  return (
    <div className="row-document">
      <h3 style={{ minWidth: 95 }} >{props.identificador}</h3>
      <h3 style={{ minWidth: 250 }} >{props.titulo}</h3>
      <h3 style={{ minWidth: 530 }} >{props.descricao}</h3>
      <h3 style={{ minWidth: 150 }}>{props.data}</h3>

      {props.adm ? (
        <div className="edit-remove-share-button">
          <button className='edit-button' onClick={handleEdit}>
            <Edit3 />
          </button>
          <button className='remove-button' onClick={props.remove}>
            <XCircle />
          </button>
          <button className='share-button'>
            <Share2 />
          </button>
        </div>) : (
          <button className='visualizar-button' onClick={e => { console.log('clicaram em mim') }}>
            <Eye />
          </button>
        )}
    </div>
  )
}

export default LinhaDocumento;