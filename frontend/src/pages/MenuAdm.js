import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Header3DBack from '../components/Header3DBack';
import '../styles/menuAdm.css'
import { parseJwt } from '../Utils';

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function MenuAdm({history}) {
  //const [adm,setAdm] = useState(false)
  useEffect(()=>{
    // const isAdm = parseJwt().adm
    // console.log(isAdm)
    // if (adm==='false') {
    //   history.push('/documentos')
    // } else if (adm === null) {
    //   history.push('/') //dps defino isso direito
    // }
  },[])

  return (
    <div id='page-menuAdm'>
      <Header3DBack title='3D GED' 
        backFunc={() => { //Ao clicar em voltar tem q limpar
          localStorage.clear()
        }} 
        />
      <div className='container'>
        <main className='main-content'>
          <h2>Menu</h2>
          <div className="menu-botoes" >
            <Link to='/documentos' className='menu-first-line'>Documentos</Link>
            <Link to='/auditoria' className='menu-first-line'>Auditoria</Link>
          </div>
          <div className="menu-botoes">
            <Link to='/formulariopadrao' className='menu-second-line'>Criar Formulário</Link>
            <Link to='/funcionarios' className='menu-second-line'>Adicionar/Remover Funcionários</Link>
          </div>

        </main>
      </div>
    </div>
  );
}

export default MenuAdm;
