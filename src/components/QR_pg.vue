<template>
<div>
	<img src="../assets/lazy-img.gif" id="loader" class="loader hidden"></img>
    <h1>{{ msg }}</h1>
	<h1>{{ message }}</h1>
	<video id="videoElem" style="height:40vh;"></video>
	<hr/>
	<input value="Сканировать" type="button" v-on:click="startScan"/>
	<input value="Активировать" type="button" v-on:click="activateObject"/>
	<input value="Деактивировать" type="button" v-on:click="deactivateObject"/>
	<div>QR: {{ qr }}</div>
	<div>hasCamera: {{ hasCamera }}</div>
	<div>result: {{ result }}</div>
	
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = QrScannerWorkerPath;
export default {
  name: 'QR',
  data () {
    return {
      msg: 'Тестируем qr-scanner',
	  message:'',
	  qr:'',
	  hasCamera:'',
	  qrScanner:null,
	  result:''
    }
  },
  async mounted(){
	this.hasCamera=await QrScanner.hasCamera();
	const videoElem = document.getElementById('videoElem');
	console.log(videoElem)
	//this.qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//this.qrScanner.start();
  },
  methods:{
	async startScan(action){
		this.qrScanner = new QrScanner(videoElem, async result => {
										this.qr = result;
										//console.log('decoded qr code:', result);
										this.qrScanner.stop();
										this.qrScanner.destroy();
										this.qrScanner = null;
										let resultJSON;
										try{
										resultJSON = JSON.parse(result);
										}catch(e){
											this.qr = 'Упс. Похоже QR-код битый((';
										}
										//console.log('decoded qr code:', resultJSON);
										if(resultJSON){
											if(action=='activate'){
												resultJSON.activationToggle=true;
												loader.classList.toggle('hidden');
												let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/pg/activation',resultJSON);
												loader.classList.toggle('hidden');
												this.result = actionRes.data;
											}else if(action=='deactivate'){
												resultJSON.activationToggle=false;
												loader.classList.toggle('hidden');
												let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/pg/activation',resultJSON);
												loader.classList.toggle('hidden');
												this.result = actionRes.data;
											}
											
										}
										});
		this.qrScanner.start();
	},
	async activateObject(){
		this.startScan('activate');
	},
	async deactivateObject(){this.startScan('deactivate');}
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
