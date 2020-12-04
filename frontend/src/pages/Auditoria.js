import React from 'react'
import { Edit3, PlusCircle, XCircle } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import '../styles/auditoria.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Auditoria() {
  return (
    <div id='page-auditoria'>
      <Header3DBack title='Auditoria' search={true} adm={true} backTo='/documentos' />
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >ID</h3>
            <h3 style={{ minWidth: 250 }} >Descrição</h3>
            <h3 style={{ minWidth: 180 }} >Data</h3>
          </div>

          <div className="row-document">
            <h3>551142</h3>
            <h3 style={{ justifyContent: 'left' }}>
              Mateus adicionou “FRIND012 Explosão Generalizada” em Tratamento de Caldo.
            </h3>
            <h3>02/11/2020</h3>
          </div>

        </main>
      </div>
    </div>
  );
}

export default Auditoria;
