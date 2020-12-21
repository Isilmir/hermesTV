<template>
<div>
<img src="../assets/lazy-img.gif" id="loader" class="loader hidden"></img>
<h1 id="title">Тестируем генерацию печатной формы спутника</h1>
	<div class="main">
		<div class="entry-data">
		<label>Имя: </label><input type="text" v-model="name"><br><br>
		<label>Описание: </label><input type="text" v-model="description"><br><br>
		<label>Владелец: </label><input type="text" v-model="owner"><br><br>
		<label>Фотография: </label><input type="file" @change="sync"/><label style="color:red;">   {{img_error}}</label>
		</div>
		
			<img class="result-data" :src="res_src" ref="img"></img>
		
	</div>
	<div style="display:none" id="printform-wrapper">
	<br v-for="n in 100">
		<div id="printform">
			<div class="photo"><div class="photo-wrapper"><img
								
								class="image-uploader__image"
								ref="img"
								:src="src"
								:class="{
									   'with-info': showInfo && !isEmpty,
									'without-info': !showInfo || isEmpty
								}"
						></div></div>
			<div class="qr" id="qr"></div>
			<div class="name">{{name}}</div>
			<div class="desc">{{description}}</div>
			<div class="owner">Владелец: <br><br> {{owner}}</div>
			</div>
		</div>
		<!--<br><br>-->
	<!--<img :src="res_src" ref="img" height="50%"></img>-->
</div>
</template>

<script>
import PostsService from '@/services/PostsService'
import QrCreator from 'qr-creator';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
//console.log(jsPDF);
//QrScanner.WORKER_PATH = QrScannerWorkerPath;
export default {
  name: 'QRview',
  props: {
            // Filename
            value: {
                type: String,
                default: '',
                twoWay: true
            },
            // Pictures base directory
            srcPrefix: {
                type: String,
                default: '/static/',
            },
            // Component DOM id and name
            id: {
                type: String,
                default: 'picture'
            },
            // Show file info flag
            showInfo: {
                type: Boolean,
                default: false
            },
            // Clear flag
            allowClear: {
                type: Boolean,
                default: false
            }
        },
  data () {
    return {
      msg: 'Тестируем qr-scanner',
	  message:'',
	  result:'',
	  objects:[],
	  content:null,
	  name:'',
	  description:'',
	  res_content:null,
	  img_error:'',
	  owner:''
    }
  },
  async mounted(){
	//this.getMessage();
	//this.hasCamera=await QrScanner.hasCamera();
	//const videoElem = document.getElementById('videoElem');
	//console.log(videoElem)
	//const qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//qrScanner.start();
//	QrCreator.render({
//    text: '{"qr":"Это QR код!!!"}',
//    radius: 0.0, // 0.0 to 0.5
//    ecLevel: 'H', // L, M, Q, H
//    fill: '#000000', // foreground color
//    background: null, // color or null for transparent
//    size: 150 // in pixels.
//  }, document.querySelector('#qr-code'));
  //let loader = document.getElementById('loader');
  //loader.classList.toggle('hidden');
  //let objects = await PostsService.doGet('https://blooming-refuge-12227.herokuapp.com','/pg/get-objects');
  //loader.classList.toggle('hidden');
  //this.objects = objects.data.map(el=>{let obj=JSON.parse(el.qr);obj.active=el.active;return obj})
  //console.log(this.objects);
  
  },
  
  async updated(){
	  this.objects.map(el=>{
	console.log(JSON.stringify(el),'#'+el.objectType+'_'+el.id,document.querySelector('#'+el.objectType+'_'+el.id));
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
  computed:{
	isEmpty () {
                return !Boolean(this.value);
            },  
	events () {
                return {
                    IMAGE_CHANGED: 'image-changed'
                };
            },
	src () {
                if (this.content) {
					console.log('есть контент');
                    return this.content;
                }
				console.log('нет контента');
                return this.isEmpty
                        ? ''
                        : this.srcPrefix + this.value;
            },
	res_src () {
                if (this.res_content) {
					console.log('есть картинка');
                    return this.res_content;
                }
				console.log('нет картинки');
                return this.isEmpty
                        ? ''
                        : this.srcPrefix + this.value;
            },
	fileInfo () {
                if (this.isEmpty) {
                    return '';
                }
                let result = this.value;
                if (this.file instanceof File) {
                    result += "\n." + this.file.type.split('/')[1] + "\n"
                        + FileHelper.formatSize(this.file.size);
                }
                if (this.width > 0) {
                    result += "\n" + this.width + 'x' + this.height + 'px';
                }
                return result;
            },
	width () {
                return this.$refs.img
                        ? this.$refs.img.naturalWidth
                        : 0;
            },
	height () {
                return this.$refs.img
                        ? this.$refs.img.naturalHeight
                        : 0;
            },
  },
  methods:{
	sync (e) {
        e.preventDefault();
        this.selectImage(e.target.files[0]);
    },
	selectImage (file) {
         this.file = file;
	if(file.size>10000000){this.img_error='Размер файла превышает 10Мб!';console.log('Размер файла превышает 10Мб!');return;}
         let reader = new FileReader();
         reader.onload = this.onImageLoad;
         reader.readAsDataURL(file);
    },
	async onImageLoad (e) {
		//console.log(e.target.result)
        this.content = e.target.result;
        let filename = this.file instanceof File ? this.file.name : '';
        // Dispatch new input event with filename
        this.$emit('input', filename);
        // Dispatch new event with image content
        this.$emit('image-changed', this.content);
		//console.log(this.content,this.src)
		let qr = document.querySelector('.qr');
		//console.log(qr.firstChild)
		
		if(qr.firstChild)qr.removeChild(qr.firstChild);
		QrCreator.render({
			text: JSON.stringify({
				id:'123',
				objectType: 'player',
				name: this.name,
				owner: {id:'1234',name:this.owner}
			}),
			radius: 0.0, // 0.0 to 0.5
			ecLevel: 'M', // L, M, Q, H
			fill: '#000000', // foreground color
			background: null, // color or null for transparent
			size: 244 // in pixels
		  }, document.querySelector('.qr'));
		
		
	  let pdf = new jsPDF();
	  //console.log(document.getElementById('printform'));
	  //let screenshot= await html2canvas(document.getElementById('printform'));
	  //html2canvas(document.getElementById('printform')).then((form)=>console.log(form))
	  //let screenshot_dataurl = screenshot
	  //let url = screenshot.toDataURL();
	  //document.body.appendChild(screenshot);
	  //window.open(url, "_blank");
	  //console.log(url);
	  let loader = document.getElementById('loader');
	  loader.classList.toggle('hidden');
	  pdf.html(document.getElementById('printform'),{callback: async pdf=>{
																				//pdf.save("a4.pdf");
																				document.getElementById('printform-wrapper').style.display='block'
																				//console.log(document.getElementById('printform').style.display);
																				let screenshot= await html2canvas(document.getElementById('printform'));
																				//console.log(document.getElementById('printform').style.display);
																				document.getElementById('printform-wrapper').style.display='none'
																				let url = screenshot.toDataURL();
																				//console.log(url);
																				////console.log(url);
																				////document.body.appendChild(screenshot);
																				//////let iframe = `<iframe width='${screenshot.width}px' height='${screenshot.height}px' src='${url}'></iframe>`
																				//////let x = window.open();
																				//////x.document.open();
																				//////x.document.write(iframe);
																				//////x.document.close();
																				
																				this.res_content=url;
																				loader.classList.toggle('hidden');
																				//this.$emit('image-changed', this.res_content);
																				
																				//let doc = new jsPDF();
																				//doc.addImage(url,'PNG',0,0,screenshot.width,screenshot.height);
																				//console.log(doc.output('datauristring'));
																				//window.open(url, "_blank");
																				}});
	  //pdf.save("a4.pdf");
	  
	  
    },
	async getMessage(){
		const resp = await PostsService.doGet('http://192.168.0.181:8081/','test');
		this.message = resp.data;
	},
	dispatchInputEvents(filename, content) {
                // Dispatch new input event with new value
                this.$emit('input', filename);
                // Dispatch new event for parent with new image content
                this.$emit(this.events.IMAGE_CHANGED, content);
            },
	codeArrived (event) {
                console.log(event.detail[0]);
            }
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
#printform_backup{
	border: 1px solid black;
	width:1000px;
	height:1300px;
	display:grid;
	grid-template-rows: 4fr 256px 1fr 1fr;
	grid-template-columns: 2fr 256px;
}
#printform{
	border: 1px solid black;
	width:1000px;
	height:1300px;
	display:grid;
	grid-template-rows: 4fr 256px 1fr 1fr;
	grid-template-columns: 3fr 1fr 256px;
}
.photo{
	grid-column: 1 / 4;
	grid-row: 1 / 3;
	//background-color: #5599ff;
	border: 1px solid black;
	opacity:1;
	overflow: hidden;
	display:flex;
	justify-content: center;
}
.photo-wrapper{
	//width: 100%;
	height: 100%;
	display:flex;
	justify-content: center;
}
.qr{
	border: 6px solid white;
	grid-column: 3 / 4;
	grid-row: 2 / 3;
	background-color: #ffffff;
	opacity:1;
	z-index:100;
}
.name{
	grid-column: 1 / 4;
	grid-row: 3 / 4;
	//background-color: #aaff77;
	border: 1px solid black;
	opacity:1;
	font: bold 500% 'Comic Sans MS';
}
.desc{
	grid-column: 1 / 2;
	grid-row: 4 / 5;
	//background-color: #aa5500;
	border: 1px solid black;
	opacity:1;
	font: bold 150% 'Comic Sans MS';
}
.owner{
	grid-column: 2 / 4;
	grid-row: 4 / 5;
	//background-color: #aa5500;
	border: 1px solid black;
	opacity:1;
	font: bold 150% 'Comic Sans MS';
}
.image-uploader__image{
	//width: 100%;
	height:100%;
	z-index:-100;
	object-fit: cover;
}
#printform-wrapper{
	overflow: hidden;
}
.main{
	width:100%;
	height:50%;
	display:flex;
	justify-content: center;
	flex-wrap: wrap;
	//grid-template-rows: 1fr;
	//grid-template-columns: 1fr 1fr;
}
.entry-data{
    text-align:left;
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	margin: 25px;
}
.result-data{
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	height:50vh;
	margin: 25px;
}
</style>
