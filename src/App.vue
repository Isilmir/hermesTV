<template>
  <div id="app">
    <!--<img src="./assets/logo.png">--><div class="header">{{user.name}} <a v-if="user.name!='Гость'" href="#" @click="logout">выйти</a></div>
    
<router-view/>
  </div>
</template>

<script>
//import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
export default {
  name: 'App',
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
			this.$router.push('/login')
		}
	},
	async mounted(){
		console.log('mounted',this.user.name)
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
</style>
<style lang="scss" scoped>

</style>
