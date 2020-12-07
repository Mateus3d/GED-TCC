import React, { useEffect, useState } from 'react'
import { Edit3, PlusCircle, XCircle } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import LinhaFuncionario from '../components/LinhaFuncionario';
import api from '../services/api';
import '../styles/funcionarios.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function Funcionarios() {

  const [qntFunc, setQntFunc] = useState(0)
  //const [listFunc, setListFunc] = useState([])
  const [listaFuncionarios, setListaFuncionarios] = useState([])

  const [identificador, setIdentificador] = useState([])
  const [nome, setNome] = useState([])
  const [area, setArea] = useState([])
  const [login, setLogin] = useState([])
  const [senha, setSenha] = useState([])
  //const [funcionario, setFuncionario] = useState([])

  useEffect(() => {
    api.get('/funcionarios')
      .then(res => {
        console.log(res.data)
        let ids = [], nomes = [], areas = [], logins = [], senhas = [], funcionarios = []
        res.data.map((item, i) => {
          ids.push(item.identificador)
          nomes.push(item.nome)
          areas.push(item.area)
          logins.push(item.username)
          senhas.push(item.senha)
          funcionarios.push({ identificador: ids[i], nome: nomes[i], area: areas[i], username: logins[i], senha: senhas[i] })
        })
        setIdentificador(ids)
        setNome(nomes)
        setArea(areas)
        setLogin(logins)
        setSenha(senhas)
        setListaFuncionarios(funcionarios)

        /* console.log('nomes: ', nome)
        console.log('ids: ', identificador)
        console.log('areas: ', area)
        console.log('logins: ', login)
        console.log('senhas: ', senha)
        console.log('funcionarios: ', listaFuncionarios) */
        /* 
        console.log('ids: ',ids)
        console.log('areas: ',areas)
        console.log('logins: ',logins)
        console.log('senhas: ',senhas) */

        //setListaFuncionarios(res.data)

        //console.log(listaFuncionarios)
      }).catch(e => { alert('Erro!!') })
    console.log('nomes: ', nome)
    console.log('ids: ', identificador)
    console.log('areas: ', area)
    console.log('logins: ', login)
    console.log('senhas: ', senha)
    console.log('funcionarios: ', listaFuncionarios)
  }, [])

  function handleOnChange(e) {
    identificador[e.target.id] = e.target.value
    setIdentificador([...identificador])
    console.log('mudando')

    /* function handleId(e) {

    } */
  }

  function addFuncHandler() {
    //console.log('Apertou o butão!')
    setQntFunc(qntFunc + 1)
    //console.log(qntFunc)
    setListaFuncionarios([{ identificador: '', nome: '', area: '', username: '', senha: '' }, ...listaFuncionarios])
    console.log(listaFuncionarios)
    //setListFunc([<LinhaFuncionario key={qntFunc} />, ...listFunc]) //Assim põe ao contrário
    //console.log(listFunc)
  }

  /*  function removeFuncHandler() {
     console.log('Apertou o butão!')
     setQntFunc(qntFunc + 1)
     console.log(qntFunc)
     let listFuncAux = listFunc
     listFuncAux.pop()
     setListFunc(listFuncAux)
 
     console.log(listFunc)
   }
  */
  return (
    <div id='page-funcionarios'>
      <Header3DBack title='Funcionários' search={true} adm={true} backTo='/documenotos' />
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >ID</h3>
            <h3 style={{ minWidth: 250 }} >Nome Funcionário</h3>
            <h3 style={{ minWidth: 250 }} >Área</h3>
            <h3 style={{ minWidth: 250 }} >Login</h3>
            <h3 style={{ minWidth: 180 }} >Senha</h3>

            <button className='add-button' onClick={addFuncHandler}>
              <PlusCircle size={42} color={'#FFF'} />
            </button>

          </div>

          {/* {listFunc} */}

          {listaFuncionarios.map((linha, i) => {
            return (
              <LinhaFuncionario key={i} id={i} ident={identificador[i]} nome={linha.nome}
                area={linha.area} login={linha.username} senha={linha.senha}
              funcOnChange={handleOnChange}
              /* funcId={handleId} funcNome={handleNome} funcArea={handleArea}
              funcLogin={handleLogin} funcSenha={handleSenha} */
              />)
          })}


        </main>
      </div>
    </div>
  );
}

export default Funcionarios;
