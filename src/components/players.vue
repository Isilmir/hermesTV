<template>
<div>
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
Управление персонажами<br><br>

<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">

<!--Персонажи-->

<b-tab-item label="Персонажи">
<b-collapse
            class="card"
            animation="slide"
            v-for="(player, index) of players"
            :key="index"
            :open="isOpenPlayer == index"
            @open="showPlayer(player,index)" 
			style="overflow:visible;">
            <template #trigger="props">
                <div
                    class="card-header"
                    role="button"
                >
                    <p class="card-header-title" style="display:flex;justify-content:space-between">
                        {{ player.name }} ({{player.sideDescription}})<!--<router-link :to="`/graph?id=${player.id}&type=${player.objectType}&deep=${deep}`" target="_blank">посмотреть граф</router-link>-->
						<span><span :class="`isactive ${player.active?'green':'red'}`">{{player.active?'Видимый':'Невидимый'}}</span> Слава: {{player.honor}}</span>
                    </p>
                    <a class="card-header-icon">
                        <b-icon
                            :icon="props.open ? 'menu-down' : 'menu-up'">
                        </b-icon>
                    </a>
                </div>
            </template>
            <div class="card-content">
                <div class="content">
                    <div v-if="isOpenPlayer == index" v-for="curPlayer in currentPlayer">
						<b-switch v-model="curPlayer.active" @input="playerActivation(curPlayer)">{{ curPlayer.active?`Видимый`:`Невидимый` }}</b-switch>
						<b-tabs type="is-boxed" position="is-left">
							<b-tab-item label="Деяния">
							<b-field label="Всего славы у персонажа" position="is-right"><span style="font-size:200%">{{curPlayer.honor}}</span></b-field><hr>
								<div class="player-deeds">
									<!--<div class="player_stories">
											<b-field label="Сюжеты в которых участвует персонаж">
										</b-field>
											<div class="player_in_story" v-for="(story,storyIndex) in curPlayer.stories" :key="story.id" style="display:flex;justify-content: space-around;">
											<b-input v-model="curPlayer.stories[storyIndex].name" maxlength="255" disabled></b-input> →
											<b-input v-model="curPlayer.stories[storyIndex].description" maxlength="255" disabled></b-input>
											</div>
									</div>-->
									<div class="player_deeds_list">
										<!--<b-field label="Связь с другими персонажами" v-if="curPlayer.deeds.length>0">
										</b-field>-->
										
											<div class="" style="display:flex;justify-content: space-around;">
												<b-field label="Тип деяния"></b-field>
												<b-field label="Дата"></b-field>
												<b-field label="Время"></b-field>
												<b-field label="Описание деяния"></b-field>
												<b-field label="Слава"></b-field>
												<b-field label=" "></b-field>
												<!--<b-button @click="deleteLink({id:curPlayer.id,type:curPlayer.objectType},{id:deed.id,type:deed.objectType},player)" type="is-danger">🞪</b-button>-->
											</div>
											<div class="" v-for="(deed,deedIndex) in curPlayer.deeds" :key="deed.id" style="display:flex;justify-content: space-around;">
												<b-input v-model="curPlayer.deeds[deedIndex].type.description" maxlength="255" disabled></b-input>
												<b-input :value="curPlayer.deeds[deedIndex].date.match(/\d\d\d\d-\d\d-\d\d/)[0]" maxlength="255" placeholder="Дата начисления" disabled></b-input>
												<b-input :value="curPlayer.deeds[deedIndex].date.match(/\d\d:\d\d:\d\d/)[0]" maxlength="255" placeholder="Дата начисления" disabled></b-input>
												<b-input v-model="curPlayer.deeds[deedIndex].description" maxlength="255" placeholder="Описание деяния" ></b-input>
												<!--<textarea class="story_textarea" v-model="curPlayer.deeds[deedIndex].description"></textarea>-->
												<b-input  v-model="curPlayer.deeds[deedIndex].honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
												<b-button @click="updateDeed(curPlayer,{id:deed.id,type:deed.objectType,description:deed.description,type:deed.type,honor:deed.honor})" type="is-success">✔</b-button>
												<b-button @click="deleteDeed(curPlayer,{id:deed.id,type:deed.objectType,description:deed.description,type:deed.type,honor:deed.honor})" type="is-danger">☓</b-button>
											</div>
										<b-field label="Добавить деяние">
										</b-field>
										<div class="" style="display:flex;justify-content: space-around;">
											<b-autocomplete
												v-model="newDeedName"
												placeholder="Начните вводить тип деяния"
												:keep-first="false"
												:open-on-focus="true"
												:data="filteredDeedTypes"
												field="description"
												@select="option => {newDeed.type = option;newDeed.honor = option.defaultHonor;console.log(newDeed)}"
												:clearable="true"
												style="min-width:400px"
											>
											<!--addLink({id:curPlayer.id,objectType:curPlayer.objectType},{id:option.id,objectType:option.objectType},'',player);-->
											</b-autocomplete>
											<b-input v-model="newDeed.description" maxlength="255" placeholder="Описание деяния" style="min-width:400px"></b-input>
											<b-input v-model="newDeed.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
											<b-button @click="addDeed(curPlayer,newDeed)" type="is-success">✔</b-button>
										</div>
									</div>
								</div>
							</b-tab-item>
							<!--<b-tab-item label="Ресурсы">
								Тут будут ресурсы персонажа
							</b-tab-item>-->
						</b-tabs>
					</div>
                </div>
            </div>
        </b-collapse>

</b-tab-item>
<b-tab-item label="Массовое начисление славы">
	<div class="deeds_mass_add ">
		<div class="deeds_mass_add_content deeds_mass_add_players">
			<!--<b-field :label="player.name" v-for="player in mass_players_deed.players" :key="player.id"><span class="red delete-button">☓</span></b-field>-->
			<!--<div :label="player.name" v-for="player in mass_players_deed.players" :key="player.id">{{player.name}} <span class="red delete-button" @click="removePlayer(player)">☓</span></div><hr>-->
			<b-field label="Добавить персонажа"></b-field>
			<b-autocomplete
				v-model="newPlayerName"
				placeholder="Начните вводить имя персонажа"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredPlayers"
				field="name"
				@input="option => {console.log(newPlayerName,option,filteredPlayers)}"ИГРОТЕХНИКА
				@select="option => {mass_players_deed.players.push({name:option.name,id:option.id});console.log('!!!',option);}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete><br>
			<b-field label="Добавить всех персонажей стороны"></b-field>
			<b-autocomplete
				v-model="sideName"
				placeholder="Начните вводить название стороны"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredSides"
				field="description"
				@input="option => {console.log(sideName,option,filteredSides)}"
				@select="option => {mass_players_deed.players = mass_players_deed.players.concat(players.filter(el=>el.sideId==option.id&&mass_players_deed.players.filter(ell=>ell.id==el.id).length==0).map(el=>{return {name:el.name,id:el.id}}));console.log('Добавление стороны',players.filter(el=>el.sideId==option.id).map(el=>{return {name:el.name,id:el.id}}));}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete><br>
			<b-field label="Добавить всех персонажей отряда"></b-field>
			<b-autocomplete
				v-model="squadName"
				placeholder="Начните вводить название отряда"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredSquads"
				field="name"
				@input="option => {console.log(sideName,option,filteredSides)}"
				@select="option => {mass_players_deed.players = mass_players_deed.players.concat(players.filter(el=>el.squadId==option.id&&mass_players_deed.players.filter(ell=>ell.id==el.id).length==0).map(el=>{return {name:el.name,id:el.id}}));console.log('Добавление стороны',players.filter(el=>el.sideId==option.id).map(el=>{return {name:el.name,id:el.id}}));}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete><hr>
			<div :label="player.name" v-for="player in mass_players_deed.players" :key="player.id">{{player.name}} <span class="red delete-button" @click="removePlayer(player)">☓</span></div>
		</div>
		<div class="deeds_mass_add_content deeds_mass_add_type">
			<b-autocomplete
												v-model="newDeedName_mass"
												placeholder="Начните вводить тип деяния"
												:keep-first="false"
												:open-on-focus="true"
												:data="filteredDeedTypes_mass"
												field="description"
												@input="option => {console.log(newDeedName_mass,option,filteredDeedTypes_mass)}"
												@select="option => {mass_players_deed.type = option;mass_players_deed.honor = option.defaultHonor;console.log(option);}"
												:clearable="true"
												style="min-width:10px"
											></b-autocomplete><br>
											<b-input v-model="mass_players_deed.description" maxlength="255" placeholder="Описание деяния" style="min-width:10px"></b-input>
											<b-input v-model="mass_players_deed.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
		</div>
		<!--<div class="deeds_mass_add_content deeds_mass_add_description">
			<b-input v-model="mass_players_deed.description" maxlength="255" placeholder="Описание деяния" style="min-width:10px"></b-input>
		</div>-->
		<div class="deeds_mass_add_content deeds_mass_add_honor">
			<!--<b-input v-model="mass_players_deed.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>-->
			<b-button @click="addMassDeed(mass_players_deed)" type="is-success" style="max-width:100px">✔</b-button>
			<b-button v-if="mass_players_deed.type||mass_players_deed.description||mass_players_deed.honor||mass_players_deed.players.length>0" @click="mass_players_deed={type:'',description:'',honor:'',players:[]};newPlayerName='';newDeedName_mass=''" type="is-warning" style="max-width:100px">Сбросить</b-button>
		</div>
	</div>
</b-tab-item>
<b-tab-item label="Типы Деяний">
	<div class="" style="display:flex;justify-content: space-around;">
		<b-field label="Код"></b-field>
		<b-field label="Тип деяния"></b-field>
		<b-field label="Славы по умолчанию"></b-field>
		<b-field label="Видимость"></b-field>
		<!--<b-field label="   "></b-field>-->
		<!--<b-button @click="deleteLink({id:curPlayer.id,type:curPlayer.objectType},{id:deed.id,type:deed.objectType},player)" type="is-danger">🞪</b-button>-->
	</div>
	<div class="" v-for="(deed,deedIndex) in deedTypes" :key="deed.id" style="display:flex;justify-content: space-around;">
		<b-input v-model="deed.name" maxlength="255" disabled></b-input>
		<b-input v-model="deed.description" maxlength="255"></b-input>
		<b-input v-model="deed.defaultHonor" type="number" maxlength="255" ></b-input>
		<b-switch v-model="deed.visible" >{{ deed.visible?`Видимое`:`Невидимое` }}</b-switch>
		<b-button @click="updateDeedType(deed)" type="is-success">✔</b-button>
		<b-button @click="deleteDeedType(deed)" type="is-danger">☓</b-button>
	</div>
	<b-field label="Добавить новый тип деяния"></b-field>
	<div class="" style="display:flex;justify-content: space-around;">

		<b-input v-model="newDeedType.name" placeholder="Код деяния латиницей" maxlength="255" ></b-input>
		<b-input v-model="newDeedType.description" placeholder="Описание типа деяния" maxlength="255"></b-input>
		<b-input v-model="newDeedType.defaultHonor" type="number" maxlength="255" ></b-input>
		<b-switch v-model="newDeedType.visible" >{{ newDeedType.visible?`Видимое`:`Невидимое` }}</b-switch>
		<b-button @click="addDeedType(newDeedType)" type="is-success">✔</b-button>
	</div>
</b-tab-item>
</b-tabs>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'stories',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  deep:1,
	  players:[],
	  stories:[],
	  deedTypes:[],
	  activeTab: undefined,
	  isOpen:-1,
	  isOpenPlayer:-1,
	  currentStory:[],
	  currentPlayer:[],
	  newPlayer:{},
	  newDeed:{type:'',
				description:'',
				honor:''
				},
	  newDeedName:'',
	  newDeedName_mass:'',
	  newPlayerName:'',
	  sideName:'',
	  squadName:'',
	  newDeedType:{name:'',
					description:'',
					defaultHonor:0,
					visible:false},
	  selected:null,
	  mass_players_deed:{type:'',
				description:'',
				honor:'',
				players:[]},
	  newStory:{},
	  dictionaries:[{dict:'sides',data:[{description:''}]},{dict:'squads',data:[{name:''}]}]
    }
  }
  ,computed: {
        filteredPlayers() {
            return this.players.filter(player=>!this.mass_players_deed.players.filter(el=>el.id==player.id).length>0).filter(player => {
                return (
                    player.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newPlayerName.toLowerCase()) >= 0
                )
            })
        },
		filteredSides() {
			return this.dictionaries.filter(el=>el.dict=='sides')[0].data.filter(side => {
				console.log(side);
                return (
                    side.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.sideName.toLowerCase()) >= 0
                )
            })
		},
		filteredSquads() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad => {
				console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.squadName.toLowerCase()) >= 0
                )
            })
		},
		filteredDeedTypes() {
			//if(this.newDeedName=='')return this.deedTypes;
            return this.deedTypes.filter(deedType => {
                return (
                    deedType.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newDeedName.toLowerCase()) >= 0
                )
            })
        },
		filteredDeedTypes_mass() {
			//if(this.newDeedName=='')return this.deedTypes;
            return this.deedTypes.filter(deedType => {
                return (
                    deedType.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newDeedName_mass.toLowerCase()) >= 0
                )
            })
        }
		
    }
  ,async mounted(){
		this.console=console;
		this.loader_=document.getElementById('loader_');
		await this.fetchDeedTypes();
		console.log(this.deedTypes);
		//this.fetchStories();
		await this.fetchPlayers();
		await this.fetchDictionaries();
		console.log(this.dictionaries);
	}
	,methods:{

		async showPlayer(player,index){
			this.currentPlayer=[];
			 this.isOpenPlayer = index;
			 //console.log(index,player);
			 
			 let response = await this.getPlayer(player.id);

			
			 this.currentPlayer=response;//this.players.filter(el=>el.id==player.id)
			 this.currentPlayer[0].deeds.sort((a,b)=>{
									if (a.date > b.date) return -1; // если первое значение больше второго
									if (a.date == b.date) return 0; // если равны
									if (a.date < b.date) return 1; // если первое значение меньше второго
									})

			this.newDeed={type:'',
				description:'',
				honor:''
				}
			 console.log('currentPlayer',this.currentPlayer);
			 this.newDeedName=''
			 this.$forceUpdate();
		}

		,async fetchPlayers(){
			this.loader_.classList.toggle('hidden');
			let players;
			try{
			players = await axios.get('https://blooming-refuge-12227.herokuapp.com/getPlayers',
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
			this.players=players.data.filter(player=>player.realName);
			this.loader_.classList.toggle('hidden');
			//console.log ('players',this.players);
		}
		,async fetchDeedTypes(){
			this.loader_.classList.toggle('hidden');
			let deedTypes;
			try{
			deedTypes = await axios.get('https://blooming-refuge-12227.herokuapp.com/getDeedTypes',
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
			this.deedTypes=deedTypes.data;
			this.loader_.classList.toggle('hidden');
			//console.log ('players',this.players);
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
		}
		,async getPlayer(id){
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
			return response.data;
		}

		, async testBug(arg){
			console.log('testbug',arg)
		}
		
		,async addDeed(player,deed){
			if(!deed.type){
				this.$buefy.toast.open({
                    message: 'Выберите тип деяния!',
                    type: 'is-danger'
                })
				return;
			}
			console.log('добавляем деяние',player,deed);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateDeed',{
						id:null,
						description:deed.description,
						typeId:deed.type.id,
						playerId:player.id,
						honor:deed.honor
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].honor=this.currentPlayer[0].honor;
		}
		,async updateDeed(player,deed){
			console.log('изменяем деяние',player,deed);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateDeed',{
						id:deed.id,
						description:deed.description,
						typeId:deed.type.id,
						playerId:player.id,
						honor:deed.honor
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].honor=this.currentPlayer[0].honor;
		},
		async deleteDeed(player,deed){
			console.log('удаляем деяние',deed);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/deleteDeed',{
						id:deed.id
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].honor=this.currentPlayer[0].honor;
		}
		,async addDeedType(deedType){
			console.log('добавляем тип деяния',deedType);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/deedTypes',{
						id:null,
						description:deedType.description,
						name:deedType.name,
						visible:deedType.visible,
						defaultHonor:deedType.defaultHonor
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this. newDeedType={name:'',
					description:'',
					defaultHonor:0,
					visible:false}
			await this.fetchDeedTypes();
		}
		,async updateDeedType(deedType){
			console.log('изменяем тип деяния',deedType);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/deedTypes',{
						id:deedType.id,
						description:deedType.description,
						name:deedType.name,
						visible:deedType.visible,
						defaultHonor:deedType.defaultHonor
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchDeedTypes();
		},
		async deleteDeedType(deedType){
			console.log('удаляем деяние',deedType);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.delete('https://blooming-refuge-12227.herokuapp.com/deedTypes',
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					},
					data: {
						id:deedType.id
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Возможно деяния с этим типом еще остались у игроков.\nТекст ошибки: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchDeedTypes();
		}
		,async addMassDeed(deed){
			if(!deed.type){
				this.$buefy.toast.open({
                    message: 'Выберите тип деяния!',
                    type: 'is-danger'
                })
				return;
			}
			if(deed.players.length<1){
				this.$buefy.toast.open({
                    message: 'Выберите хотя бы одного героя!',
                    type: 'is-danger'
                })
				return;
			}
			console.log('добавляем деяние',JSON.stringify(deed));
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setDeed/mass',{
						description:deed.description,
						typeId:deed.type.id,
						players:JSON.stringify(deed.players),
						honor:deed.honor
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this.mass_players_deed={type:'',description:'',honor:'',players:[]};
			this.newPlayerName='';
			this.newDeedName_mass='';
			this.$buefy.toast.open({
                    message: `Деяние добавлено`,
                    type: 'is-success'
                })
		},
		async playerActivation(player){
			console.log('включаем/выключаем видимость',player);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/objectActivation',{
						id:player.id,
						type:'player',
						active:player.active
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				console.log(e);
				this.$buefy.toast.open({
				
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].active=this.currentPlayer[0].active;
		},
		async removePlayer(player){
			//console.log(player);
			this.mass_players_deed.players=this.mass_players_deed.players.filter(el=>el.id!=player.id);
		}
	},
	components:{
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
.story{
	display:grid;
	grid-template-columns: 1fr 1fr;
}
.player{
	display:grid;
	grid-template-columns: 1fr 1fr;
}
.player_deeds{
	display:grid;
	grid-template-columns: 1fr;
}
.player_deeds_list{
	padding: 10px;
	grid-column: 2 / 3;
	justify-content: space-around;
	flex-direction: column;
}
.story_desc{
	grid-column: 1 / 2;
	padding: 10px;
	display:flex;
	justify-content: space-between;
	flex-direction: column;
}
.story_players{
	padding: 10px;
	grid-column: 2 / 3;
	justify-content: space-around;
	flex-direction: column;
}
.story_name{
	display:flex;
	justify-content: flex-start;
}
.story_longDescription{
	display:flex;
	//justify-content: flex-start;
	flex-direction: column;
	align-items:flex-start;
}
.story_textarea {
  background: rgba(0, 0, 0, 0);
  border: 1px solid black;
  padding: 10px;
  outline: 0;
  cursor: text;
  resize: vertical;
  width:100%;
  height:100%;
  //max-width: 500px;
}
.player_stories{
	grid-column: 1 / 2;
	padding: 10px;
	//display:flex;
	justify-content: space-around;
	flex-direction: column;
}
.player_players{
	padding: 10px;
	grid-column: 2 / 3;
	justify-content: space-around;
	flex-direction: column;
}
.dropdown-menu{
z-index:1000
}
.dropdown-content{
z-index:1000
}
.deeds_mass_add{
	display:grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
}
.deeds_mass_add_content{
	display:flex;
	flex-direction: column;
	justify-content: center;
}
.deeds_mass_add_players{
	grid-column: 1 / 2;
	padding:10px;
}
.deeds_mass_add_type{
	grid-column: 2 / 4;
	padding:10px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
}
.deeds_mass_add_description{
	grid-column: 3 / 4;
	padding:10px;
}
.deeds_mass_add_honor{
	grid-column: 4 / 5;
	padding:10px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
}
.isactive{
	font-size:80%;
}
.red{
	color:#cc0000;
}
.green{
	color:#00aa00;
}
.deed_textarea {
  background: rgba(0, 0, 0, 0);
  border: 1px solid black;
  padding: 10px;
  outline: 0;
  cursor: text;
  resize: vertical;
  width:100%;
  height:100%;
  //max-width: 500px;
}
.delete-button{
	cursor: default;
}
</style>
