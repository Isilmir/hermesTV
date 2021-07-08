<template>
<div class="b52" style="width:100%;">
	<b style="font-size:200%">Зал Славы</b><br><b></b><br><br>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
	<div style="display:flex;flex-wrap: wrap;">
	<b-autocomplete
				v-model="filteredPlayerName"
				placeholder="Начните вводить имя героя"
				:open-on-focus="true"
				:data="filteredPlayers_forFilter"
				field="name"
				@select="option => {filters.players=[{name:option.name,id:option.id}];isOpenPlayer=-1;}"
				:clearable="true"
				style="min-width:250px;max-width:300px; margin-right:10px"
			></b-autocomplete>
			<b-button v-if="filters.players.length>0||filters.sides.length>0||filters.squads.length>0" @click="filters={sides:[],squads:[],players:[]};filteredPlayerName='';filteredSideName='';filteredSquadName='';isOpenPlayer=-1;" type="is-warning" style="max-width:100px;">Сбросить</b-button>
	</div><br>
	<div style="text-align:left;width:100%;">
	  <b-table :data="playersWithFilters" 
			   :bordered="false" 
			   :hoverable="true" 
			   ref="table"
				:mobile-cards="false"
				width="100%"
			   style="text-align:left;
					width:100%;"
>
		<b-table-column field="index" label="№" width="5%" numeric v-slot="props">
                {{ props.row.index }}
        </b-table-column>
		<b-table-column
                field="name"
                label="Герой"
				centered
                v-slot="props"
				width="30%"
            >
			<span v-if="props.row.stateId!=3">{{props.row.name}}</span>
			<s v-if="props.row.stateId==3">{{props.row.name}}</s>
            </b-table-column>
			<!--<b-table-column
                field="honor"
                label="Слава"
                v-slot="props"
            >
                {{ props.row.honor }}
            </b-table-column>-->
			<b-table-column
                field="honor"
                label=""
                v-slot="props"
				width="5%"
            >
                <span v-if="props.row.honorChange>0" style="color:#229922;">▲</span>
				<span v-if="props.row.honorChange<0" style="color:#992222;">▼</span>
            </b-table-column>
			<b-table-column
                field="deeds"
                label="Деяния"
                v-slot="props"
				width="60%"
            >
			
			<div class="flex-deeds">
				<!--<div class="deed-container" v-for="deedGroup in props.row.deedGroups" >
					<div class="deed-container-wrapper">-->
					<b-tooltip 
							position="is-left" multilined v-for="deedGroup in props.row.deedGroups" :key="deedGroup.name+deedGroup.description"  style="font-family:'Arial';">
						<template v-slot:content>
							<div v-for="line in deedGroup.description.split(/[\r\n]/)" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								{{line}}
								</div>
							</div>
							<!--<div class="has-margin-15">
								Line2
							</div>
							<div class="has-margin-15">
								Line3
							</div>-->
						</template>
						<div :class="`deed ${deedGroup.degree} ${deedGroup.heroic?'heroic':''} ${deedGroup.name=='death'||deedGroup.name=='stockpile'
																														||deedGroup.name=='blockMerc'
																														||deedGroup.name=='blockLicense'
																														||deedGroup.name=='blockHumanitarianAid'
																														||deedGroup.name=='blockHeavyArmament'
																														||deedGroup.name=='blockHenchman'
																														||deedGroup.name=='addHenchman'
																														||deedGroup.name=='lostHenchman'
																														||deedGroup.name=='machinegun'
																														||deedGroup.name=='sniper'
																														||deedGroup.name=='medic'
																														||deedGroup.name=='importantNote'
																														||deedGroup.name=='message'
																														||deedGroup.name=='PlakianThebes'
																														||deedGroup.name=='wingsOfSteel'
																														||deedGroup.name=='WaitReinforcements'
																														||deedGroup.name=='gotReinforcements'
																														||deedGroup.name=='blockAres'
																														||deedGroup.name=='gauleiterOfLirness'
																														||deedGroup.name=='LirnessChildren'
																														||deedGroup.name=='EternalDarkness'
																														||deedGroup.name=='Icepick'
																														||deedGroup.name=='OneTimeToken'
																								?'achievment':''}`"
								:style="deedGroup.color?`${'background-color:'+deedGroup.color}`:''">
						<img v-if="!deedGroup.messageId"
							:src="getImg(deedGroup)"
							:class="`deed-img`"
						> </img>
						<router-link v-if="deedGroup.messageId" :to="`/message?id=${deedGroup.messageId}`"  target="_blank" :class="`deed-img`">
						<img
							:src="getImg(deedGroup)"
						> </img>
						</router-link>
						<span :class="`deed-count ${deedGroup.heroic?'heroic':''}`" >{{ deedGroup.heroic?''/*'★'*/:deedGroup.count }}</span>
						<!--<b-tooltip :label="deedGroup.description"
							position="is-bottom">
							<span  
							:class="`tag ${deedGroup.degree=='good'?'is-success':'is-danger'} deed-video`" 
							style="font-size:100%;margin-bottom:5px;">
							{{ deedGroup.count }} 
							<img
							src="../assets/logo.png"
							class="deed-img"
						> </img>
						</span>
						</b-tooltip>-->
						<!--<br>-->
						</div>
					</b-tooltip>
					<!--отдельная иконка для транзакций-->
					<b-tooltip 
							position="is-left" multilined v-if="props.row.transactions.length>0" style="font-family:'Arial';">
						<template v-slot:content>
							<div v-for="line in props.row.transactions" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								<b>{{line.resource}}, {{line.quantity}} шт.</b> ({{line.god}})
								</div>
							</div>
						</template>
						<div :class="`deed`"
								:style="`${'background-color: #ccaa00'}`">
						<img
							:src="getImg({name:'transaction'})"
							:class="`deed-img`"
						> </img>
						</div>
					</b-tooltip>
				<!--	</div>
				</div>-->
			</div>
			
            </b-table-column>
	  </b-table>
	</div>
	<div></div>
</div>
</template>
<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  name: 'honor',
  props:['cert'],
  data () {
    return {
      players: [],
	  filteredPlayerName:'',
	  filters:{sides:[],squads:[],players:[]},
	  playerSortOrder:-1,
	  playerSortProp:'honor'
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
		filteredPlayers_forFilter() {
            return this.players.filter(player=>(this.filters.sides.filter(el=>el.id==player.sideId).length>0||this.filters.sides.length==0)
											 &&(this.filters.squads.filter(el=>el.id==player.squadId).length>0||this.filters.squads.length==0)
										)
							   .filter(player => {
                return (
                    player.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.filteredPlayerName.toLowerCase()) >= 0
                )
            })
        },
		filteredSides() {
			return this.dictionaries.filter(el=>el.dict=='sides')[0].data.filter(side => {
				//console.log(side);
                return (
                    side.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.sideName.toLowerCase()) >= 0
                )
            })
		},
		filteredSides_forFilter() {
			return this.dictionaries.filter(el=>el.dict=='sides')[0].data.filter(side => {
				//console.log(side);
                return (
                    side.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.filteredSideName.toLowerCase()) >= 0
                )
            })
		},
		filteredSquads() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad => {
				//console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.squadName.toLowerCase()) >= 0
                )
            })
		},
		filteredSquads_forFilter() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data
										.filter(squad=>(this.filters.sides.filter(el=>el.id==squad.sideId).length>0||this.filters.sides.length==0)
										)
			
					.filter(squad => {
				//console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.filteredSquadName.toLowerCase()) >= 0
                )
            })
		},
		//это фильтр по списку персонажей
		playersWithFilters(){
			return this.players.filter(player=>(this.filters.sides.filter(side=>side.id==player.sideId).length>0||this.filters.sides.length==0)
											 &&(this.filters.squads.filter(squad=>squad.id==player.squadId).length>0||this.filters.squads.length==0)
											 &&(this.filters.players.filter(player_=>player_.id==player.id).length>0||this.filters.players.length==0)
										)
							   .sort((a,b)=>{
									if (a[this.playerSortProp] > b[this.playerSortProp]) return this.playerSortOrder; // если первое значение больше второго
									if (a[this.playerSortProp] == b[this.playerSortProp]) return 0; // если равны
									if (a[this.playerSortProp] < b[this.playerSortProp]) return this.playerSortOrder*-1; // если первое значение меньше второго
									});
		}
		
    },
  async mounted(){
	//console.log(jwt.verify(localStorage.getItem('jwt').replace(/"/g,''),this.cert,{ algorithms: ['RS256'] }))
	loader_.classList.toggle('hidden');
	this.console=console;
	let headers = {};
	headers['Content-Type']='application/json'
	if(localStorage.getItem('jwt'))headers['Authorization']=`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
	let players;
			try{
			players = await axios.get('https://blooming-refuge-12227.herokuapp.com/getPlayers/honor',
			{
				headers: headers
			});
			}catch(e){
				//console.log(e.message);
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
				loader_.classList.toggle('hidden');
			}
			//console.log(players);
			this.players=players.data
									//.map(player=>{player.deedTypes=player.deeds.map(deed=>);return player;})
									.sort((a,b)=>{
									if (a.honor > b.honor) return -1; // если первое значение больше второго
									if (a.honor == b.honor) return 0; // если равны
									if (a.honor < b.honor) return 1; // если первое значение меньше второго
									}).map((el,i)=>{el.index=i+1;return el;});
									
			this.players.forEach(player=>{
				player.transactions.sort((a,b)=>{
									if (a.date > b.date) return -1; // если первое значение больше второго
									if (a.date == b.date) return 0; // если равны
									if (a.date < b.date) return 1; // если первое значение меньше второго
									})
			})
			//console.log(this.players);
			
	loader_.classList.toggle('hidden');
  },
  methods:{
	getImg(deedGroup){
		let res
		try{
			res=require(`../assets/deeds/${deedGroup.name}.png`);
		}
		catch(e){
			res=require(`../assets/deeds/feat.png`);
		}
		return res
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
.b52{
	font-family:'B52';
	font-size:130%;
}
.deed-video{
	background:url(../assets/logo.png);
}
.deed{
	//border: 1px solid black;
	border-radius:10%;
	//border:none;
	width:30px;
	height:30px;
	display:grid;
	grid-template-rows:  2fr 1fr;
	grid-template-columns: 2fr 1fr;
	//aspect-ratio: 1 / 1;
	margin:5px;
}

.flex-deeds{
	display:flex;
	height:100%;
	width:100%;
	flex-wrap: wrap;
	//position: relative;
}
.deed-img{
	grid-column: 1 / 3;
	grid-row: 1 / 3;
	height:100%;
}
.deed-count{
	grid-column: 2 / 3;
	grid-row: 2 / 3;
	font-size:60%;
	color:#ffffff;
	font: bold;
}
.table{
	max-width:100px;
}
.bad{
	background-color:#bb0000
}
.good{
	background-color:#00bb00
}
.heroic{
	//color:#FFD700;
	//border:2px solid #A06f1a
}
.bad.heroic{
	//background-color:#DC143C
}
.good.heroic{
	//background-color:#DAA520
}
.bad.achievment{
	background-color:#999999;
}
.good.achievment{
	background-color:#999999;
}

.achievment .deed-count{
	color:#ffffff;
}
</style>
