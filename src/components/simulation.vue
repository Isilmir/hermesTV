<template>
<div >
<B>Симуляция экономики игры</B><br><br>
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-left:50px; width:90%;">

	  <b-field label="Шанс получить ранение во время войны">
            <b-slider v-model="woundChance_war" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px" :max="98"></b-slider>
        </b-field>
		<b-field label="Шанс получить ранение во время мира">
            <b-slider v-model="woundChance_piece" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px"  :max="98"></b-slider>
        </b-field>
		<b-field label="Шанс вылечить ранение">
            <b-slider v-model="cureChance" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px"  :max="100"></b-slider>
        </b-field>
		<b-field label="Шанс получить гуманитарку за цикл">
            <b-slider v-model="humanitaryHelpChance" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator style="width:300px" :max="98"></b-slider>
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
		<b-button @click="startSimulation">Начать симуляцию</b-button><br><br>
<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
<b-tab-item label="Инструкция">
	<div style="text-align:left;margin-left:10%;margin-right:10%;">
		<div>Симуляция производится по циклам игры. Берется 200 абстрактных персонажей, с каждым из которых в течение цикла может произойти несколько событий.<br>
			В качестве результата смотрите графики и, если нужно, сырые данные в табличном виде</div><br>
		<div>Сейчас <b>не моделируются</b>: отряды и потеря гуманитарки из-за отсутствия отряда; перераспределение ресурсов между персонажами; использование тяжелого вооружения; не учитываются персонажи вышедшие второй ролью; убийство основного персонажа из пистолета.</div><br>
		<div>События, происходящие с персонажем за цикл:</div><br>
		<ol>
			<li><b>Персонаж может получить спутника.</b><br>
				С некоторой вероятностью и не больше одного за цикл</li>
			<li><b>Персонаж может получить гуманитарку.</b><br>
				С некоторой вероятностью, несколько за цикл. Механизм такой: проверяется шанс получить гуманитарку и если он успешен, то персонаж получает 
				гуманитарку и шанс проверяется еще раз. И еще. И так до бесконечности. Но если шанс окажется провален, то происходит переход к следующему шагу. 
				Таким образом учитывая, что шанс меньше 1, вероятность непрерывной цепочки будет стремительно убывать и в среднем персонаж может получить 1 гуманитарку, но некоторые получат 2 или даже 3</li>
			<li><b>Персонаж может быть ранен.</b><br>
				Механизм такой же как с гуманитаркой - персонаж может получить несколько ранений за цикл.<br>
				Если персонаж был ранен, то сначала проверяется шанс на лечение и в случае успеха тратится 1 гуманитарка<br>
				Если лечение не успешно, то персонаж теряет спутника<br>
				Если спутников нет, то умирает</li>
			<li><b>Персонаж тратит гуманитарку.</b><br>
				Если гуманитарки нет, то теряет спутника<br>
				Если спутников тоже нет, то умирает</li>
		</ol>
	</div>	

</b-tab-item>
<b-tab-item label="Графики">
<div>
<div><canvas id="Persons" style="heigh:100%;width:100%"></canvas></div><br>
<div><canvas id="MainChart" style="heigh:100%;width:100%"></canvas></div><br>
<div><canvas id="Middle" style="heigh:100%;width:100%"></canvas></div>
</div>
</b-tab-item>
<b-tab-item label="Данные">

		<b-table :data="rows" :columns="columns" :bordered="false" :hoverable="true" style="text-align:left;"></b-table> 
		

</b-tab-item>
</b-tabs>
</div>
</template>

<script>
let statistic=[];
class Simulation{
	constructor(woundChance_war,woundChance_piece,humanitaryHelpChance,mercenaryHelpChance,startBjzi,startHumanitary,startGold,cureChance) {
			this.periods = setPeriods();
			this.woundChance = {war:woundChance_war,piece:woundChance_piece};
			this.humanitaryHelpChance = humanitaryHelpChance;
			this.mercenaryHelpChance = mercenaryHelpChance;
			this.startBjzi = startBjzi;
			this.startHumanitary = startHumanitary,
			this.startGold = startGold;
			this.players = setPlayers(this);
			this.bonusHumanitary = 0;
			this.bonusBjzi = 0;
			this.cureChance = cureChance;
			}
			
	start(){
		//console.log('начали симуляцию')
		statistic.push(this.getStatistic({id:0,type:'start'}));
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
		let woundsMiddle=this.players.map(player=>player.wounds).reduce((sum,cur)=>sum+cur,0)/this.players.length;
		let live=this.players.filter(player=>player.state>0).length;
		let dead=this.players.filter(player=>player.state<0).length;
		let gold=this.players.map(player=>player.resources.filter(resource=>resource.type=='gold').length).reduce((sum,cur)=>sum+cur,0);
		return {period:period.id,periodType:period.type,bjzi:bjzi,bjziMiddle:bjziMiddle,bonusBjzi:this.bonusBjzi,humanitary:humanitary,bonusHumanitary:this.bonusHumanitary,live:live,dead:dead,gold:gold,humanitaryMiddle:humanitaryMiddle,woundsMiddle:woundsMiddle}
	}
}

function starve(context){
	 context.players.map(player=>{
		//console.log(player)
		if(player.state<0)return;
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
		if(player.state<0)return;
		let bjzi;
		let humanitary=player.resources.filter(resource=>resource.type=='humanitary');
		let cured;
		let wounded = getChance()>context.woundChance[periodType]*(player.resources.filter(resource=>resource.type=='bjzi').length/context.startBjzi+0.1)?false:true;
		let n=1;
		while(wounded){
			//if(n==100)return context;
			player.wounds++;
			cured = getChance()>context.cureChance?false:true;
			if(!cured){
				
				bjzi = player.resources.filter(resource=>resource.type=='bjzi');
				if(bjzi.length>0){
					player.resources=player.resources.filter(resource=>!(resource.id==bjzi[0].id&&resource.type=='bjzi'));
				}else{
					player.state=-1;
				}
			}else{
				humanitary=player.resources.filter(resource=>resource.type=='humanitary');
				bjzi = player.resources.filter(resource=>resource.type=='bjzi');
				if(humanitary.length>0){
					player.resources=player.resources.filter(resource=>!(resource.id==humanitary[0].id&&resource.type=='humanitary'))
										//console.log(player.resources.filter(resource=>resource.type=='humanitaryhumanitary').length);
				}else if(bjzi.length>0){
					player.resources=player.resources.filter(resource=>!(resource.id==bjzi[0].id&&resource.type=='bjzi'))	
				}else{
					player.state=-1;
				}
			}
			wounded = getChance()>context.woundChance[periodType]*(player.resources.filter(resource=>resource.type=='bjzi').length/context.startBjzi+0.1)?false:true;
			n++;
		}
	})
	return context;
}
function humanitaryHelp(context){
	context.players.map(player=>{
		player.wounds=0;
		if(player.state<0)return;
		let humanitary;
		let trigger = getChance()>context.humanitaryHelpChance?false:true;
		//console.log(trigger);
	//if(trigger){
		let n=1;
		while(trigger){
			if(n==2)return context;
			player.resources.push({id:getId(),
					type:'humanitary',
					state:1
					});
			context.bonusHumanitary++
	//}

			
			trigger = getChance()>context.humanitaryHelpChance?false:true;
			n++;
		}
	})
	return context;
}
function mercenaryHelp(context){
	context.players.map(player=>{
		if(player.state<0)return;
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
	
	for(let i=0;i<150;i++){
		let player={id:i,resources:bjzi.concat(humanitary).concat(gold),state:1,side:'acheans',wounds:0}
		players.push(player);
	}
	
	for(let i=150;i<300;i++){
	let player={id:i,resources:bjzi.concat(humanitary).concat(gold),state:1,side:'troy',wounds:0}
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

import Chart from 'chart.js';

	let ctx_main;
	let mainChart;	
	let ctx_middle;
	let personChart;
	let ctx_person;
	let middleChart;

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  woundChance_war:70,
	  woundChance_piece:30,
	  cureChance:5,
	  humanitaryHelpChance:70,
	  mercenaryHelpChance:1,
	  startBjzi:10,
	  startHumanitary:4,
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
                },{
				 field: 'woundsMiddle',
				 label: 'Ранений в среднем на персонажа'
				}
				],
	   ctx_main:document.getElementById('MainChart'),
	   mainChart:null,
	   ctx_middle:document.getElementById('Middle'),
	   personChart:null,
	   ctx_person:document.getElementById('Persons'),
	   middleChart:null
    }
  },
  mounted(){
	let simulation = new Simulation(this.woundChance_war,this.woundChance_piece,this.humanitaryHelpChance,this.mercenaryHelpChance,this.startBjzi,this.startHumanitary,this.startGold,this.cureChance);
	//console.log(simulation);
	simulation.start();
	//console.log(statistic);
	this.drawCharts();
  },
  methods:{
  
	startSimulation(){
		statistic=[];
		let simulation = new Simulation(this.woundChance_war,this.woundChance_piece,this.humanitaryHelpChance,this.mercenaryHelpChance,this.startBjzi,this.startHumanitary,this.startGold,this.cureChance);
		//console.log(simulation);
		simulation.start();
		this.rows=statistic;
		
		this.drawCharts();
		
		this.$forceUpdate();
	},
	
	drawCharts(){
		this.ctx_main = document.getElementById('MainChart');
		if(this.mainChart)this.mainChart.destroy();
		this.mainChart = new Chart(this.ctx_main,{
				type:'line',
				data:{labels: statistic.map(el=>el.period+' '+el.periodType)
					,datasets:[
						{label:'Спутники',data: statistic.map(el=>el.bjzi),borderColor:'#ff0000',fill:false},
						{label:'Добавлено спутников',data: statistic.map(el=>el.bonusBjzi),borderColor:'#ff9900',fill:false},
						{label:'Гуманитарка',data: statistic.map(el=>el.humanitary),borderColor:'#0000ff',fill:false},
						{label:'Добавлено гуманитарки',data: statistic.map(el=>el.bonusHumanitary),borderColor:'#0099ff',fill:false},
					]},
				options:{}
			})
			
		this.ctx_middle = document.getElementById('Middle');
		if(this.middleChart)this.middleChart.destroy();
		this.middleChart = new Chart(this.ctx_middle,{
				type:'line',
				data:{labels: statistic.map(el=>el.period+' '+el.periodType)
					,datasets:[
						{label:'Спутники среднее',data: statistic.map(el=>el.bjziMiddle),borderColor:'#ff0000',fill:false},
						{label:'Гуманитарка среднее',data: statistic.map(el=>el.humanitaryMiddle),borderColor:'#0000ff',fill:false},
						{label:'Среднее количество ранений на персонажа',data: statistic.map(el=>el.woundsMiddle),borderColor:'#00ffff',fill:false},
					]},
				options:{}
			})
		this.ctx_person = document.getElementById('Persons');
		if(this.personChart)this.personChart.destroy();
		this.personChart = new Chart(this.ctx_person,{
				type:'line',
				data:{labels: statistic.map(el=>el.period+' '+el.periodType)
					,datasets:[
						{label:'Живые персонажи',data: statistic.map(el=>el.live),borderColor:'#00ff00',fill:false},
						{label:'Мертвые персонажи',data: statistic.map(el=>el.dead),borderColor:'#000000',fill:false},
				]},
			options:{}
		})
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
