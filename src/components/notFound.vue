<template>
<div class="row">
	<div></div>
	<div style="text-align:left;">
		<div class="fourzerofour">404</div>
		<div>Увы, но такой страницы кажется не существует...</div>
	</div>
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'NotFound',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  user:'',
	  password:''
    }
  },
   async mounted(){
		console.log(localStorage);
		//console.log(this.$route,this.$router);
  },
  methods:{
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
.fourzerofour{
  font: 500% bold;
}
</style>
