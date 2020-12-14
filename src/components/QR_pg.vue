<template>
<div>
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
	//this.getMessage();
	this.hasCamera=await QrScanner.hasCamera();
	const videoElem = document.getElementById('videoElem');
	console.log(videoElem)
	//this.qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//this.qrScanner.start();
  },
  methods:{
	async getMessage(){
		const resp = await PostsService.doGet('https://192.168.0.181:3000/','test');
		this.message = resp.data;
	},
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
												let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/pg/activation',resultJSON);
												this.result = actionRes.data;
											}else if(action=='deactivate'){
												resultJSON.activationToggle=false;
												let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/pg/activation',resultJSON);
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
