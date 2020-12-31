import React, { useEffect, useState } from 'react'
import { ArrowLeftCircle, Search } from 'react-feather'
import { Link } from 'react-router-dom';
import './header3DBack.css'
import ModalSearch from './ModalSearch';

//props.title, props.search: boolean
function Header3DBack(props) {
  const [showModal, setShowModal] = useState(false);
  const [backTo, setBackTo] = useState('/');

  useEffect(()=>{
    if (props.adm) {
      console.log('é adm')
      setBackTo('/menu')
    } else if (props.backTo) {
        console.log('é func')
        setBackTo(props.backTo)
    } else {
      setBackTo('/')
    }
  },[])
  
  
  

  function handleHideModal() {
    setShowModal(false)
  }

  function handleShowModal() {
    setShowModal(true)
  }

  return (
    <>
      <ModalSearch show={showModal} handleClose={handleHideModal} campos={props.campos} 
      handleSearch={props.handleSearch} camposUTF={props.camposUTF} />
      <div id="header">
        <Link className='back' to={backTo} onClick={props.backFunc}>
          <ArrowLeftCircle size={80} strokeWidth={0.5} className='icon' />
        </Link>
        <h1>{props.title}</h1>
        {props.search == true ? (
          <button onClick={handleShowModal}><Search color={'#FFF'} size={25} /></button>
        ) : null}

      </div>
    </>
  )
}

export default Header3DBack;