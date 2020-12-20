<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.loader{
	position: fixed;
	top: 50%;
	left: 47.5%;
	width: 5%;
	z-index:100;
}
.hidden{
	display: none
}
</style>
<style lang="scss" scoped>

</style>
