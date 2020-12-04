import React, { useEffect, useState } from 'react'
import { Paperclip, Search, XCircle } from 'react-feather'
import './modalAddDocument.css'

function ModalAddDocument(props) {
   //const [documentosPadrao, setDocsPadrao] = useState([])

  return (
    <>
      {props.show ? (
        <div id='modal-addDocument'>
          <div className='container'>
            <h1>Add Documento</h1>
            <button className='fecharBtn' onClick={props.hide}>
              <XCircle color={'red'} size={40} />
            </button>
            <button className='anexarDocBtn'>
              <Paperclip />
                Anexar Arquivo como Documento
              <Paperclip />
            </button>
            {props.docs.map(item => {
              return (<button key={item._id}>{item.identificador} {item.titulo}</button>)
            })}
            <button>FR02 Limpeza da Cuba de Cana</button>
            {/* <button>{props.identificador} {props.titulo}</button> */}

          </div>
        </div>
      ) : null}
    </>
  )
}

export default ModalAddDocument
