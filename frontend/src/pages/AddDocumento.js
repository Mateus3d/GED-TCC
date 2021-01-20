import React, { useEffect, useMemo, useState } from 'react'
import ClipBtn from '../images/Clip_Button.svg'
import EnviarBtn from '../images/Enviar_Button.svg'
import Header3DBack from '../components/Header3DBack';
import '../styles/addDocumento.css'
import api from '../services/api';
import { useHistory } from 'react-router-dom';
import arquivo_icon from '../images/archive_icon.png'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function AddDocumento() {
  const [identificador, setIdentificador] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [area, setArea] = useState('')
  const [listaLabels, setListaLabels] = useState([])
  const [listaInputs, setListaInputs] = useState([])

  const [arquivos, setArquivos] = useState([])

  const history = useHistory()

  const preview = useMemo(() => {
    let res
    console.log(arquivos)
    if (arquivos) {
      res = arquivos.map(arq => {
        return URL.createObjectURL(arq)
      })
      return res
    } else {
      return null
    }
  }, [arquivos])

  let docPadrao_id
  useEffect(() => {
    docPadrao_id = localStorage.getItem('docPadrao_id')
    console.log(docPadrao_id)
    api.get(`/docPadrao/${docPadrao_id}`).then(res => { //Tenho q descobrir como passar por aqui. Provavelmente pelo localStorage
      setIdentificador(res.data.identificador) //Só vem um doc em array, por isso colocar [0]
      setTitulo(res.data.titulo)
      setDescricao(res.data.descricao)
      setArea(res.data.area)
      setListaLabels(Object.keys(res.data.camposObj)) //transforma o obj em array (os labels no caso)
      setListaInputs(Object.values(res.data.camposObj)) //transforma o obj em array (os labels no caso)
      console.log(res.data)
    }).catch(e => {
      console.log('error: ', e)
      alert('Ocorreu algum erro ao abrir o documento!')
      history.push('/documentos')
    })
    console.log(listaLabels)

  }, [])

  async function audita() {
    //let identificador_func = await Funcionario.findById(id_func) //tem ainda q pegar o id do func caso exista
    let user = localStorage.getItem('user')
    let adm = localStorage.getItem('adm')
    let nome_user = '', identificador_user = ''//, area = ''
    let adm_id

    if (adm === 'true') {
      nome_user = 'Administrador'
      adm_id = user
      alert('Vou auditar como ADM ok?')
      //dps tem q colocar a area
    } else {
      alert('Vou auditar como funcionario ok?')
      await api.get(`/funcionarios/${user}`/* , { headers: { adm_id: '5fbc0782f91fe0302027f8c7' } } */)
        .then(res => {
          console.log(res.data)
          nome_user = res.data.nome
          identificador_user = res.data.identificador
          adm_id = res.data.adm
          //area = res.data.area
        })
        .catch(e => {
          console.error(e)
          alert('Algo deu errado na auditoria do FUNCIONÁRIO!')
        })
    }
    console.log('Nome: ', nome_user)
    console.log('Identificador: ', identificador_user)
    console.log('area: ', area)
    //Tenho q consertar pro ADM!!!!!!!!!!
    let descricao = `${nome_user} Adicionou - ${identificador} ${titulo} - em ${area}`
    let data
    if (adm === 'true')
      data = { descricao }
    else
      data = { identificador: identificador_user, descricao }
    api.post('/auditoria', data, { headers: { adm_id } })
      .then(() => {
        alert('Auditado!')
      })
      .catch(e => {
        alert('Deu ruim na auditoria')
        console.error(e)
      })
  }

  function handleSubmit() {

    let arrayLabelsInputs = []
    listaLabels.map((label, i) => {
      arrayLabelsInputs.push([label, listaInputs[i]])
    })
    // gerando nssa estrutura [[A,a],[B,b],[C,c]] para transformar em obj pra mandar pro mongo
    const camposPreenchidosObj = Object.fromEntries(arrayLabelsInputs)
    const idDocPadrao = localStorage.getItem('docPadrao_id')
    console.log(camposPreenchidosObj)
    console.log('docPadrao: ', idDocPadrao)

    const func_id = localStorage.getItem('user')
    //Isso é para mandar como multipartform
    const data = new FormData()
    listaLabels.map((label, i) => {
      return data.append(`${label}`, listaInputs[i])
    })
    //manda os arquivos
    arquivos.map(arq => {
      if (arq)
        return data.append('arquivos', arq)
    })
    let documento_id
    if (localStorage.getItem('adm') === 'true') {
      api.post(`/documentos/${idDocPadrao}`, data,//{ camposObj: camposPreenchidosObj },
        { headers: { adm_id: func_id } }
      ).then(async res => {
        alert('Documento enviado com sucesso como ADM!')
        localStorage.removeItem('documento_id')
        localStorage.removeItem('docPadrao_id')
        await geraHash(res.data.id)
        await audita()
        history.push('/documentos')
      }).catch(e => {
        alert('Deu ruim pra mandar o documento')
      })
    }
    else {
      api.post(`/documentos/${idDocPadrao}`, data,
        { headers: { func_id } }
      ).then(async res => {
        alert('Documento enviado com sucesso como funcionário!')
        localStorage.removeItem('documento_id')
        localStorage.removeItem('docPadrao_id')
        await geraHash(res.data.id)
        //console.log('haaaaaaaaaaa:',documento_id)
        await audita()
        history.push('/documentos')
      }).catch(e => {
        alert('Deu ruim pra mandar o documento')
      })
    }
  }

  async function geraHash(documento_id) {    
    //console.log('documenot id:::::',documento_id)
    if (arquivos.length > 0) {
      //Por segurança seria desejável enviar tb o adm_id mas não vou fazer assim por enquanto
      const dataToGenerateHash = new FormData()
      arquivos.map(arq => {
        if (arq)
          return dataToGenerateHash.append('arquivos', arq)
      })
      dataToGenerateHash.append('documento', documento_id) //envia os arquivos pra gerar hash junto com o documento ao qual pertence!
      //console.log('haaaaaaaaaaa:',documento_id)
      api.post('/hash', dataToGenerateHash)
        .then(res => {
          alert('Hash gerada com sucesso!')
          //console.log(res)
        })
        .catch(e => {
          console.error(e)
          alert('Erro ao gerar Hash')
        })
    }    
  }

  return (

    <div id='page-addDocumento'>
      <Header3DBack title='Add Documento' search={false} backTo='/documentos'
        backFunc={() => { //Ao clicar em voltar tem q limpar
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
            <label className='anexarBtn'>
              <input multiple style={{ display: 'none' }} type="file" onChange={e => {
                const arqAux = Array.from(e.target.files)
                setArquivos(arqAux.concat(arquivos))
                console.log(arquivos)
              }} />
              <img src={ClipBtn} alt="Enviar" />
            </label>
          </div>

          <div>
            <button className='enviarBtn' onClick={handleSubmit}>
              <img src={EnviarBtn} alt="Enviar" />
            </button>
            <h3>Enviar</h3>
          </div>
        </section>

        {arquivos ? (
          arquivos.map((arq, i) => {
            return (
              <section key={i} className="preview-section">
                {arq.type.includes('image') ? (   //se for imagem gera o preview
                  <label style={{ backgroundImage: `url(${preview[i]})` }}
                    className={arq ? 'preview-visible' : 'preview-invisible'} />
                ) : ( //se não coloca o ícone
                    <label id='preview-icon' style={{ backgroundImage: `url(${arquivo_icon})` }}
                      className={arq ? 'preview-visible' : 'preview-invisible'} />
                  )}
                <strong style={{ color: 'white', fontSize: 28, overflow: 'hidden' }}>
                  {arq.name}
                </strong>
              </section>
            )
          })
        ) : null}

      </main>
    </div>
  );
}

export default AddDocumento;


