<template>
<div>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
    <h1>{{ msg }}</h1>
	<h1>{{ message }}</h1>
	
	<!--<video id="videoElem" style="height:40vh;"></video>-->
	<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
		<b-tab-item label="Персонажи">
			<b-tabs v-model="activeTabPersons" position="is-centered" vertical>
				<b-tab-item label="Передать спутника">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTransferSubject')" type="is-success">Герой, кому передаем</b-button>
							<div v-for="obj in transferSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTransferObject')" type="is-success">Спутник, которого передаем</b-button>
							<div v-for="obj in transferObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя передать</div>
								<!--<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
										<span v-if="obj.stateId==3" class="red">Герой уже был похоронен!</span>
										<span v-if="furnalSubject[0]&&obj.id==furnalSubject[0].id" class="red">Нельзя хоронить самого себя)</span>
									</div>
								</div>-->
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
										<span v-if="obj.utilized" class="red">Мертвого спутника нельзя передать!</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startTransfer" type="is-success" :disabled="!transferSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Провести похороны">
					<div class="innerTabWrap">
						<!--<input value="Сканировать" type="button" v-on:click="startScan('scanObject')"/>-->
						<!--<b-button @click="startScan('scanObject')" type="is-success">Сканировать</b-button>-->
						<!--<div>QR: {{ qr }}</div>-->
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalSubject')" type="is-success">Кто принес тело</b-button>
							<div v-for="obj in furnalSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalObject')" type="is-success">Чье тело хоронят</b-button>
							<div v-for="obj in furnalObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя похоронить</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
										<span v-if="obj.stateId==3" class="red">Герой уже был похоронен!</span>
										<span v-if="furnalSubject[0]&&obj.id==furnalSubject[0].id" class="red">Нельзя хоронить самого себя)</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
										<span v-if="obj.utilized" class="red">Спутник уже был похоронен!</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startFuneral" type="is-success" :disabled="!funeralSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Отметить полученное подкрепление">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectReinforcementCheckSubject')" type="is-success">Герой, получивший подкрепление</b-button>
							<div v-for="obj in reinforcementCheckSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startReinforcementCheck" type="is-success" :disabled="!reinforcementCheckSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Видимость персонажа">
					<div class="innerTab">
						<!--<input value="Активировать" type="button" v-on:click="startScan('activateObject')"/>
						<input value="Деактивировать" type="button" v-on:click="startScan('deactivateObject')"/>-->
						<b-button @click="startScan('activateObject')" type="is-success">Сделать видимым</b-button>
						<b-button @click="startScan('deactivateObject')" type="is-danger">Сделать невидимым</b-button>
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
								<div class="innerTabRow"><span class="innerTabRowPropName">Сторона:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span></div>
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
	  furnalObject:[],
	  transferSubject:[],
	  transferObject:[],
	  reinforcementCheckSubject:[]
    }
  },
  computed: {
        funeralSubmit() {
            return this.furnalSubject[0]&&this.furnalObject[0]&&!this.furnalObject[0].utilized&&this.furnalObject[0].stateId!=3&&this.furnalSubject[0].id!=this.furnalObject[0].id
        },
		transferSubmit() {
            return this.transferSubject[0]&&this.transferObject[0]&&!this.transferObject[0].utilized
        },
		reinforcementCheckSubmit() {
            return this.reinforcementCheckSubject[0]
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
				//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
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
		let actionRes
		try{
		actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,obj, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		}catch(e){
			this.loader_.classList.toggle('hidden');
			console.log(e.message);
			//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
			}
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
		let actionRes 
		try{
		actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,obj, {
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		}catch(e){
			this.loader_.classList.toggle('hidden');
			console.log(e.message);
			//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
			}
		
		
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
			case 'bjzi':
				this.furnalSubject.push(await this.getBjziSingle(obj.id));
				break;
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
	async selectTransferSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.transferSubject=[];
		switch(obj.objectType){
			case 'player':
				this.transferSubject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.transferSubject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.transferSubject.push({objectType:'none'});
		}
		console.log('transferSubject',this.transferSubject);
		return;
	},
	async selectTransferObject(obj){
		//this.qr = JSON.stringify(obj);
		this.transferObject=[];
		switch(obj.objectType){
			case 'bjzi':
				this.transferObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.transferObject.push({objectType:'none'});
		}
		console.log('transferObject',this.transferObject);
		return;
	},
	async selectReinforcementCheckSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.reinforcementCheckSubject=[];
		switch(obj.objectType){
			case 'player':
				this.reinforcementCheckSubject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.reinforcementCheckSubject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.transferObject.push({objectType:'none'});
		}
		console.log('transferObject',this.transferObject);
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
			//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
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
				//console.log(e.response);
					if(e.response){
						if(e.response.status==403){
							localStorage.removeItem('jwt');
							localStorage.removeItem('user');
							this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
						}
					}
				this.$buefy.toast.open({
						message: `${e.response?e.response.data:e.message}`,
						type: 'is-danger'
					});
			}
			this.loader_.classList.toggle('hidden');
			//console.log(response.data[0]);
			return response.data[0];
	},
	async startFuneral(){
		this.loader_.classList.toggle('hidden');
		console.log('Проводим похороны',{SUBJECT:{id:this.furnalSubject[0].id,type:this.furnalSubject[0].objectType},OBJECT:{id:this.furnalObject[0].id,type:this.furnalObject[0].objectType}});
		
		// 1. Добавить деяние субъекту
		// 2. Перевести объект в мертвое состояние
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeFuneral',{
						SUBJECT:{
							id:this.furnalSubject[0].id,
							type:this.furnalSubject[0].objectType
						},
						OBJECT:{
							id:this.furnalObject[0].id,
							type:this.furnalObject[0].objectType
						}
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Похороны успешно проведены`,
                    type: 'is-success'
        })
		this.furnalObject=[];
	},
	async startTransfer(){
		this.loader_.classList.toggle('hidden');
		console.log('Передаем спутника',{SUBJECT:{id:this.transferSubject[0].id,type:this.transferSubject[0].objectType},OBJECT:{id:this.transferObject[0].id,type:this.transferObject[0].objectType}});
		
		// 1. Добавить деяние субъекту
		// 2. Перевести объект в мертвое состояние
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeBjziTransfer',{
						SUBJECT:{
							id:this.transferSubject[0].id,
							type:this.transferSubject[0].objectType
						},
						OBJECT:{
							id:this.transferObject[0].id,
							type:this.transferObject[0].objectType
						}
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Спутник успешно передан`,
                    type: 'is-success'
        })
		this.transferObject=[];
	},
	async startReinforcementCheck(){
		this.loader_.classList.toggle('hidden');
		console.log('Отмечаем полученное подкрепление',this.reinforcementCheckSubject);
		let playerId;
		switch(this.reinforcementCheckSubject[0].objectType){
			case 'player':
				playerId = this.reinforcementCheckSubject[0].id;
				break;
			case 'bjzi':
				playerId = this.reinforcementCheckSubject[0].playerId;
				break;
		}
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeReinforcementsArrived',{
						playerId:playerId
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Получение подкрепления подтверждено`,
                    type: 'is-success'
        })
		this.reinforcementCheckSubject=[];
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
	border: 1px solid black;
	border-radius: 5px 15px;
	padding:5px;
	margin:5px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items:center;
}
.innerTabFurnal{
	display:flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items:flex-start;
}
.red{
	color:red;
}
</style>
