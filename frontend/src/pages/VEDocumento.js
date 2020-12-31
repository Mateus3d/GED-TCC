import React, { useEffect, useState } from 'react'
import ClipBtn from '../images/Clip_Button.svg'
import EnviarBtn from '../images/Enviar_Button.svg'
import Header3DBack from '../components/Header3DBack';
import '../styles/addDocumento.css'
import api from '../services/api';
import { useHistory } from 'react-router-dom';

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function VEDocumento() {
  //useEffect carregando os dados
  //states dos inputs
  //funcao pra fzr o post e mudar de tela
  const [identificador, setIdentificador] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [listaLabels, setListaLabels] = useState([])
  const [listaInputs, setListaInputs] = useState([])

  //const [documento_id, setDocumento_id] = useState('')
  let documento_id = ''
  //const documento_id

  const history = useHistory()

  //const docPadrao_id = '5fc96df642968027b0661b40' //Depois tornar dinamico!!!!!!!!!!!!

  useEffect(() => {
    //setDocumento_id(localStorage.getItem('documento_id'))
    documento_id = localStorage.getItem('documento_id')

    /* api.get(`/documentos/${documento_id}`).then(res => { //Tenho q descobrir como passar por aqui. Provavelmente pelo localStorage
      console.log(documento_id)
      console.log(res.data)
    }).catch(e => {
      console.log('error: ', e)
      alert('Ocorreu algum erro ao abrir o documento!')
      history.push('/documentos')
    }) */

    //const func_id = localStorage.getItem('user')

    api.get(`/documentos/${documento_id}`)
      .then(res => { //Tenho q descobrir como passar por aqui. Provavelmente pelo localStorage
        setIdentificador(res.data.docPadrao.identificador) //Só vem um doc em array, por isso colocar 
        setTitulo(res.data.docPadrao.titulo)
        setDescricao(res.data.docPadrao.descricao)
        setListaLabels(Object.keys(res.data.camposObj)) //transforma o obj em array (os labels no caso)
        setListaInputs(Object.values(res.data.camposObj)) //transforma o obj em array (os labels no caso)
        console.log(res.data)
        //console.log(documento_id)
      }).catch(e => {
        console.log('error: ', e)
        alert('Ocorreu algum erro ao abrir o documento!')
        history.push('/documentos')
      })
    console.log('Doc_id: ', documento_id)
    console.log('titulo: ', titulo)

  }, [documento_id])

  async function handleSubmit() {
    console.log('oi', documento_id)
    const idDocumento = localStorage.getItem('documento_id')
    const adm_id = localStorage.getItem('user')

    let arrayLabelsInputs = []
    listaLabels.map((label, i) => {
      arrayLabelsInputs.push([label, listaInputs[i]])
    })
    // gerando nssa estrutura [[A,a],[B,b],[C,c]] para transformar em obj pra mandar pro mongo
    const camposPreenchidosObj = Object.fromEntries(arrayLabelsInputs)

    //console.log(camposPreenchidosObj)
    let identificador_doc = '', titulo_doc = '', area_doc = ''
    await api.put(`/documentos/${idDocumento}`, { camposObj: camposPreenchidosObj },
      { headers: { adm_id } }
    ).then(res => {
      alert('Documento ATUALIZADO com sucesso!')
      localStorage.removeItem('documento_id')
      localStorage.removeItem('docPadrao_id')
      identificador_doc = res.data.docPadrao.identificador
      titulo_doc = res.data.docPadrao.titulo
      area_doc = res.data.docPadrao.area
      //area_doc = res.data.docPadrao.area //Tenho q colocar a area no docPadrao dps
      console.log('Identificador: ', identificador_doc)
      console.log('titulo: ', titulo_doc)
      console.log('area: ', area_doc)
      history.push('/documentos')
    }).catch(e => {
      alert('Deu ruim')
      console.error(e)
    })

    let msg_auditoria = `Administrador Atualizou - ${identificador_doc} ${titulo_doc} - em ${area_doc}`
    await api.post('/auditoria', { descricao: msg_auditoria }, { headers: { adm_id } })
      .then(() => {
        alert('Auditado!')
        history.push('/documentos')
      })
      .catch(e => {
        alert('Deu ruim na auditoria')
        console.error(e)
      })



  }

  return (

    <div id='page-addDocumento'>
      <Header3DBack title='Editar Documento' search={false} backTo='/documentos'
        backFunc={() => { //Ao clicar em voltar tem q limpar
          localStorage.removeItem('documento_id')
          localStorage.removeItem('docPadrao_id')
        }} />  {/* adm é pra definir se o back vai pro menu */}
      <main>
        <div className="row-title">
          <h3 style={{ minWidth: 110 }} ><strong>ID: </strong> {identificador}</h3>
          <h3 style={{ minWidth: 360 }} ><strong>Título: </strong>{titulo}</h3>
          <h3 style={{ minWidth: 530 }} ><strong>Descrição: </strong>{descricao}</h3>
        </div>

        <article>
          <aside>
            {listaLabels.map((item, i) => {
              if (i % 2 === 0) {
                return (
                  <div key={i}>
                    <label>{item}: </label>
                    {localStorage.getItem('adm') === 'true' ? (
                      <textarea id={i} type="text"
                        value={listaInputs[i]}
                        onChange={e => {
                          listaInputs[i] = e.target.value
                          setListaInputs([...listaInputs]) }}                        
                      />
                      )
                      : (<p>{listaInputs[i]}</p>)
                    }

                  </div>)
              }
            })}


          </aside>

          <aside>
            {listaLabels.map((item, i) => {
              if (i % 2 === 1) {
                return (
                  <div key={i}>
                    <label htmlFor="Campo">{item}: </label>
                    {localStorage.getItem('adm') === 'true' ? (
                      <textarea id={i} type="text"
                        value={listaInputs[i]}
                        onChange={e => {
                          listaInputs[i] = e.target.value
                          setListaInputs([...listaInputs]) }}                        
                      />
                      )
                      : (<p>{listaInputs[i]}</p>)
                    }
                    
                  </div>)
              }
            })}

          </aside>
        </article>

        {localStorage.getItem('adm') === 'true' ? (
          <section className='buttons'>
            <div>
              <h3>Anexar<br></br> Arquivo</h3>
              <button className='anexarBtn' onClick={() => { console.log(documento_id) }}>
                <img src={ClipBtn} alt="Enviar" />
              </button>
            </div>

            <div>
              <button className='enviarBtn' onClick={handleSubmit}>
                <img src={EnviarBtn} alt="Enviar" />
              </button>
              <h3>Enviar</h3>
            </div>
          </section>
        ) : null}


      </main>
    </div>
  );
}

export default VEDocumento;


