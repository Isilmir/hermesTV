<template>
<div >
<B>Симуляция экономики игры</B><br><br>
<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
<b-tab-item label="Данные">
	<div style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-left:50px; width:90%;">

	  <b-field label="Шанс получить ранение во время войны">
            <b-slider v-model="woundChance_war" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px" :max="98"></b-slider>
        </b-field>
		<b-field label="Шанс получить ранение во время мира">
            <b-slider v-model="woundChance_piece" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px"  :max="98"></b-slider>
        </b-field>
		<b-field label="Шанс получить гуманитарку за цикл">
            <b-slider v-model="humanitaryHelpChance" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px"></b-slider>
        </b-field>
		<b-field label="Шанс получить спутника за цикл">
            <b-slider v-model="mercenaryHelpChance" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px"></b-slider>
        </b-field>
		<b-field label="Начальное количество спутников">
            <b-slider v-model="startBjzi"  :tooltip="false" indicator style="width:300px"  :max="10"></b-slider>
        </b-field>
		<b-field label="Начальное количество гуманитарки">
            <b-slider v-model="startHumanitary"  :tooltip="false" indicator style="width:300px" :max="10"></b-slider>
        </b-field>
		</div>
		<b-button @click="startSimulation">Начать симуляцию</b-button>
		<b-table :data="rows" :columns="columns" :bordered="false" :hoverable="true" style="text-align:left;"></b-table> 
		

</b-tab-item>
<b-tab-item label="График">
</b-tab-item>
</b-tabs>
</div>
</template>

<script>
let statistic=[];
class Simulation{
	constructor(woundChance_war,woundChance_piece,humanitaryHelpChance,mercenaryHelpChance,startBjzi,startHumanitary,startGold) {
			this.periods = setPeriods();
			this.woundChance = {war:woundChance_war,piece:woundChance_piece}
			this.humanitaryHelpChance = humanitaryHelpChance
			this.mercenaryHelpChance = mercenaryHelpChance
			this.startBjzi = startBjzi,
			this.startHumanitary = startHumanitary,
			this.startGold = startGold
			this.players = setPlayers(this);
			this.bonusHumanitary = 0
			this.bonusBjzi = 0
			}
			
	start(){
		console.log('начали симуляцию')
		this.periods
		.map(period=>{
					//console.log(`Пошел период ${period.id} - ${period.type}`);
					let cache=this;
					cache = humanitaryHelp(cache);
					cache = mercenaryHelp(cache);
					cache = wound(cache,period.type);
					cache = starve(cache);
					statistic.push(this.getStatistic(period))
					//console.log(statistic)
					});
	}
	
	getStatistic(period){
		let bjzi=this.players.map(player=>player.resources.filter(resource=>resource.type=='bjzi').length).reduce((sum,cur)=>sum+cur,0);
		let bjziMiddle=this.players.map(player=>player.resources.filter(resource=>resource.type=='bjzi').length).reduce((sum,cur)=>sum+cur,0)/this.players.length;
		let humanitary=this.players.map(player=>player.resources.filter(resource=>resource.type=='humanitary').length).reduce((sum,cur)=>sum+cur,0);
		let humanitaryMiddle=this.players.map(player=>player.resources.filter(resource=>resource.type=='humanitary').length).reduce((sum,cur)=>sum+cur,0)/this.players.length;
		let live=this.players.filter(player=>player.state>0).length;
		let dead=this.players.filter(player=>player.state<0).length;
		let gold=this.players.map(player=>player.resources.filter(resource=>resource.type=='gold').length).reduce((sum,cur)=>sum+cur,0);
		return {period:period.id,periodType:period.type,bjzi:bjzi,bjziMiddle:bjziMiddle,bonusBjzi:this.bonusBjzi,humanitary:humanitary,bonusHumanitary:this.bonusHumanitary,live:live,dead:dead,gold:gold,humanitaryMiddle:humanitaryMiddle}
	}
}

function starve(context){
	 context.players.map(player=>{
		//console.log(player)
		let humanitary = player.resources.filter(resource=>resource.type=='humanitary');
		let bjzi = player.resources.filter(resource=>resource.type=='bjzi');
		if(humanitary.length>0){
			player.resources=player.resources.filter(resource=>!(resource.id==humanitary[0].id&&resource.type=='humanitary'))
								//console.log(player.resources.filter(resource=>resource.type=='humanitaryhumanitary').length);
		}else if(bjzi.length>0){
			player.resources=player.resources.filter(resource=>!(resource.id==bjzi[0].id&&resource.type=='bjzi'))	
		}else{
			player.state=-1;
		}
		//console.log(player)
	})
	return context;
}

function wound(context,periodType){
	context.players.map(player=>{
		let bjzi;
		let trigger = getChance()>context.woundChance[periodType]?false:true;
		while(trigger){
			bjzi = player.resources.filter(resource=>resource.type=='bjzi');
			if(bjzi.length>0){
				player.resources=player.resources.filter(resource=>!(resource.id==bjzi[0].id&&resource.type=='bjzi'))	
			}else{
				player.state=-1;
			}
			trigger = getChance()>context.woundChance[periodType]?false:true;
		}
	})
	return context;
}
function humanitaryHelp(context){
	context.players.map(player=>{
		let humanitary;
		let trigger = getChance()>context.humanitaryHelpChance?false:true;
		//console.log(trigger);
		if(trigger){
			player.resources.push({id:getId(),
					type:'humanitary',
					state:1
					});
			context.bonusHumanitary++
		}
		//while(trigger){
			
		//	trigger = getChance()>context.woundChance[periodType]?false:true;
		//}
	})
	return context;
}
function mercenaryHelp(context){
	context.players.map(player=>{
		let bjzi;
		let trigger = getChance()>context.mercenaryHelpChance?false:true;
		//console.log(trigger);
		if(trigger){
			player.resources.push({id:getId(),
					type:'bjzi',
					state:1
					});
			context.bonusBjzi++
		}
		//while(trigger){
			
		//	trigger = getChance()>context.woundChance[periodType]?false:true;
		//}
	})
	return context;
}

function setPeriods(){
	let periods=[];
	for(let i=0;i<16;i++){
		periods.push({id:i+1,type:i%2?'war':'piece'});
	}
	return periods;
}

function setPlayers(context){
	let players=[];
	let bjzi=[];
	let humanitary=[];
	let gold=[];
	for(let x=0;x<context.startBjzi;x++){
	//console.log(context.startBjzi)
		bjzi.push({id:getId(),
					type:'bjzi',
					state:1
					});
	}
	//console.log(context.startBjzi)
	for(let x=0;x<context.startHumanitary;x++){
		humanitary.push({id:getId(),
					type:'humanitary',
					state:1
					});
	}
	for(let x=0;x<context.startGold;x++){
		gold.push({id:getId(),
					type:'gold',
					state:1
					});
	}
	
	//console.log(bjzi)
	
	for(let i=0;i<100;i++){
		let player={id:i,resources:bjzi.concat(humanitary).concat(gold),state:1,side:'acheans'}
		players.push(player);
	}
	
	for(let i=100;i<200;i++){
	let player={id:i,resources:bjzi.concat(humanitary).concat(gold),state:1,side:'troy'}
	players.push(player);
	}
	return players;
}

function getId(){
	return Math.floor(Math.random()*1000000000)+100000000;
}

function getChance(){
	return Math.floor(Math.random()*100);
}

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  woundChance_war:50,
	  woundChance_piece:10,
	  humanitaryHelpChance:10,
	  mercenaryHelpChance:1,
	  startBjzi:10,
	  startHumanitary:10,
	  startGold:1,
	  rows:statistic,
	  columns:[{
                 field: 'period',
                 label: 'Период'
                },
				{
                 field: 'periodType',
                 label: 'Тип периода'
                },{
                 field: 'bjzi',
                 label: 'Всего живых спутников'
                },{
                 field: 'bjziMiddle',
                 label: 'Спутников в среднем на персонажа'
                },{
                 field: 'bonusBjzi',
                 label: 'Введено дополнительно спутников'
                },{
                 field: 'humanitary',
                 label: 'Всего гуманитарки'
                },{
                 field: 'humanitaryMiddle',
                 label: 'Гуманитарки в среднем на персонажа'
                },{
                 field: 'bonusHumanitary',
                 label: 'Введено дополнительно гуманитарки'
                },{
                 field: 'live',
                 label: 'Всего живых персонажей'
                },{
                 field: 'dead',
                 label: 'Всего мертвых персонажей'
                },
				]
    }
  },
  mounted(){
	let simulation = new Simulation(this.woundChance_war,this.woundChance_piece,this.humanitaryHelpChance,this.mercenaryHelpChance,this.startBjzi,this.startHumanitary,this.startGold);
	console.log(simulation);
	simulation.start();
  },
  methods:{
	startSimulation(){
		statistic=[];
		let simulation = new Simulation(this.woundChance_war,this.woundChance_piece,this.humanitaryHelpChance,this.mercenaryHelpChance,this.startBjzi,this.startHumanitary,this.startGold);
		console.log(simulation);
		simulation.start();
		this.rows=statistic;
		this.$forceUpdate();
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
</style>
