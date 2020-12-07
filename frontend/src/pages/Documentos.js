import React, { useEffect, useState } from 'react'
import { Edit3, PlusCircle, Share2, XCircle } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import LinhaDocumento from '../components/LinhaDocumento';
import ModalAddDocument from '../components/ModalAddDocument';
import dateFormat from 'dateformat'
import api from '../services/api';
import '../styles/documentos.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Documentos() {
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [documentos, setDocumentos] = useState([])
  const [docsPadrao, setDocsPadrao] = useState([])
  const [admBool,setAdmBool] = useState(false)

  useEffect(() => {
    const adm = localStorage.getItem('adm')
    if (adm === 'true'){
      setAdmBool(true)
    } else {
      setAdmBool(false)
    }
    api.get('/documentos').then(response => {
      setDocumentos(response.data.reverse()) //Os dados já vêm em forma de array, por isso posso passar direto, só invertendo para q o ultimo seja o primeiro
    })

    api.get('/docPadrao').then(res=>{
      setDocsPadrao(res.data)
    }).catch(e => {console.log('error: ',e)})
    //console.log(docsPadrao)
    /* api.get('/docPadrao')
    .then(res => {console.log(res)}).catch(e => {console.log('error')}) */
    
  },[documentos])

  function handleRemoveDocumento(documento_id) {
    api.delete(`/documentos/${documento_id}`)
      .then(() => {
        console.log('Deu Certo')
      }).catch(e => {
        console.log('Deu ruim')
      })
  }

  function handleShowModal() {
    setShowAddDoc(true)
  }
  function handleHideModal() {
    setShowAddDoc(false)
  }

  return (
    <div id='page-documentos'>
      <ModalAddDocument show={showAddDoc} hide={handleHideModal} docs={docsPadrao}/>
      {/* Tem q colocar as props (ô passando errado, tem q ser os docs padrao não os preenchidos*/}

      <Header3DBack title='Documentos' search={true} adm={true} backTo='/'/>
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >ID</h3>
            <h3 style={{ minWidth: 250 }} >Título</h3>
            <h3 style={{ minWidth: 530 }} >Descrição</h3>
            <h3 style={{ minWidth: 150 }} >Data</h3>

            <button onClick={handleShowModal} className='add-button'>
              <PlusCircle size={42} color={'#FFF'} />
            </button>

          </div>
          {documentos.map(item => {
            return (<LinhaDocumento 
                        key={item._id} 
                        id={item._id}
                        identificador={item.docPadrao.identificador} 
                        titulo={item.docPadrao.titulo}
                        descricao={item.docPadrao.descricao}
                        data={dateFormat(item.data, "dd/mm/yyyy")}
                        adm={admBool} 
                        remove={() => handleRemoveDocumento(item._id)}
                    />)
                    
          })
          }

        </main>
      </div>
    </div>
  );
}

export default Documentos;
