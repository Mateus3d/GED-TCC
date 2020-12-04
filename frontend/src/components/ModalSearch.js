import React, { useState } from 'react'
import { Search, XCircle } from 'react-feather'
import './modalSearch.css'

function ModalSearch(props) {
  return (
    <>
      {props.show ? (
        <div id='modal-search'>
          <div className='container'>
            <h1>Pesquisar</h1>
            <section>
              <h3>ID</h3>
              <input placeholder='Pesquise por ID' type="text" />
            </section>
            <section>
              <h3>Título</h3>
              <input placeholder='Pesquise por Título' type="text" />
            </section>
            <section>
              <h3>Descrição</h3>
              <input placeholder='Pesquise por Descrição' type="text" />
            </section>
            <section>
              <h3>Data</h3>
              <input placeholder='Pesquise por Data' type="text" />
            </section>
            <section className='buttons'>
              <button className='exitBtn' onClick={props.handleClose}>
                <XCircle size={36} color={'white'} />
              </button>
              <button className='searchBtn'>
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
