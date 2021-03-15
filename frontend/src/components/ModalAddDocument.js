import React, { useEffect, useState } from 'react'
import { Paperclip, Search, XCircle } from 'react-feather'
import { useHistory } from 'react-router-dom'
import './modalAddDocument.css'

function ModalAddDocument(props) {
   //const [documentosPadrao, setDocsPadrao] = useState([])
   const history = useHistory()
   function handleClickDoc(e) {
    localStorage.setItem('docPadrao_id', e.target.id)
    history.push('/adicionardocumento')
   }

  return (
    <>
      {props.show ? (
        <div id='modal-addDocument'>
          <div className='container'>
            <h1>Add Documento</h1>
            <button className='fecharBtn' onClick={props.hide}>
              <XCircle color={'red'} size={40} />
            </button>
            {/* <button className='anexarDocBtn'>
              <Paperclip />
                Anexar Arquivo como Documento
              <Paperclip />
            </button> */}
            {props.docs.length == 0 ? (
              <h1 style={{fontSize: 30, textDecoration: 'underline'}}>
                Nenhum formulário acrescentado pelo Administrador na sua área ainda!
              </h1>
            ): null}
            {props.docs.map(item => {
              return (<button key={item._id} id={item._id} 
                onClick={handleClickDoc}>{item.identificador} {item.titulo}</button>)
            })}

          </div>
        </div>
      ) : null}
    </>
  )
}

export default ModalAddDocument
