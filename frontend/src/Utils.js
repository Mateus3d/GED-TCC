module.exports = {
  parseJwt() {
    const token = localStorage.getItem('jwt')
    // console.log(token)
    if (!token) {
      console.log('Nada no token')
      return undefined;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  },
  parseRawJwt(token) {
    // console.log(token)
    if (!token) {
      console.log('Nada no token 2')
      return undefined;
    }
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64));
  }


}
