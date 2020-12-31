import React, { useEffect, useState } from 'react'
import { ArrowLeftCircle, MinusCircle, PlusCircle } from 'react-feather'
import { Link } from 'react-router-dom'
import CampoLblInput from '../components/CampoLblInput'
import api from '../services/api'
import '../styles/criarPadrao.css'

function CriarPadrao() {
  const [qntLabels, setQntLabels] = useState(0)
  const [listaLabels, setListaLabels] = useState([])

  const [identificador, setIdentificador] = useState('')
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [area, setArea] = useState('')

  const [listaLabelsPreenchidos, setListaLabelsPreenchidos] = useState([])
  const [formularios, setFormularios] = useState([])
  let adm_id


  useEffect(() => {
    updatePage()

  }, [formularios.length])

  function updatePage() {
    adm_id = localStorage.getItem('user')
    api.get('/docPadrao', { headers: { adm_id } })
      .then(res => {
        //console.log(res.data)
        setFormularios(res.data)
      })
      .catch(e => alert('Algo deu errado ao carregar os formulários'))
  }

  function handleOnChange(e) {
    listaLabelsPreenchidos[qntLabels] = e.target.value
    setListaLabelsPreenchidos([...listaLabelsPreenchidos])
    //console.log(listaLabelsPreenchidos)
  }

  async function handleSubmit() {

    if (listaLabelsPreenchidos.length > 0 && identificador !== '' && titulo !== '' &&
      descricao !== '' && area !== '') {
      let arrayLabelsInputs = []
      listaLabelsPreenchidos.map((label) => {
        arrayLabelsInputs.push([label, ""])
      })
      // gerando nssa estrutura [[A,a],[B,b],[C,c]] para transformar em obj pra mandar pro mongo
      const camposPreenchidosObj = Object.fromEntries(arrayLabelsInputs)
      console.log(camposPreenchidosObj)

      await api.post('/docPadrao', { identificador, titulo, area, descricao, camposObj: camposPreenchidosObj },
        { headers: { adm_id: localStorage.getItem('user') } }) //Tem q mudar pra dinamico!!!!!!!!
        .then(() => {
          alert('Deu certo!')
        })
        .catch(e => { alert(`Erro ao criar formulário!\n${e.response.data.error}`) })

      let msg_auditoria = `Administrador Adicionou Formulário Padrão - ${identificador} ${titulo} - em ${area}`
      const adm_id = localStorage.getItem('user')

      await api.post('/auditoria', { descricao: msg_auditoria }, { headers: { adm_id } })
        .then(() => {
          alert('Auditado!')       //To fznd aqui pra evitar de receber os param. como ''     
          setListaLabels([])
          setListaLabelsPreenchidos([])
          setQntLabels(0)
          setIdentificador('')
          setTitulo('')
          setDescricao('')
          setArea('')
          updatePage() // Gambiarra das braba, sabe Deus pq mas se colocar + da pau kkk
          //alert(formularios.length)
          setFormularios([...formularios]) //o react é burrinho e tenho q avisar ele
        })
        .catch(e => {
          alert('Deu ruim na auditoria')
          console.error(e)
        })
    }
    else if (listaLabelsPreenchidos.length === 0) {
      alert('Aperte o botão de + para adicionar campos ao formulário!')
    } else (alert('Preencha os campos obrigatórios!'))


  }

  function addCampoHandler() {
    //console.log('Apertou o butão!')
    setQntLabels(qntLabels + 1)
    //console.log(qntLabels)
    setListaLabels([...listaLabels,
    <CampoLblInput key={qntLabels} valor={listaLabelsPreenchidos[qntLabels]} funcOnChange={handleOnChange} />])
    //console.log(listaLabels)
  }

  function minusCampoHandler() {
    //console.log('Apertou o butão!')
    setQntLabels(qntLabels - 1)
    //console.log(qntLabels)
    let listaLabelsAux = listaLabels
    listaLabelsAux.pop()
    setListaLabels(listaLabelsAux)

    //console.log(listaLabels)
  }

  return (
    <div id="page-criarPadrao">
      <aside className='secao-lateral'>
        <h2>Formulários</h2>
        {formularios.map((form, i) => {
          return (<h4 key={i}>{i + 1}) {form.identificador} {form.titulo}</h4>)
        })}

      </aside>
      <header>
        <Link to="/menu"><ArrowLeftCircle size={80} strokeWidth={0.5} className='icon' /></Link>
        <h1>Criar Formulário Padrão</h1>
        <button onClick={handleSubmit}>Criar Formulário</button>
      </header>

      <main>
        <section>
          <input placeholder='ID' required
            value={identificador}
            onChange={e => setIdentificador(e.target.value)}
          />
          <input placeholder='Título' required
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
          />
          <input placeholder='Área' required
            value={area}
            onChange={e => setArea(e.target.value)}
          />
          <div className='buttons'>
            <button onClick={addCampoHandler}>
              <PlusCircle size={42} color={'white'} />
            </button>
            <button onClick={minusCampoHandler}>
              <MinusCircle size={42} color={'white'} />
            </button>
          </div>


          <input placeholder='Descrição' required className='descricao'
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
        </section>

        <article>
          <aside>

            {listaLabels.map((item, i) => {
              if (i % 2 === 0)
                return item
            })}

          </aside>

          <aside>

            {listaLabels.map((item, i) => {
              if (i % 2 === 1)
                return item
            })}

          </aside>
        </article>
      </main>
    </div>
  );
}

export default CriarPadrao;