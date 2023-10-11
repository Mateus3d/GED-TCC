import React, {createContext, useState, useEffect} from "react";
import api from "../services/api";

const Context = createContext()

function AuthProvider({children}) {
  const [authenticated, setAuthenticated] = useState(false) 
  const [loading, setLoading] = useState(true)
  // const history = useHistory()
  useEffect(()=>{
    const token = localStorage.getItem('jwt')

    if (token) {
      api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
      setAuthenticated(true)
    }

    setLoading(false)
  },[])
  
  /*async function handleLogin(data) {
    api.post('/login', data)
        .then((response) => {
          alert('Bem vindo!')
          // localStorage.setItem('user', response.data.id)
          console.log(response.data) //Aqui tem o id e adm =true ou false
          const isAdm = utils.parseJwt(response.data.token).adm
          const jwt = response.data.token
          localStorage.setItem('jwt', JSON.stringify(jwt))
          setAuthenticated(true)
          console.log('Autenticado:', authenticated)
          api.defaults.headers.Authorization = `Bearer ${jwt}`
          setLoading(false)
          if (isAdm){
            history.push('/menu')
          } else {
            history.push('/documentos')
          }
          
        })
        .catch(e => {
          setAuthenticated(false)
          console.log('Autenticado:', authenticated)
          alert('Usuário ou senha incorretos!')
          setLoading(false)
        })*/
  // }
  
  return (
    <Context.Provider value={{loading, authenticated, setAuthenticated, setLoading/*handleLogin*/}}>
      {children}
    </Context.Provider>
  )
}

export { Context, AuthProvider }