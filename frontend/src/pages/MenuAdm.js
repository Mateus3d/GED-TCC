import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Header3DBack from '../components/Header3DBack';
import '../styles/menuAdm.css'

//A confirmação ou negação serão feitos nessa tela mesma posteriormente
//Tendo ainda q adicionar o CheckCircle, XCircle e a msg!!!!!!
function MenuAdm({history}) {
  //const [adm,setAdm] = useState(false)
  useEffect(()=>{
    const adm = localStorage.getItem('adm')
    console.log(adm)
    if (adm==='false') {
      //history.push('/documentos')
      console.log('sai daqui')
      history.push('/documentos')
    }
  },[])

  return (
    <div id='page-menuAdm'>
      <Header3DBack title='3D GED' />
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
