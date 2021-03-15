import React, { useEffect, useState } from 'react'
import { Search, XCircle } from 'react-feather'
import './modalSearch.css'

function ModalSearch(props) {

  //const [campos, setCampos] = useState([])
  const [inputPesquisa, setInputPesquisa] = useState([]) //Input a ser preenchido

  useEffect(() => {
    if (props.campos) {
      props.campos.map((item, i) => { //Só pra ñ deixar undefined
        inputPesquisa[i] = ""
        setInputPesquisa([...inputPesquisa])
      })
    }

  }, [])

  function boraPesquisar() {
    if (props.campos) {
      let arrayLabelsCampos = []
      props.campos.map((label, i) => {
        arrayLabelsCampos.push([label, inputPesquisa[i]])
      })
      const pesquisaPreenchidaObj = Object.fromEntries(arrayLabelsCampos)
      console.log(pesquisaPreenchidaObj)
      if (props.handleSearch)
        props.handleSearch(pesquisaPreenchidaObj)
    }
  }

  return (
    <>
      {props.show ? (
        <div id='modal-search'>
          <div className='container'>
            <h1>Pesquisar</h1>
            {props.camposUTF.map((campoUTF, i) => {
              return (
                <section key={i}>
                  <h3>{campoUTF}</h3>
                  <input placeholder={`Pesquise por ${campoUTF}`} type="text"

                    value={inputPesquisa[i]}
                    onChange={e => {
                      inputPesquisa[i] = e.target.value
                      setInputPesquisa([...inputPesquisa])
                    }}
                  />
                </section>
              )

            })}
            <section className='buttons'>
              <button className='exitBtn' onClick={props.handleClose}>
                <XCircle size={36} color={'white'} />
              </button>
              <button className='searchBtn' /* onClick={props.handleSearch} */ 
                onClick={() => {
                  boraPesquisar()
                  props.handleClose()
                  }}>
                <Search size={28} color={'white'} />
              </button>
            </section>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ModalSearch
