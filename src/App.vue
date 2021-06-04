<template>
  <div id="app">
    <!--<img src="./assets/logo.png">--><div class="header">{{user.name}} <a v-if="user.name!='Гость'" href="#" @click="logout">выйти</a></div>
    
<router-view style="height:100%" v-bind:cert="cert"/>

  </div>
</template>

<script>
//import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import jwt from 'jsonwebtoken'
export default {
  name: 'App',
  props:['cert'],
  data () {
    return {
	  user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):{name:'Гость'}
    }
  },
	methods:{
		logout(){
			console.log('выходим');
			localStorage.removeItem('jwt');
			localStorage.removeItem('user');
			this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
		}
	},
	async mounted(){
		console.log('mounted',this.user.name)
		//console.log(jwt.verify(localStorage.getItem('jwt').replace(/"/g,''),this.cert,{ algorithms: ['RS256'] }))
		//console.log('путь',this.$route)
	},
	async beforeUpdate(){
		//console.log('beforeUpdate',this.user.name,localStorage.getItem('user'))
		this.user=localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):{name:'Гость'}
	},
	async updated(){
		//console.log('updated',this.user.name,localStorage.getItem('user'))
	}//,
//	  components:{
//		Buefy
//	  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  //margin-top: 60px;
  display:block;
  //width:50%;
  height:100%;
}
html{
	height:100%;
}
body{
	height:100%;
}
.loader_{
	position: fixed;
	top: 50%;
	left: 47.5%;
	width: 5%;
	z-index:100;
}
.header{
	text-align: right;
}
.hidden{
	display: none
}
.node-label{
	//font-size:100%;
	font: 110% fantasy;
}
</style>

