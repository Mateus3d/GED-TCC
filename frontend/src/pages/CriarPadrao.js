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

  const [listaLabelsPreenchidos, setListaLabelsPreenchidos] = useState([])
  const [formularios,setFormularios] = useState([])

  
  useEffect(()=> {
    //Tem q carregar no lado os formulários já criados! (Dps tem q restringir por ADM!!!! )
    api.get('/docPadrao')
      .then(res => {
        //console.log(res.data)
        setFormularios(res.data)
      })
      .catch(e => alert('Algo deu errado ao carregar os formulários'))
  },[formularios])

  function handleOnChange(e) {
    listaLabelsPreenchidos[qntLabels] = e.target.value
    setListaLabelsPreenchidos([...listaLabelsPreenchidos])
    //console.log(listaLabelsPreenchidos)
  }

  function handleSubmit() {
    
    if (listaLabelsPreenchidos.length > 0 && identificador !== '' && titulo !== '' && descricao !== '') {
      let arrayLabelsInputs = []
      listaLabelsPreenchidos.map((label) => {
        arrayLabelsInputs.push([label, ""])
      })
      // gerando nssa estrutura [[A,a],[B,b],[C,c]] para transformar em obj pra mandar pro mongo
      const camposPreenchidosObj = Object.fromEntries(arrayLabelsInputs)
      console.log(camposPreenchidosObj)

      api.post('/docPadrao', { identificador, titulo, descricao, camposObj: camposPreenchidosObj },
      { headers: { adm_id: '5fbc0782f91fe0302027f8c7' } }) //Tem q mudar pra dinamico!!!!!!!!
      .then(() => { 
        alert('Deu certo!') 
        setListaLabels([])
        setListaLabelsPreenchidos([])
        setQntLabels(0)
        setIdentificador('')
        setTitulo('')
        setDescricao('')
        
      })
      .catch(e => { alert(`Erro ao criar formulário!\n${e.response.data.error}`) })
    }
    else if (listaLabelsPreenchidos.length === 0){
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
        {formularios.map((form,i) => {
          return (  <h4 key={i}>{i + 1}) {form.identificador} {form.titulo}</h4>  )
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
          <input placeholder='Descrição' required
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
          />
          <div className='buttons'>
            <button onClick={addCampoHandler}>
              <PlusCircle size={42} color={'white'} />
            </button>
            <button onClick={minusCampoHandler}>
              <MinusCircle size={42} color={'white'} />
            </button>
          </div>
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