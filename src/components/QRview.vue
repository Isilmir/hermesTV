<template>
<div>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
	<h1>Тестируем генерацию QR-кода</h1>
	<!--<div id="qr-code"></div>
	<div style="display: flex; align-content: flex-start; align-items: flex-start;">result: {{ result }}</div>-->
	<div >
	<div v-for="object in objects" :key="object.objectType+'_'+object.id" style="display:inline-flex;  align-content: flex-start; align-items: flex-start; margin:50px; width:350px">
		<div style="display:flex">{{JSON.stringify(object,null,1)}}<br><b :style="object.active?`color:green;`:`color:red;`">{{object.active?`Активный`:`Неактивный`}}</b></div>
		<div  style="display:flex" :id="object.objectType+'_'+object.id"></div>
	</div>
</div>
	</div>
</template>

<script>
import QrCreator from 'qr-creator';
//QrScanner.WORKER_PATH = QrScannerWorkerPath;
import axios from 'axios'
export default {
  name: 'QRview',
  data () {
    return {
      msg: 'Тестируем qr-scanner',
	  message:'',
	  result:'',
	  objects:undefined
    }
  },
  async mounted(){
	//this.getMessage();
	//this.hasCamera=await QrScanner.hasCamera();
	//const videoElem = document.getElementById('videoElem');
	//console.log(videoElem)
	//const qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//qrScanner.start();
//QrCreator.render({
//  text: '{"qr":"Это QR код!!!"}',
//  radius: 0.0, // 0.0 to 0.5
//  ecLevel: 'H', // L, M, Q, H
//  fill: '#000000', // foreground color
//  background: null, // color or null for transparent
//  size: 150 // in pixels.
//}, document.querySelector('#qr-code'));
  let loader_ = document.getElementById('loader_');
  loader_.classList.toggle('hidden');
  const objects = await axios.get('https://blooming-refuge-12227.herokuapp.com/test',//'http://192.168.0.181:5000/test', 
		{
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
  //let objects = await PostsService.doGet('https://blooming-refuge-12227.herokuapp.com','/test');
  loader_.classList.toggle('hidden');
  this.objects = objects.data.map(el=>{let obj=JSON.parse(el.qr);obj.active=el.active;return obj})
  //console.log(this.objects);
  
  },
  
  async updated(){
	  this.objects.map(el=>{
	//console.log(JSON.stringify(el),'#'+el.objectType+'_'+el.id,document.querySelector('#'+el.objectType+'_'+el.id));
  QrCreator.render({
    text: JSON.stringify(el),
    radius: 0.0, // 0.0 to 0.5
    ecLevel: 'M', // L, M, Q, H
    fill: '#000000', // foreground color
    background: null, // color or null for transparent
    size: 128 // in pixels
  }, document.querySelector('#'+el.objectType+'_'+el.id));
  })
  },
  methods:{

  },
	  components:{
		//VueQrReader
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
