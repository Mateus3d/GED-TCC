import React, { useEffect, useState } from 'react'
import './campoLblInput.css'

//props.title, props.search: boolean
function CampoLblInput(props) {
  const [show, setShow] = useState(false)

  useEffect(()=>{
    if(show === true){
      setTimeout(() => {
        setShow(!show)
      },3000) 
    }         
  },[show])

  return (
    <div className='div-campo'>
      <label>
        <textarea autoFocus placeholder='Campo:'
          value={props.valor}
          onChange={props.funcOnChange}
        />

      </label>
      <div onClick={() => {    
        setShow(!show)
        }} className="input-disabled">
        {show ? (
          <span style={{ color: 'grey'}}>
            Esse campo será preenchido somente em Documentos
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default CampoLblInput;