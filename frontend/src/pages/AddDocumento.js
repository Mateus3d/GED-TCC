import React, { useEffect, useState } from 'react'
import ClipBtn from '../images/Clip_Button.svg'
import EnviarBtn from '../images/Enviar_Button.svg'
import Header3DBack from '../components/Header3DBack';
import '../styles/addDocumento.css'
import api from '../services/api';
import { useHistory } from 'react-router-dom';

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function AddDocumento() {
  //useEffect carregando os dados
  //states dos inputs
  //funcao pra fzr o post e mudar de tela
  const [identificador, setIdentificador] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [listaLabels, setListaLabels] = useState([])
  const [listaInputs, setListaInputs] = useState([])

  const history = useHistory()

  const idDocPadrao = '5fc96df642968027b0661b40' //Depois tornar dinamico!!!!!!!!!!!!

  useEffect(() => {
    //api.get(`/docPadrao?_id=${5fc18fa475022c1f80105399}`).then(res=>{
    api.get(`/docPadrao?_id=${idDocPadrao}`).then(res => { //Tenho q descobrir como passar por aqui. Provavelmente pelo localStorage
      setIdentificador(res.data[0].identificador) //Só vem um doc em array, por isso colocar [0]
      setTitulo(res.data[0].titulo)
      setDescricao(res.data[0].descricao)
      setListaLabels(Object.keys(res.data[0].camposObj)) //transforma o obj em array (os labels no caso)
      setListaInputs(Object.values(res.data[0].camposObj)) //transforma o obj em array (os labels no caso)

    }).catch(e => {
      console.log('error: ', e)
      alert('Ocorreu algum erro ao abrir o documento!')
      history.push('/documentos')
    })
    console.log(listaLabels)

  }, [])

  function handleSubmit() {

    let arrayLabelsInputs = []
    listaLabels.map((label, i) => {
      arrayLabelsInputs.push([label, listaInputs[i]])
    })
    // gerando nssa estrutura [[A,a],[B,b],[C,c]] para transformar em obj pra mandar pro mongo
    const camposPreenchidosObj = Object.fromEntries(arrayLabelsInputs)

    console.log(camposPreenchidosObj)

    api.post(`/documentos/${idDocPadrao}`, { camposObj: camposPreenchidosObj },
      { headers: { adm_id: '5fbc0782f91fe0302027f8c7', funcionario_id: '5fbc0d558ceaae267821b738' } }
    ).then(() => {
      alert('Documento enviado com sucesso!')
      history.push('/documentos')
    }).catch(e => {      
      alert('Deu ruim')
    })
  }

  return (

    <div id='page-addDocumento'>
      <Header3DBack title='Add Documento' search={false} backTo='/documentos' />  {/* adm é pra definir se o back vai pro menu */}
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
                    <textarea id={i} type="text"
                      value={listaInputs[i]}
                      onChange={e => {
                        listaInputs[i] = e.target.value
                        setListaInputs([...listaInputs])
                        //console.log(listaInputs) //Sabe Deus pq isso tá funcionado 
                      }}
                    />
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
                    <textarea id={i} /* id="Campo" */ type="text"
                      value={listaInputs[i]}
                      onChange={e => {
                        listaInputs[i] = e.target.value
                        setListaInputs([...listaInputs])
                        //console.log(listaInputs) //Sabe Deus pq isso tá funcionado 
                      }}
                    />
                  </div>)
              }
            })}

          </aside>
        </article>

        <section className='buttons'>
          <div>
            <h3>Anexar<br></br> Arquivo</h3>
            <button className='anexarBtn'>
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

      </main>
    </div>
  );
}

export default AddDocumento;


