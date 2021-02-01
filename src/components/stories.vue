<template>
<div>
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
Управление сюжетами<br><br>
<div style="display:flex;margin-left:50px">
<b-field label="Глубина построения связей">
            <b-slider v-model="deep" :min="0" :max="10" style="width:300px;" indicator :tooltip="false"></b-slider>
</b-field>
</div>
<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
<b-tab-item label="Сюжеты">
<b-collapse
            class="card"
            animation="slide"
            v-for="(story, index) of stories"
            :key="index"
            :open="isOpen == index"
            @open="showStory(story,index)" 
			style="overflow:visible;">
            <template #trigger="props">
                <div
                    class="card-header"
                    role="button"
                >
                    <p class="card-header-title" style="display:flex;justify-content:space-between">
                        {{ story.description }} <router-link :to="`/graph?id=${story.id}&type=${story.objectType}&deep=${deep}`" target="_blank">посмотреть граф</router-link>
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
                    <div v-if="isOpen == index" v-for="curStory in currentStory">
					
						<div class="story">
							<div class="story_desc">
									<b-field label="Название">
									</b-field>
										<b-input v-model="curStory.description" maxlength="255"></b-input>

								<b-field label="Полное описание">
								</b-field>
										<textarea class="story_textarea" v-model="curStory.longDescription"></textarea><br>
								<b-button @click="updateStory(curStory,story)">Сохранить сюжет</b-button>
							</div>
							<div class="story_players">
								<b-field label="Персонажи, участвующие в сюжете" v-if="curStory.players.length>0">
								</b-field>
									<div class="player_in_story" v-for="(player,playerIndex) in curStory.players" :key="player.id" style="display:flex;justify-content: space-around;">
									<b-input v-model="curStory.players[playerIndex].name" maxlength="255" disabled></b-input>
									<b-input v-model="curStory.players[playerIndex].description" maxlength="255" placeholder="Введите роль персонажа в сюжете"></b-input>
									<b-button @click="updateLink({id:curStory.id,type:curStory.objectType},{id:player.id,type:player.objectType},player.description,story)" type="is-success">✔</b-button>
									<b-button @click="deleteLink({id:curStory.id,type:curStory.objectType},{id:player.id,type:player.objectType},story)" type="is-danger">🞪</b-button>
									</div>

								<b-field label="Добавить персонажа">
								</b-field>
								<b-autocomplete
									v-model="newPlayerName"
									placeholder="Начните вводить имя персонажа"
									:keep-first="false"
									:open-on-focus="false"
									:data="filteredPlayers"
									field="name"
									@select="option => {newPlayer = option;addLink({id:curStory.id,objectType:curStory.objectType},{id:option.id,objectType:option.objectType},'',story);}"
									:clearable="true"
								>
								</b-autocomplete>
								
								
							</div>
						</div>
					</div>
                </div>
            </div>
        </b-collapse>
		<!--Отдельная панель для добавления новой истории-->
		<b-collapse
            class="card"
            animation="slide"
            
            
            :open="false"
            style="overflow:visible;">
            <template #trigger="props">
                <div
                    class="card-header"
                    role="button"
                >
                    <p class="card-header-title" style="display:flex;justify-content:space-between;">
                        Добавить новый сюжет
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
                    <div>
					
						<div class="story">
							<div class="story_desc">

									<b-field label="Название">
									</b-field>
										<b-input v-model="newStory.description" maxlength="255"></b-input>
								<b-field label="Полное описание">
								</b-field>
										<textarea class="story_textarea" v-model="newStory.longDescription"></textarea><br>

								<b-button @click="saveStory(newStory)">Сохранить сюжет</b-button>
							</div>
						</div>
					</div>
                </div>
            </div>
        </b-collapse>

</b-tab-item>

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
                        {{ player.name }} <router-link :to="`/graph?id=${player.id}&type=${player.objectType}&deep=${deep}`" target="_blank">посмотреть граф</router-link>
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
					
						<div class="player">
							<div class="player_stories">
									<b-field label="Сюжеты в которых участвует персонаж">
								</b-field>
									<div class="player_in_story" v-for="(story,storyIndex) in curPlayer.stories" :key="story.id" style="display:flex;justify-content: space-around;">
									<b-input v-model="curPlayer.stories[storyIndex].name" maxlength="255" disabled></b-input> →
									<b-input v-model="curPlayer.stories[storyIndex].description" maxlength="255" disabled></b-input>
									</div>
							</div>
							<div class="player_players">
								<b-field label="Связь с другими персонажами" v-if="curPlayer.players.length>0">
								</b-field>
									<div class="player_in_story" v-for="(player_,playerIndex) in curPlayer.players" :key="player_.id" style="display:flex;justify-content: space-around;">
									<b-input v-model="curPlayer.players[playerIndex].name" maxlength="255" disabled></b-input>
									<b-input v-model="curPlayer.players[playerIndex].description" maxlength="255" placeholder="Напишите что связывает персонажей"></b-input>
									<b-button @click="updateLink({id:curPlayer.id,type:curPlayer.objectType},{id:player_.id,type:player_.objectType},player_.description,player)" type="is-success">✔</b-button>
									<b-button @click="deleteLink({id:curPlayer.id,type:curPlayer.objectType},{id:player_.id,type:player_.objectType},player)" type="is-danger">🞪</b-button>
									</div>
								<b-field label="Добавить связь с персонажем">
								</b-field>
								<b-autocomplete
									v-model="newPlayerName"
									placeholder="Начните вводить имя персонажа"
									:keep-first="false"
									:open-on-focus="false"
									:data="filteredPlayers"
									field="name"
									@select="option => {newPlayer = option;addLink({id:curPlayer.id,objectType:curPlayer.objectType},{id:option.id,objectType:option.objectType},'',player);}"
									:clearable="true"
								>
								</b-autocomplete>
								
								
							</div>
						</div>
					</div>
                </div>
            </div>
        </b-collapse>

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
	  activeTab: undefined,
	  isOpen:-1,
	  isOpenPlayer:-1,
	  currentStory:[],
	  currentPlayer:[],
	  newPlayer:{},
	  newPlayerName:'',
	  selected:null,
	  newStory:{}
    }
  }
  ,computed: {
        filteredPlayers() {
            return this.players.filter(player => {
                return (
                    player.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newPlayerName.toLowerCase()) >= 0
                )
            })
        }
    }
  ,async mounted(){
		this.loader_=document.getElementById('loader_');
		this.fetchStories();
		this.fetchPlayers();
		
	}
	,methods:{
		async showStory(story,index){
			this.currentStory=[];
			 this.isOpen = index;
			 //console.log(index,story);
			 let response = await this.getGraph(story.id,story.objectType);
			 //console.log(response);
			 let nodes=[];
			  response.filter(el=>{if(!el.from.id){return;}nodes.push({id:el.from.id,name:el.from.name,objectType:el.from.objectType,description:el.description})})
			  response.filter(el=>{if(!el.to.id){return;}nodes.push({id:el.to.id,name:el.to.name,objectType:el.to.objectType,description:el.description})})
				nodes = nodes.filter(el=>el);
				let nodesPure=[]
				nodes.map(el=>{if(nodesPure.filter(ell=>ell.id==el.id).length>0){return;}else{nodesPure.push(el)}})
				//console.log('nodesPure',nodesPure)
			let players =  nodesPure.filter(el=>el.objectType=='player')
			
			 this.currentStory=[{
			 id:story.id,
			 objectType:story.objectType,
			 description:story.description,
			 longDescription:story.longDescription,
			 players:players
			 }];
			 this.newPlayer={};
			this.newPlayerName='';
			 console.log('currentStory',this.currentStory);
			 this.$forceUpdate();
		}
		,async showPlayer(player,index){
			this.currentPlayer=[];
			 this.isOpenPlayer = index;
			 //console.log(index,player);
			 let response = await this.getGraph(player.id,player.objectType);
			 console.log('player',response);
			 let nodes=[];
			  response.filter(el=>{if(!el.from.id){return;}nodes.push({id:el.from.id,name:el.from.name,objectType:el.from.objectType,description:el.description})})
			  response.filter(el=>{if(!el.to.id){return;}nodes.push({id:el.to.id,name:el.to.name,objectType:el.to.objectType,description:el.description})})
				nodes = nodes.filter(el=>el);
				let nodesPure=[]
				nodes.map(el=>{if(nodesPure.filter(ell=>ell.id==el.id).length>0){return;}else{nodesPure.push(el)}});
				//console.log('nodesPure',nodesPure)
			let players =  nodesPure.filter(el=>el.objectType=='player').filter(el=>el.id!=player.id);
			let stories =  nodesPure.filter(el=>el.objectType=='story');
			
			 this.currentPlayer=[{
			 id:player.id,
			 objectType:player.objectType,
			 name:player.name,
			 players:players,
			 stories:stories
			 }];
			this.newPlayer={};
			this.newPlayerName='';
			 console.log('currentPlayer',this.currentPlayer);
			 this.$forceUpdate();
		}
		,async fetchStories(){
			this.loader_.classList.toggle('hidden');
			let stories;
			try{
			stories = await axios.get('https://blooming-refuge-12227.herokuapp.com/getStories',
			{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
				console.log(e.message);
			}
			this.stories=stories.data;
			this.loader_.classList.toggle('hidden');
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
			this.players=players.data;
			this.loader_.classList.toggle('hidden');
			//console.log ('players',this.players);
		}
		,async getGraph(id,type){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/getGraph',{
					id:id,
					type:type,
					deep:1
				},
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
		, async saveStory(curStory){
			console.log('сохраняем сюжет',curStory);
			if(!curStory.description){
				this.$buefy.toast.open({
                    message: 'Не заполнено название сюжета!',
                    type: 'is-danger'
                })
				return;
			}
			if(!curStory.longDescription){
				this.$buefy.toast.open({
                    message: 'Не заполнено описание сюжета!',
                    type: 'is-danger'
                })
				return;
			}
			let response;
			try{
				
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateStory',{
					id:null,
					description:curStory.description,
					longDescription:curStory.longDescription
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
				
			}catch(e){
				this.$buefy.toast.open({
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				return;
			}
			//response.data.findIndex(el=>el.id=)
			await this.fetchStories();
			//this.stories.findIndex(el=>el.id==response.data.id)
			this.isOpen=this.stories.findIndex(el=>el.id==response.data.id);
			this.showStory(this.stories[this.stories.findIndex(el=>el.id==response.data.id)],this.isOpen);
			this.newStory={};
		}
		, async updateStory(curStory,obj){
			console.log('апдейтим сюжет',curStory,obj);
			if(!curStory.description){
				this.$buefy.toast.open({
                    message: 'Не заполнено название сюжета!',
                    type: 'is-danger'
                })
				return;
			}
			if(!curStory.longDescription){
				this.$buefy.toast.open({
                    message: 'Не заполнено описание сюжета!',
                    type: 'is-danger'
                })
				return;
			}
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateStory',{
					id:curStory.id,
					description:curStory.description,
					longDescription:curStory.longDescription
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				this.$buefy.toast.open({
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				return;
			}
			await this.fetchStories();
			if(obj.objectType=='player'){
			this.showPlayer(obj,this.isOpenPlayer)
			}
			if(obj.objectType=='story'){
			this.showStory(this.stories[this.stories.findIndex(el=>el.id==response.data.id)],this.isOpen)
			}
		}
		, async testBug(arg){
			console.log('testbug',arg)
		}
		,async deleteLink(from,to,obj){
			console.log('удаляем связь',from,to);
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/deleteLink',{
						from:{
							id:from.id,
							type:from.type
						},
						to:{
							id:to.id,
							type:to.type
						}
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				this.$buefy.toast.open({
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				return;
			}
			if(obj.objectType=='player'){
			await this.fetchPlayers();
			this.showPlayer(this.players[this.players.findIndex(el=>el.id==obj.id)],this.isOpenPlayer)
			}
			if(obj.objectType=='story'){
			await this.fetchStories();
			this.showStory(this.stories[this.stories.findIndex(el=>el.id==obj.id)],this.isOpen)
			}
		}
		,async addLink(from,to,description,obj){
			console.log('добавляем связь',from,to,description);
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateLink',{
						from:{
							id:from.id,
							type:from.objectType
						},
						to:{
							id:to.id,
							type:to.objectType
						},
						description:description
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
				return;
			}
			if(obj.objectType=='player'){
			await this.fetchPlayers();
			this.showPlayer(this.players[this.players.findIndex(el=>el.id==obj.id)],this.isOpenPlayer)
			}
			if(obj.objectType=='story'){
			await this.fetchStories();
			this.showStory(this.stories[this.stories.findIndex(el=>el.id==obj.id)],this.isOpen)
			}
		}
		,async updateLink(from,to,description,obj){
			console.log('изменяем связь',from,to,description);
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateLink',{
						from:{
							id:from.id,
							type:from.type
						},
						to:{
							id:to.id,
							type:to.type
						},
						description:description
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
				this.$buefy.toast.open({
                    message: `Ошибка при обработке запроса: "${e.message}"`,
                    type: 'is-danger'
                })
				return;
			}
			if(obj.objectType=='player'){
			await this.fetchPlayers();
			this.showPlayer(this.players[this.players.findIndex(el=>el.id==obj.id)],this.isOpenPlayer);
			}
			if(obj.objectType=='story'){
			await this.fetchStories();
			this.showStory(this.stories[this.stories.findIndex(el=>el.id==obj.id)],this.isOpen);
			}
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

</style>
