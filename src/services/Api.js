import axios from 'axios'

export default(host) => {
  return axios.create({
    baseURL: host,//`http://192.168.0.181:8081`//`http://localhost:8081`
	headers:{'Access-Control-Allow-Origin':'*'/*,'Origin':'host'*/}
  })
}