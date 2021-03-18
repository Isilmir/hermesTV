<template>
<div>
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
<h1 id="title">Информация о спутниках бойца</h1><br>
	<!--<div class="main">
		<div class="entry-data">
		<label>Имя: </label><input type="text" v-model="name"><br><br>
		<label>Описание: </label><input type="text" v-model="description"><br><br>-->
		<!--<label>Владелец: </label><input type="text" v-model="owner"><br><br>-->
		<!--<label>Фотография: </label><input type="file" @change="sync"/><label style="color:red;">   {{img_error}}</label>
		</div>
		
			<img class="result-data" :src="res_src" ref="img"></img>
		
	</div>-->
		<b-tabs v-model="activeTab" type="is-boxed">
			<b-tab-item :label="tab.label" v-for="tab in tabs" :key="tab.id" :disabled="tab.id=='new'&&tabs.length>maxSquadSize">
                <div class="main">
					<div class="entry-data">
					<label>Имя: </label><input type="text" v-model="tab.name" :disabled="tab.disabled"><br><br>
					<div v-if="!tab.isPlayer"><label>Описание: </label><input type="text" v-model="tab.description"  :disabled="tab.disabled"><br><br></div>
					<div v-if="tab.id!='new'"><label>Фотография: </label><input type="file" @change="sync($event,tab)"/><label style="color:red;">   {{img_error}}</label></div>
					<div v-if="tab.id=='new'"><b-button @click="addBJZI(tab)" :disabled="!tab.name||!tab.description">Добавить спутника</b-button></div>
					<div v-if="tab.id!='new'&&!tab.isPlayer&&tab.disabled"><br><b-button @click="tab.disabled=false">Изменить описание</b-button></div>
					<div v-if="tab.id!='new'&&!tab.isPlayer&&!tab.disabled"><br><b-button @click="updateBJZI(tab)">Сохранить изменение</b-button></div>
					</div>
					
						<img class="result-data" :src="tab.img_url" ref="img"></img>
						<img class="result-data_back" :src="tab.img_url_back" ref="img"></img>
					
				</div>
            </b-tab-item>
        </b-tabs>
		<div style="color:red;" v-if="sendError">При отправке письма произошла ошибка! <br>Попробуйте отправить еще раз. Если ошибка повторится, то просьба самостоятельно отправить сохраненный файл на почту hermes.tv.troy@gmail.com указав в теме "{{user.id}} {{user.name}}"</div>
<b-button @click="sendMail" :disabled="sendButtonDisable">Отправить список спутников в редакцию Гермес-ТВ</b-button>
	<div style="display:none" id="printform-wrapper">
	<!--<div id="printform-wrapper">-->
		<br v-for="n in 100">
		
		<div id="printform">
			<div class="photo"><div class="photo-wrapper"><img
								
								class="image-uploader___image"
								ref="img"
								:src="src"
								:class="{
									   'with-info': showInfo && !isEmpty,
									'without-info': !showInfo || isEmpty
								}"
						></div></div>
			<div class="qr " id="qr" ></div>
			<div class="qr_desc">{{qr_desc}}</div>
			<div class="name">{{name}}<br><span class="name_desc" v-if="isPlayer">герой</span><span class="name_desc" v-if="!isPlayer">спутник</span></div>
			<div class="dead">Мертв</div>
			<!--<div class="desc">{{description}}</div>-->
			<!--<div class="owner">Командир: <br> {{user.name}} <br>({{user.side.name}})</div>-->
		</div>
		<div id="printform_back">
			<div class="desc" v-if="isPlayer">Отряд: <br>{{user.squad.name}}</div>
			<div class="desc" v-if="!isPlayer">{{description}}</div>
			<div class="owner" v-if="isPlayer">Сторона: <br>{{user.side.name}}</div>
			<div class="owner" v-if="!isPlayer">Командир: <br> {{user.name}} <br>({{user.side.name}})</div>
		</div>
	</div>
		<!--<br><br>-->
	<!--<img :src="res_src" ref="img" height="50%"></img>-->
</div>
</template>

<script>
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import axios from 'axios'
import domtoimage from 'dom-to-image';

export default {
  name: 'printForm',
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
	  tabs:[],
	  content:null,
	  name:'',
	  isPlayer:null,
	  qr_desc:'',
	  description:'',
	  res_content:null,
	  res_content_back:null,
	  img_error:'',
	  owner:'',
	  user:JSON.parse(localStorage.getItem('user')),
	  activeTab: undefined,
      showBooks: false,
	  maxSquadSize: 11,
	  sendButtonDisable: false,
	  sendError:false
    }
  },
  async mounted(){
	console.log('user',this.user);
	
	this.loader_=document.getElementById('loader_');
	this.loader_.classList.toggle('hidden');
	const bjzi = await axios.get('https://blooming-refuge-12227.herokuapp.com/getBjzi',//'http://192.168.0.181:5000/getBjzi', 
		{
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
	
	//console.log(res);
	
	this.tabs=[{id:this.user.id,name:this.user.name,label:`${this.user.name} (Командир)`,disabled:true,isPlayer:true}];
	bjzi.data.map(el=>{this.tabs.push({id:el.id,name:el.name,label:el.name,description:el.description,disabled:true})})
//,{id:2,name:'Иван',label:'Иван',description:'друг детства',disabled:true}
this.tabs.push({id:'new',label:'+',disabled:false});
this.activeTab=0;
	this.loader_.classList.toggle('hidden');
  
  },
  
  async updated(){
  },
  computed:{
	isEmpty () {
                return true;//!Boolean(this.value);
            },  
	events () {
                return {
                    IMAGE_CHANGED: 'image-changed'
                };
            },
	src () {
                if (this.content) {
					//console.log('есть контент');
                    return this.content;
                }
				//console.log('нет контента');
                return '';//this.isEmpty
                        //? ''
                        //: '';//this.srcPrefix + this.value;
            },
	res_src () {
                if (tab.img_url/*this.res_content*/) {
					//console.log('есть картинка');
                    return tab.img_url;//this.res_content;
                }
				//console.log('нет картинки');
                return '';//this.isEmpty
                        //? ''
                        //: this.srcPrefix + this.value;
            },
	fileInfo () {
                if (this.isEmpty) {
                    return '';
                }
                let result = '';//this.value;
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
	sync (e,tab) {
		//console.log('sync',tab);
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
		//console.log('onImageLoad',e.target.result)
		//console.log('onImageLoad',this.tabs[this.activeTab])
		this.sendError=false;
		let tab=this.tabs[this.activeTab];
		this.name=tab.name;
		this.isPlayer=tab.isPlayer;
		this.qr_desc=`${tab.isPlayer?'player':'bjzi'} ${tab.id}`;
		this.description=tab.description;
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
				id:tab.id,
				objectType: tab.isPlayer?'player':'bjzi',
				name: tab.name,
				owner: {id:this.user.id,name:this.user.name}
			}),
			radius: 0.0, // 0.0 to 0.5
			ecLevel: 'M', // L, M, Q, H
			fill: '#000000', // foreground color
			background: null, // color or null for transparent
			size: 118//244 // in pixels
		  }, document.querySelector('.qr'));
		
	  this.loader_.classList.toggle('hidden');
	  
		// честное слово я не понимаю почему, но без этого setTimeout картинка в печатной форме не грузится
		await setTimeout(()=>{return;},0);
		document.getElementById('printform-wrapper').style.display='block';
		
		//обработка лицевой стороны
		let screenshot= await html2canvas(document.getElementById('printform')
			,{
			  scale:1
			}
		);
		
		let domtoimage_screenshot= await domtoimage.toPng(document.getElementById('printform'), { quality: 1 });
//document.getElementById('printform-wrapper').style.display='none';
		let url = screenshot.toDataURL();
		this.res_content=url;
		tab.img_url=domtoimage_screenshot;//url;
		tab.img_width=screenshot.width;
		tab.img_height=screenshot.height;
		this.$forceUpdate();
		//this.loader_.classList.toggle('hidden');
		
		//обработка обратной стороны
		let screenshot_back= await html2canvas(document.getElementById('printform_back')
			,{
			  scale:1
			}
		);
		
		let domtoimage_screenshot_back= await domtoimage.toPng(document.getElementById('printform_back'), { quality: 1 });
document.getElementById('printform-wrapper').style.display='none';
		let url_back = screenshot_back.toDataURL();
		this.res_content=url_back;
		tab.img_url_back=domtoimage_screenshot_back;//url;
		tab.img_width_back=screenshot_back.width;
		tab.img_height_back=screenshot_back.height;
		this.$forceUpdate();
		this.loader_.classList.toggle('hidden');
    },
	dispatchInputEvents(filename, content) {
                // Dispatch new input event with new value
                this.$emit('input', filename);
                // Dispatch new event for parent with new image content
                this.$emit(this.events.IMAGE_CHANGED, content);
            },
	codeArrived (event) {
                //console.log(event.detail[0]);
            },
	async sendMail(){
		this.sendError=false;
		this.sendButtonDisable=true;
		//console.log('sending mail');
		await setTimeout(()=>{/*document.getElementById('loader_')*/this.loader_.classList.toggle('hidden');},0)
		//let loader_ = document.getElementById('loader_');
		//loader_.classList.toggle('hidden');
		
		if(this.tabs.filter(el=>el.id!='new').some(el=>!el.img_url)){this.$buefy.toast.open({
					message: 'Фотографии загружены не для всех бойцов!',
					type: 'is-danger'
				})
			//document.getElementById('loader_')
			this.loader_.classList.toggle('hidden');
			this.sendButtonDisable=false;
			return;
		}

		let pdf = new jsPDF();
		
		let scale = 1;

		// добавляем игрока
		pdf.addImage(this.tabs.filter(el=>el.isPlayer)[0].img_url,'PNG',10,10,190*scale,this.tabs.filter(el=>el.isPlayer)[0].img_height/this.tabs.filter(el=>el.isPlayer)[0].img_width*190*scale,null,'SLOW');
		pdf.addPage();
		pdf.addImage(this.tabs.filter(el=>el.isPlayer)[0].img_url_back,'PNG',10,10,190*scale,this.tabs.filter(el=>el.isPlayer)[0].img_height_back/this.tabs.filter(el=>el.isPlayer)[0].img_width_back*190*scale,null,'SLOW');
		// добавляем спутников
		this.tabs.filter(el=>el.id!='new').filter(el=>!el.isPlayer)
		//.filter(el=>el.img_url)// только для дебага. удалить после использования
		.map(el=>{
																			pdf.addPage();
																			pdf.addImage(el.img_url,'PNG',10,10,190*scale,el.img_height/el.img_width*190*scale,null,'SLOW');
																			pdf.addPage();
																			pdf.addImage(el.img_url_back,'PNG',10,10,190*scale,el.img_height_back/el.img_width_back*190*scale,null,'SLOW');
																			})

		pdf.save(`${this.user.id}_${this.user.name}_printform.pdf`);

		// отправляем форму для пересылки по почте
	
		const blob = await fetch(pdf.output('datauristring')).then(res => res.blob());

		  const formData = new FormData();
		  formData.append('attach', blob, `${this.user.id}_${this.user.name}_printform.pdf`);
		  formData.append('userId', this.user.id);// взять userid из роута
			formData.append('userName', this.user.name);// взять username из роута

		  // Post the form, just make sure to set the 'Content-Type' header
		  let res;
		  
		try{ 
		res = await axios.post('https://blooming-refuge-12227.herokuapp.com/sendMail'//'http://192.168.0.181:5000/sendMail'
			, formData
			, {
			headers: {
			'Content-Type': 'multipart/form-data',
			'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')
			}`
			}
		});
		}catch(e){
			this.$buefy.toast.open({
					message: 'Ошибка при отправке письма!',
					type: 'is-danger'
				})
			this.sendError=true;
		}
		console.log(res);
		//loader_.classList.toggle('hidden');
		
		//document.getElementById('loader_')
		this.loader_.classList.toggle('hidden');
		this.sendButtonDisable=false;
	},
	async addBJZI(bjzi){
		//console.log(bjzi);
		this.loader_.classList.toggle('hidden');
		
		const res = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateBjzi'//'http://192.168.0.181:5000/setOrUpdateBjzi'
			,{
				id:null,
				name:bjzi.name,
				description:bjzi.description
			}, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		// заменить math.random на получение id созданного в базе спутника
		let id=res.data.id//Math.random()+'';
		this.tabs.splice(this.tabs.length-1,2,{id:id,name:bjzi.name,label:bjzi.name,description:bjzi.description,disabled:true},{id:'new',label:'+',disabled:false});
		//console.log(this.activeTab);
		//this.$forceUpdate();
		if(this.tabs.length>this.maxSquadSize){
			
			this.$buefy.toast.open({
                    message: 'Добавлено максимальное количество спутников',
                    type: 'is-success'
                })
			this.activeTab=0
		};
		this.loader_.classList.toggle('hidden');
		//this.$forceUpdate();
		//console.log(this.tabs);
	},
	async updateBJZI(bjzi){
		//console.log('сохраняем данные bjzi',bjzi);
		this.loader_.classList.toggle('hidden');
		const res = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateBjzi'//'http://192.168.0.181:5000/setOrUpdateBjzi'
			,{
				id:bjzi.id,
				name:bjzi.name,
				description:bjzi.description
			}, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		this.tabs.filter(el=>el.id==bjzi.id)[0].label=bjzi.name;
		this.tabs.filter(el=>el.id==bjzi.id)[0].disabled=true;
		this.loader_.classList.toggle('hidden');
	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@font-face{
	font-family:'B52';
	src: local('B52'),
		url(./../fonts/b52.ttf);
}

#title{
	//font-family:'B52';
	//font-size:150%;
}

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
	height:1414px;
	display:grid;
	grid-template-rows: 4fr 256px 1fr 1fr;
	grid-template-columns: 2fr 256px;
}
#printform_backup_2{
	//border: 1px dashed black;
	border:none;
	width:500px;
	//jfjf:500px;
	height:707px;
	//dfdfg:707px;
	display:grid;
	grid-template-rows: 4fr 128px 1fr 1fr;
	grid-template-columns: 3fr 1fr 128px;
}
#printform{
	border: 1px dashed black;
	//border:none;
	width:500px;
	//jfjf:500px;
	height:707px;
	//dfdfg:707px;
	display:grid;
	grid-template-rows: 64px 4fr 64px 64px 128px 12px 1fr;
	grid-template-columns: 64px 1fr 64px 64px;
}
#printform_back{
	border: 1px dashed black;
	//border:none;
	width:500px;
	//jfjf:500px;
	height:707px;
	//dfdfg:707px;
	display:grid;
	grid-template-rows: 1fr 6fr;
	grid-template-columns: 3fr 2fr;
}
.photo{
	grid-column: 1 / 5;
	grid-row: 1 / 5;
	//background-color: #5599ff;
	//border: 1px dashed black;
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
	//border: 3px dashed white;
	//border-bottom: 1px dashed black;
	border-left: 1px dashed black;
	border-top: 1px dashed black;
	//grid-column: 3 / 4;
	//grid-row: 2 / 3;
	padding-top:5px;
	grid-column: 3 / 5;
	grid-row: 5 / 6;
	background-color: #ffffff;
	opacity:1;
	z-index:100;
}
.name{
	grid-column: 1 / 3;
	grid-row: 5 / 7;
	//background-color: #aaff77;
	//border: 1px dashed black;
	border-bottom:1px dashed black;
	//border-left:1px dashed black;
	border-top:1px dashed black;
	opacity:1;
	//font: bold 100% 'Comic Sans MS';
	font-family:'B52';
	font-size:210%;
}
.qr_desc{
	grid-column: 3 / 5;
	grid-row: 6 / 7;
	border-top:none;
	border-left: 1px dashed black;
	border-bottom: 1px dashed black;
	//font-family:'B52';
	font-size:50%;
}
.dead{
	grid-column: 1 / 5;
	grid-row: 7 / 8;
	//background-color: #aaff77;
	//border: 1px dashed black;
	//border-bottom:1px dashed black;
	//border-left:1px dashed black;
	//border-right:1px dashed black;
	opacity:1;
	//font: bold 100% 'Comic Sans MS';
	font-family:'B52';
	font-size:300%;
	background-color:#ff0000;
	color:#000000;
	color:#000000;
}
.desc{
	grid-column: 1 / 2;
	grid-row: 1 / 2;
	//background-color: #aa5500;
	//border: 1px dashed black;
	//border-top:1px dashed black;
	//border-left:1px dashed black;
	border-bottom:1px dashed black;
	opacity:1;
	//font: bold 100% 'Comic Sans MS';
	font-family:'B52';
	font-size:120%;
}
.owner{
	grid-column: 2 / 4;
	grid-row: 1 / 2;
	//background-color: #aa5500;
	//border: 1px dashed black;
	//border-top:1px dashed black;
	border-left:1px dashed black;
	//border-right:1px dashed black;
	border-bottom:1px dashed black;
	opacity:1;
	//font: bold 100% 'Comic Sans MS';
	font-family:'B52';
	font-size:120%;
}
.name_desc{
	font-family:'B52';
	font-size:70%;
}
.image-uploader___image{
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
.result-data_back{
	//grid-column: 2 / 3;
	//grid-row: 1 / 2;
	height:50vh;
	margin: 25px;
}
</style>
