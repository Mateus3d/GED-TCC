import React from 'react'
import './campoLblInput.css'

//props.title, props.search: boolean
function CampoLblInput(props){
    return(
        <div className='div-campo'>
            <label>
              <textarea placeholder='Campo:' 
                value={props.valor}
                onChange={props.funcOnChange}
              />
              
            </label>
            <input disabled type="text"/>
        </div>
    )
}

export default CampoLblInput;