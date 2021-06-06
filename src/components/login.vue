<template>
<div class="row">
	<div></div>
	<div style="text-align:left;">
		<h1>Авторизация</h1><br>
		<form>
			<label for="user">Логин</label>
			<input id="user" type="text" v-model="user" required autofocus /><br><br>
			<label for="password">Пароль</label>
			<input id="password" type="password" v-model="password" required /><br><br>
			<button type="submit" @click="handleSubmit">log in</button>
		</form>
	</div>
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  user:'',
	  password:''
    }
  },
   async mounted(){
		//console.log(localStorage);
		//console.log(this.$route,this.$router);
  },
  methods:{
	async handleSubmit(e){
		e.preventDefault();
		let loginRes
		try{
			loginRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com'//'https://blooming-refuge-12227.herokuapp.com'//'http://192.168.0.148:5000/'
												,'/login',{user:this.user,password:this.password});
		}catch(e){
			//console.log(e.statusCode,e.message);
			this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
			return;
		}
		if(loginRes.status==200){
			localStorage.setItem('user',JSON.stringify(loginRes.data.user));
			localStorage.setItem('jwt',JSON.stringify(loginRes.data.token));
		}
		console.log(loginRes.status,loginRes);
		if(localStorage.getItem('jwt')){
			this.$emit('loggedIn');
			if(this.$route.query.nextUrl){
				this.$router.push(this.$route.query.nextUrl)
			}else{
				this.$router.push('/')
			}
		}
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  //display: inline-block;
  margin: 0 10px;
  margin-bottom:20px;
}
a {
  color: #42b983;
}
.row{
  display: grid;
  grid-template-columns: 1fr 1fr  1fr;
}
</style>
