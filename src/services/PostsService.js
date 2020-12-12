import Api from '@/services/Api'

export default {
  fetchPosts (host,path) {
    return Api(host/*`http://192.168.135.98:8081`*/).get(path/*'posts'*/)
  },
  
  doPost (host,path,params) {
	return Api(host).post(path,params)
  },
  
  doGet (host,path) {
	return Api(host).get(path)
  }
}