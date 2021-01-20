import React, { useState } from 'react'
import { CheckCircle, Upload,/*, CheckCircle, XCircle*/ 
XCircle} from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import api from '../services/api';
import '../styles/verificacao.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Verificacao() {

  const [autenticado, setAutenticado] = useState(null)

  function verifica(arq) {
    const data = new FormData()
    data.append('arquivo', arq)
    api.post('/verifica', data)
      .then(res => {
        alert('Verificado!')
        setAutenticado(res.data.validado) //retorna true se autêntico, senão false
        //console.log(res.data.validado) //retorna true se autêntico, senão false
      })
      .catch(e => {
        console.error(e)
        alert('Erro na verificação')
      })

  }

  return (
    <div id='page-verificacao'>
      <Header3DBack title='3D GED' />
      <div className='container'>
        <main className='main-content'>
          {autenticado === null ? (
            <div>
              <h2>Você quer verificar a autenticidade/integridade de um documento?
              Envie-nos o arquivo e te dizemos se ele consta ou não em nossa base de dados!
              </h2>
            </div>
          ) : null}

          {autenticado === true ? (
            <div>
              <span style={{backgroundColor: 'lightgreen'}}>
                <CheckCircle size={80} color="white" />
              </span>
              <h2>Esse documento é íntegro e autêntico!<br></br>
              Ele consta sim em nosso banco de dados ; )
              </h2>
            </div>
          ) : null  }     

          {autenticado === false ? (            
              <div>
                <span style={{backgroundColor: 'var(--vermelho)'}}>
                  <XCircle size={80} color="white" />
                </span>
                <h2>Esse documento foi alterado ou não é autêntico!<br></br>
                Ele não consta em nossa base de dados : (
                </h2>
              </div>            
            ) : null }     

          <label>
            <input type="file" style={{ display: 'none' }}
              onChange={e => {
                verifica(e.target.files[0])
              }}
            />
            <Upload size={80} strokeWidth={0.8} />
            Enviar Documento
          </label>
        </main>
      </div>

    </div>
  );
}

export default Verificacao;
