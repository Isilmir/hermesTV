<template>
<div>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
    <h1>{{ msg }}</h1>
	<h1>{{ message }}</h1>
	
	<!--<video id="videoElem" style="height:40vh;"></video>-->
	<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
		<b-tab-item label="Персонажи">
			<b-tabs v-model="activeTabPersons" position="is-centered" vertical>
				<b-tab-item label="Сдать тело">
					<div class="innerTabWrap">
						<!--<input value="Сканировать" type="button" v-on:click="startScan('scanObject')"/>-->
						<!--<b-button @click="startScan('scanObject')" type="is-success">Сканировать</b-button>-->
						<!--<div>QR: {{ qr }}</div>-->
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalSubject')" type="is-success">Кто сдает</b-button>
							<div v-for="obj in furnalSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabRow">
										<span class="innerTabRowPropName">Герой:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span>
										<span class="innerTabRowPropVal">{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalObject')" type="is-success">Кого сдает</b-button>
							<div v-for="obj in furnalObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя похоронить</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabRow">
										<span class="innerTabRowPropName">Герой:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span>
										<span class="innerTabRowPropVal">{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabRow">
										<span class="innerTabRowPropName">Спутник:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span>
										<span class="innerTabRowPropVal">{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter"><b-button @click="" type="is-success">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Активировать объект">
					<div class="innerTab">
						<!--<input value="Активировать" type="button" v-on:click="startScan('activateObject')"/>
						<input value="Деактивировать" type="button" v-on:click="startScan('deactivateObject')"/>-->
						<b-button @click="startScan('activateObject')" type="is-success">Активировать</b-button>
						<b-button @click="startScan('deactivateObject')" type="is-danger">Деактивировать</b-button>
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div>result: {{ result }}</div>
					</div>
				</b-tab-item>
			</b-tabs>
		</b-tab-item>
		<b-tab-item label="Общее">
			<b-tabs v-model="activeTabCustom" position="is-centered" vertical>
				<b-tab-item label="Информация по объекту">
					<div class="innerTab">
						<!--<input value="Сканировать" type="button" v-on:click="startScan('scanObject')"/>-->
						<b-button @click="startScan('scanObject')" type="is-success">Сканировать</b-button>
						<!--<div>QR: {{ qr }}</div>-->
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div v-for="obj in scannedObject">
							<div class="innerTab" v-if="obj.objectType=='none'">Увы такого типа объектов не существует</div>
							<div class="innerTab" v-if="obj.objectType=='player'">
								<hr>
								<b>Герой</b> 
								<div class="innerTabRow"><span class="innerTabRowPropName">Id:</span> <span class="innerTabRowPropVal"> {{obj.id}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Имя:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Статус:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='states')[0].data.filter(el=>el.id==obj.stateId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Отряд:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='squads')[0].data.filter(el=>el.id==obj.squadId)[0].name}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Сторона:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Слава:</span> <span class="innerTabRowPropVal"> {{obj.honor}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Видимый:</span> <span class="innerTabRowPropVal"> {{obj.active?'Да':'Нет'}}</span></div>
							</div>
							<div class="innerTab" v-if="obj.objectType=='bjzi'">
								<hr>
								<b>Спутник</b> 
								<div class="innerTabRow"><span class="innerTabRowPropName">Id:</span> <span class="innerTabRowPropVal"> {{obj.id}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Имя:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Статус:</span> <span class="innerTabRowPropVal"> {{obj.utilized?'Мертв':'Жив'}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Канал поступления:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='bjziChannelTypes')[0].data.filter(el=>el.id==obj.bjziChannelTypeId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Похороны:</span> <span class="innerTabRowPropVal"> {{obj.deathCaseId?dictionaries.filter(el=>el.dict=='deathCaseTypes')[0].data.filter(el=>el.id==obj.deathCaseId)[0]:'-'}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Командир:</span> <span class="innerTabRowPropVal"> {{obj.playerName}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Сторона:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span></div>
							</div>
						</div>
					</div>
				</b-tab-item>
			</b-tabs>
		</b-tab-item>
	</b-tabs>
	<b-modal v-model="scannerActive" @close="onCloseModal">
            
                <video id="videoElem" style="height:90vh;"></video>
            
        </b-modal>
</div>
</template>

<script>
//import PostsService from '@/services/PostsService'
import axios from 'axios'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js';
QrScanner.WORKER_PATH = QrScannerWorkerPath;
export default {
  name: 'QR',
  data () {
    return {
      msg: 'QR-scanner',
	  message:'',
	  qr:'',
	  hasCamera:'',
	  qrScanner:null,
	  result:'',
	  scannerActive:false,
	  activeTab: undefined,
	  activeTabPersons: undefined,
	  activeTabCustom:undefined,
	  dictionaries:[{dict:'sides',data:[{description:''}]},{dict:'squads',data:[{name:''}]}],
	  scannedObject:[],
	  furnalSubject:[],
	  furnalObject:[]
    }
  },
  async mounted(){
	this.hasCamera=await QrScanner.hasCamera();
	this.loader_=document.getElementById('loader_');
	await this.fetchDictionaries();
	console.log(this.dictionaries)
	//const videoElem = document.getElementById('videoElem');
	//console.log(videoElem)
	//this.qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//this.qrScanner.start();
  },
  methods:{
	async startScan(action){
		this.scannerActive=true;
		await setTimeout(()=>{return;},0);
		const videoElem = document.getElementById('videoElem');
		this.qrScanner = new QrScanner(videoElem, async result => {
										//console.log(videoElem);
										//this.qr = result;
										//console.log('decoded qr code:', result);
										this.qrScanner.stop();
										this.qrScanner.destroy();
										this.qrScanner = null;
										let resultJSON;
										try{
										resultJSON = JSON.parse(result);
										}catch(e){
											this.qr = 'Упс. Похоже QR-код битый((';
											this.$buefy.toast.open({
												message: `Упс. Похоже QR-код битый((`,
												type: 'is-danger'
											})
											return;
										}
										await this[action](resultJSON);
										/*
										//console.log('decoded qr code:', resultJSON);
										if(resultJSON){
											if(action=='activate'){
												resultJSON.activationToggle=true;
												loader_.classList.toggle('hidden');
												let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
													,resultJSON, {
													headers: {
													  'Content-Type': 'application/json',
													  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
													}
												});
												//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
												loader_.classList.toggle('hidden');
												this.result = actionRes.data;
											}else if(action=='deactivate'){
												resultJSON.activationToggle=false;
												loader_.classList.toggle('hidden');
												let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
													,resultJSON, {
													headers: {
													  'Content-Type': 'application/json',
													  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
													}
												});
												//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
												loader_.classList.toggle('hidden');
												this.result = actionRes.data;
											}
											
										}
										*/
										this.scannerActive=false;

										});
		this.qrScanner.start();
	}
	,async fetchDictionaries(){
			this.loader_.classList.toggle('hidden');
			let dictionaries;
			try{
			dictionaries = await axios.post('https://blooming-refuge-12227.herokuapp.com/getDictionaries',{
						"dicts":[]
				},
				{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
				console.log(e.message);
			}
			//console.log(players.data);
			this.dictionaries=dictionaries.data;
			this.loader_.classList.toggle('hidden');
			//console.log ('dictionaries',this.dictionaries);
		},
	async scanObject(obj){
		this.qr = JSON.stringify(obj);
		this.scannedObject=[];
		switch(obj.objectType){
			case 'player':
				this.scannedObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.scannedObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.scannedObject.push({objectType:'none'});
		}
		console.log(this.scannedObject);
		return;
	},
	async activateObject(obj){
		//this.startScan('activate');
		this.$buefy.toast.open({
                    message: `Активируем объект: ${JSON.stringify(obj)}`,
                    type: 'is-danger'
                })
		obj.activationToggle=true;
		this.loader_.classList.toggle('hidden');
		let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,obj, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
		this.loader_.classList.toggle('hidden');
		this.result = actionRes.data;
	},
	async deactivateObject(obj){
		//this.startScan('deactivate');
		this.$buefy.toast.open({
                    message: `Деактивируем объект: ${JSON.stringify(obj)}`,
                    type: 'is-danger'
                })
		obj.activationToggle=false;
		this.loader_.classList.toggle('hidden');
		let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,obj, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
		this.loader_.classList.toggle('hidden');
		this.result = actionRes.data;
	},
	async selectFurnalSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.furnalSubject=[];
		switch(obj.objectType){
			case 'player':
				this.furnalSubject.push(await this.getPlayer(obj.id));
				break;
			//case 'bjzi':
			//	this.furnalSubject.push(await this.getBjziSingle(obj.id));
			//	break;
			default:
				this.furnalSubject.push({objectType:'none'});
		}
		console.log(this.furnalSubject);
		return;
	},
	async selectFurnalObject(obj){
		//this.qr = JSON.stringify(obj);
		this.furnalObject=[];
		switch(obj.objectType){
			case 'player':
				this.furnalObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.furnalObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.furnalObject.push({objectType:'none'});
		}
		console.log(this.furnalObject);
		return;
	},
	async onCloseModal(){
		if(this.qrScanner){
			this.qrScanner.stop();
			this.qrScanner.destroy();
			this.qrScanner = null;
		}
	},
	async getPlayer(id){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/players/${id}`,
			{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
			this.loader_.classList.toggle('hidden');
			console.log(e.message);
			}
			this.loader_.classList.toggle('hidden');
			//console.log(response);
			return response.data[0];
	},
	async getBjziSingle(id){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/bjzi/${id}`,
			{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
			this.loader_.classList.toggle('hidden');
			console.log(e.message);
			}
			this.loader_.classList.toggle('hidden');
			//console.log(response.data[0]);
			return response.data[0];
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
.innerTab{
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items:center;
}
.innerTabRow{
	padding:10px;
	display:flex;
	justify-content: space-between;
	align-items:center;
	width: 100%
}
.innerTabRowPropName{
	display:flex;
	width: 50%;
	justify-content: flex-start;
	margin-right:20px;
}
.innerTabRowPropVal{
	display:flex;
	width: 50%;
	justify-content: flex-end;
	flex-wrap:wrap;
}
.innerTabWrap{
	padding:10px;
	display:flex;
	flex-wrap:wrap;
	justify-content: flex-start;
}
.innerTabCenter{
	padding:10px;
	display:flex;
	flex-direction: column;
	justify-content: center;
	align-items:center;
}
</style>
