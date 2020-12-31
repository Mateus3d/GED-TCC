import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-feather';
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
  const [admBool, setAdmBool] = useState(false)
  const [searchParams, setSearchParams] = useState('')

  const [camposUTF, setCamposUTF] = useState(['ID', 'Título', 'Descrição', 'Data'])
  const [campos, setCampos] = useState(['identificador', 'titulo', 'descricao', 'data'])
  let adm_id

  useEffect(() => {
    const adm = localStorage.getItem('adm')
    const func_id = localStorage.getItem('user')

    if (adm === 'true') {
      setAdmBool(true)
      adm_id = func_id
      api.get('/docPadrao', { headers: { adm_id } }).then(res => {
        setDocsPadrao(res.data)
      }).catch(e => { console.error('error: ', e) })

      api.get('/documentos', { headers: { adm_id }, params: searchParams })
        .then(response => {
          setDocumentos(response.data.reverse()) //Os dados já vêm em forma de array, por isso posso passar direto, só invertendo para q o ultimo seja o primeiro
        }).catch(e => { console.error('error: ', e) })
    }
    else {
      setAdmBool(false)
      api.get('/docPadrao', { headers: { func_id } }).then(res => {
        setDocsPadrao(res.data)
      }).catch(e => { console.error('error: ', e) })

      api.get('/documentos', { headers: { func_id }, params: searchParams })
        .then(response => {
          setDocumentos(response.data.reverse()) //Os dados já vêm em forma de array, por isso posso passar direto, só invertendo para q o ultimo seja o primeiro
        }).catch(e => { console.error('error: ', e) })
    }

    /* if (adm_id) { //configurei pra q qnd receber o adm_id carregasse tudo pro adm
      api.get('/docPadrao', { headers: { adm_id } }).then(res => {
        setDocsPadrao(res.data)
      }).catch(e => { console.error('error: ', e) })
    } else { //e qnd receber func_id carregar referente a area do funcionario 
      api.get('/docPadrao', { headers: { func_id } }).then(res => {
        setDocsPadrao(res.data)
      }).catch(e => { console.error('error: ', e) })
    } */

    //console.log(searchParams)
    console.log(documentos)
    console.log()
  }, [documentos.length, searchParams])



  async function handleRemoveDocumento(documento_id) {
    let identificador_doc = '', titulo_doc = '', area_doc
    const adm_id = localStorage.getItem('user')
    if (admBool) {
      await api.delete(`/documentos/${documento_id}`)
        .then(res => {
          alert('Documento Apagado!')
          documentos.length = documentos.length - 1 //Como o react é bem burrinho ele não analisa isso
          console.log(res.data)
          identificador_doc = res.data.docPadrao.identificador
          titulo_doc = res.data.docPadrao.titulo
          area_doc = res.data.docPadrao.area
          //alert(`documentos.length: ${documentos.length}`)
          setDocumentos([...documentos]) //E não atualiza se não deixar explicito chamando a func set...
          console.log('Deu Certo')
        }).catch(e => {
          console.log('Deu ruim')
        })

      let descricao = `Administrador Removeu - ${identificador_doc} ${titulo_doc} - de ${area_doc}`
      let data = { descricao } //O idetificador vai padrao pro Adm

      api.post('/auditoria', data, { headers: { adm_id } })
        .then(() => {
          alert('Auditado!')
        })
        .catch(e => {
          alert('Deu ruim na auditoria')
          console.error(e)
        })
    }
  }

  function handleShowModal() {
    setShowAddDoc(true)
  }
  function handleHideModal() {
    setShowAddDoc(false)
  }

  function handleSearch(params) {
    setSearchParams(params)
  }

  return (
    <div id='page-documentos'>
      <ModalAddDocument show={showAddDoc} hide={handleHideModal} docs={docsPadrao} />
      {/* Tem q colocar as props (ô passando errado, tem q ser os docs padrao não os preenchidos*/}

      <Header3DBack title='Documentos' search={true} adm={localStorage.getItem('adm') === 'true'} backTo='/'
        campos={campos} camposUTF={camposUTF} handleSearch={handleSearch} />
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >{camposUTF[0]}</h3>
            <h3 style={{ minWidth: 250 }} >{camposUTF[1]}</h3>
            <h3 style={{ minWidth: 530 }} >{camposUTF[2]}</h3>
            <h3 style={{ minWidth: 150 }} >{camposUTF[3]}</h3>

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
