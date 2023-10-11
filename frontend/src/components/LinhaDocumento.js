import React from 'react'
import { Edit3, Eye, PlusCircle, Share2, XCircle } from 'react-feather';
import { useHistory } from 'react-router-dom';
import api from '../services/api';
import './linhaDocumento.css'
// import crypto from 'crypto'
import { SHA256 } from 'crypto-js';

//props.title, props.search,props.adm: boolean,
function LinhaDocumento(props) {
  const history = useHistory()

  function handleEdit(e) {
    localStorage.setItem('documento_id', props.id)
    history.push('/documento') //Aqui é para editar ou visualizar 
    console.log(props.id)
    console.log(props.titulo)
  }

  function geraHashPDF(hash) {
    const documento = props.id
    api.post(`/hash/${hash}`, {headers: {documento}})
    .then(() => {
      //alert('Hash gerado')
    }).catch(e => {
      alert('Deu ruim no Hash')
    })

    //console.log(props.id)
  }

  function geraPDF(e) {
    //console.log(Object.keys(props.camposObj)) 
    //console.log(Object.values(props.camposObj))     
    const titulo = props.titulo
    const labels = Object.keys(props.camposObj)
    const inputs = Object.values(props.camposObj)

    api.post('/gerarpdf', { titulo, labels, inputs }, { headers: { adm_id: localStorage.getItem('user') }, responseType: 'blob' })
      .then(async res => {
        if (res.status === 200) {
          const blob = await res.data
          const file = new Blob(
            [blob],
            { type: 'application/pdf' }
          );
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          /*  let a = document.createElement("a") //Se quiser baixar
           a.download = res.titulo
           a.href = fileURL
           document.body.appendChild(a)
           a.click()
           document.body.removeChild(a) */
          //Se quiser visualizar
          //implementar hash!!!
          var reader = new FileReader();
          var base64
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;
            base64 = base64data.split(',')[1];
            /*let sum = crypto.createHash('sha256');
            sum.update(String(base64));
            const hex = sum.digest('hex');*/
            let hash = SHA256(base64)
            console.log(hash)
            geraHashPDF(hash)
            //console.log(base64);
          }
          //blob.text().then(text => console.log(text));
          window.open(fileURL);
        }
      })
      .catch(e => {
        console.error(e)
        alert('Algo deu errado ao gerar o pdf')
      })
  }

  return (
    <div className="row-document">
      <h3 style={{ minWidth: 120, fontSize: 14 }} >{props.identificador}</h3>
      <h3 style={{ minWidth: 250 }} >{props.titulo}</h3>
      <h3 style={{ minWidth: 530 }} >{props.descricao}</h3>
      <h3 style={{ minWidth: 150 }}>{props.data}</h3>

      {props.adm ? (
        <div className="edit-remove-share-button">
          <button className='edit-button' onClick={handleEdit}>
            <Edit3 />
          </button>
          <button className='remove-button' onClick={props.remove}>
            <XCircle />
          </button>
          <button className='share-button' onClick={geraPDF}>
            <Share2 />
          </button>
        </div>) : (
          <button className='visualizar-button' onClick={handleEdit}>
            <Eye />
          </button>
        )}
    </div>
  )
}

export default LinhaDocumento;