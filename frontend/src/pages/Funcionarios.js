import React, { useEffect, useState } from 'react'
import { PlusCircle } from 'react-feather';
import Header3DBack from '../components/Header3DBack';
import LinhaFuncionario from '../components/LinhaFuncionario';
import api from '../services/api';
import '../styles/funcionarios.css'

function Funcionarios() {
  const [camposUTF, setCamposUTF] = useState(['ID', 'Nome Funcionário', 'Área', 'Login'])
  const [campos, setCampos] = useState(['identificador', 'nome', 'area', 'username'])

  const [listaFuncionarios, setListaFuncionarios] = useState([])
  const [novoFuncionario, setNovoFuncionario] = useState()
  const [searchParams, setSearchParams] = useState('')
  
  useEffect(() => {
    handleUpdateListaFunc()    
  }, [listaFuncionarios.length, searchParams])

  function addFuncHandler() {
    setNovoFuncionario(<LinhaFuncionario ident={''} nome={''}
      area={''} login={''} senha={''} removeNovoFunc={handleRemoveNovoFunc}
      handleUpdateListaFunc={handleUpdateListaFunc} //pra poder atualizar o bendito
      editaInicial={true}
    />)
  }

  async function handleUpdateListaFunc() {
    //const tamanho = listaFuncionarios.length
    const adm_id = localStorage.getItem('user')
    api.get('/funcionarios', { headers: { adm_id }, params: searchParams })
      .then(res => {
        setListaFuncionarios(res.data.reverse())
        //console.log(res.data)
      }).catch(e => { alert('Erro!!') })

    //console.log('To tentando!!')
  }

  function handleSearch(params) {
    setSearchParams(params)
  }

  function handleRemoveNovoFunc() {
    setNovoFuncionario(null)
  }

  return (
    <div id='page-funcionarios'>
      <Header3DBack title='Funcionários' search={true} adm={true} backTo='/documentos'
        campos={campos} camposUTF={camposUTF} handleSearch={handleSearch} />
      <div className='container'>
        <main className='main-content'>
          <div className="row-title">
            <h3 style={{ minWidth: 95 }} >{camposUTF[0]}</h3>
            <h3 style={{ minWidth: 250 }} >{camposUTF[1]}</h3>
            <h3 style={{ minWidth: 250 }} >{camposUTF[2]}</h3>
            <h3 style={{ minWidth: 250 }} >{camposUTF[3]}</h3>
            <h3 style={{ minWidth: 180 }} >Senha</h3>

            <button className='add-button' onClick={addFuncHandler}>
              <PlusCircle size={42} color={'#FFF'} />
            </button>

          </div>

          {novoFuncionario}

          {listaFuncionarios.map((linha, i) => {
            return (
              <LinhaFuncionario key={linha._id} id={linha._id} ident={linha.identificador} nome={linha.nome}
                area={linha.area} login={linha.username} senha={linha.senha}
                handleUpdateListaFunc={handleUpdateListaFunc} //removeNovoFunc={handlRemoveNovoFunc}
              />)
          })}

        </main>
      </div>
    </div>
  );
}

export default Funcionarios;
