<template>
<div>
    <h1>{{ msg }}</h1>
	<h1>{{ message }}</h1>
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'test',
  data () {
    return {
      msg: 'Тестируем vue',
	  message:''
    }
  },
  mounted(){
	this.getMessage();
  },
  methods:{
	async getMessage(){
		const resp = await PostsService.doGet('http://192.168.0.181:8081/','test');
		this.message = resp.data;
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
