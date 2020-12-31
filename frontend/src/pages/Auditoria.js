import React, { useEffect, useState } from 'react'
import { Edit3, PlusCircle, XCircle } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import api from '../services/api';
import dateFormat from 'dateformat'
import '../styles/auditoria.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Auditoria() {
  const [campos, setCampos] = useState(['identificador', 'descricao', 'data'])
  const [camposUTF, setCamposUTF] = useState(['ID', 'Descrição', 'Data'])

  const [listaAudit, setListaAudit] = useState([])/* 
  const [identificador, setIdentificador] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('') */

  //const [adm_id, setAdm_id] = useState('')
  const [searchParams, setSearchParams] = useState('')

  function handleSearch(params) {
    setSearchParams(params)
  }

  useEffect(() => {
    //setAdm_id(localStorage.getItem('adm_id'))
    const adm_id = localStorage.getItem('user')
    //api.get('/auditoria',{headers: adm_id})
    api.get('/auditoria', { headers: { adm_id }, params: searchParams })
      .then(res => {
        setListaAudit(res.data.reverse())
        console.log(res.data)
      })
      .catch(e => {
        console.error(e)
        alert('Deu ruim!')
      })
    
  }, [searchParams])

  return (
    <div id='page-auditoria'>
      <Header3DBack title='Auditoria' search={true} adm={true} backTo='/documentos'
        campos={campos} camposUTF={camposUTF} handleSearch={handleSearch}/>
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >{camposUTF[0]}</h3>
            <h3 style={{ minWidth: 250 }} >{camposUTF[1]}</h3>
            <h3 style={{ minWidth: 180 }} >{camposUTF[2]}</h3>
          </div>

          {listaAudit.map((audit,i) => {
            return (
              <div key={i} className="row-document">
              <h3>{audit.identificador}</h3>
              <h3 style={{ justifyContent: 'left' }}>
                {audit.descricao}
              </h3>
              <h3>{dateFormat(audit.data,"dd/mm/yyyy - HH:MM")}</h3>
            </div>
            )           

          })}


        </main>
      </div>
    </div>
  );
}

export default Auditoria;
