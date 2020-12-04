import React from 'react'
import { Upload/*, CheckCircle, XCircle*/ } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import '../styles/verificacao.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Verificacao() {
  return (

    <div id='page-verificacao'>
      <Header3DBack title='3D GED' />
      <div className='container'>
        <main className='main-content'>
          <form action="">
            <h2>Você quer verificar a autenticidade/integridade de um documento?
                 Envie-nos o arquivo e te dizemos se ele consta ou não em nossa base de dados!</h2>

            <button type="submit">
              <Upload size={80} strokeWidth={0.8} />
                Enviar Documento
              </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Verificacao;
