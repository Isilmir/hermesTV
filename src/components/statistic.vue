<template>
<div >
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
<B>Статистика по славе</B><br><br>
<div style="display:flex;flex-wrap:wrap;justify-content:space-between;margin-left:50px; width:90%;">

	  <div style="display:flex;flex-wrap:wrap;justify-content:center;"><b-field label="Начало периода">
            <b-datepicker
                v-model="start"
                
                locale="ru-RU"
                placeholder="Начало периода"
                icon="calendar"
                trap-focus>
            </b-datepicker>
        </b-field>
		<b-field label="Конец периода">
            <b-datepicker
                v-model="end"
                
                locale="ru-RU"
                placeholder="Конец периода"
                icon="calendar"
                trap-focus>
            </b-datepicker>
        </b-field></div>
		<div style="display:flex;flex-wrap:wrap;justify-content:center;">
		<span v-for="deedType in deedTypes" :key="deedType.id" style="border:1px solid black; border-radius:5px;margin:2px;padding:2px;">
		<b-checkbox v-model="deedType.checked">
                <b-tooltip 
							position="is-bottom" multilined style="font-family:'Arial';">
							<template v-slot:content>
							<div v-for="line in deedType.description.split(/[\r\n]/)" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								{{line}}
								</div>
							</div>
						</template>
								<div :class="`deed`" :style="`background-color:${deedType.defaultHonor==0?'#CCCCCC'
																				:deedType.defaultHonor<0?'#bb0000'
																				:'#00bb00'}`">
										<img :class="`deed-img`"
											:src="getImg(deedType.name)" style="width:30px;height:30px;"
										> </img>
								</div>
							</b-tooltip>
							
            </b-checkbox>
			</span>
		</div>
		<b-field label="Топ игроков по славе">
            <b-slider v-model="topN" :custom-formatter="(val) => val+'' " :tooltip="false" indicator style="width:300px"  :min="1" :max="200"></b-slider>
        </b-field>
		<!--<b-field label="Шанс получить гуманитарку за цикл">
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
        </b-field>-->
		</div>
		<b-button @click="showStatistic">Показать статистику</b-button><br><br>
<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
<b-tab-item label="Инструкция">
	<div style="text-align:left;margin-left:10%;margin-right:10%;">
		<ol>
			<li><b>Выбрать даты</b><br>
				</li>
			<li><b>Выбрать деяния</b><br>
				Если не выбрано ни одно - будут показаны все
				</li>
			<li><b>Указать топ игроков</b><br>
				</li>
			<li><b>Нажать кнопку</b><br>
				</li>
			
		</ol>
	</div>	

</b-tab-item>
<b-tab-item label="Графики">
<div>
<div><canvas id="MainChart" style="heigh:100%;width:100%"></canvas></div><br>
<div><canvas id="Sums" style="heigh:100%;width:100%"></canvas></div><br>
<div><canvas id="Top" style="heigh:100%;width:100%"></canvas></div>
</div>
</b-tab-item>
<b-tab-item label="Данные">

		<b-table :data="statistic" :bordered="false" :hoverable="true" style="text-align:left;">
			<b-table-column field="description" label="Тип деяния" v-slot="props">
					<b-tooltip 
							position="is-right" multilined style="font-family:'Arial';">
							<template v-slot:content>
							<div v-for="line in dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(el=>el.id==props.row.id)[0].description.split(/[\r\n]/)" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								{{line}}
								</div>
							</div>
						</template>
									<div :class="`deed`" :style="`background-color:${dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(el=>el.id==props.row.id)[0].defaultHonor==0?'#CCCCCC'
																				:dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(el=>el.id==props.row.id)[0].defaultHonor<0?'#bb0000'
																				:'#00bb00'}`">
										<img :class="`deed-img`"
											:src="getImg(dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(el=>el.id==props.row.id)[0].name)" style="width:30px;height:30px;"
										> </img>
								</div>
					</b-tooltip>
			</b-table-column>
			<b-table-column field="deeds_sum" label="Сумма славы всего" width="15%" v-slot="props">
									<b-tag>{{ props.row.deeds_sum }}</b-tag>
			</b-table-column>
			<b-table-column field="deeds_count" label="Количество деяний всего" width="15%" v-slot="props">
									<b-tag>{{ props.row.deeds_count }}</b-tag>
			</b-table-column>
			<b-table-column field="avg_honor_by_deed" label="Средняя слава на одно деяние" width="15%" v-slot="props">
									<b-tag>{{ props.row.avg_honor_by_deed }}</b-tag>
			</b-table-column>
			<b-table-column field="avg_honor_by_player" label="Средняя сумма славы на одного игрока" width="15%" v-slot="props">
									<b-tag>{{ props.row.avg_honor_by_player }}</b-tag>
			</b-table-column>
			<b-table-column field="honor_median" label="Медиана славы по количеству деяний" width="15%" v-slot="props">
									<b-tag>{{ props.row.honor_median }}</b-tag>
			</b-table-column>
			<b-table-column field="honor_percent_by_n_players" :label="`Сумма славы у топ ${topN} игроков`" width="15%" v-slot="props">
									<b-tag>{{ props.row.honor_sum_by_n_players }}</b-tag>
			</b-table-column>
			<b-table-column field="honor_sum_by_n_players" :label="`Процент славы у топ ${topN} игроков`" width="15%" v-slot="props">
									<b-tag>{{ props.row.honor_percent_by_n_players }}</b-tag>
			</b-table-column>
			<b-table-column field="users_all" label="Всего игроков с этим деянием" width="15%" v-slot="props">
									<b-tag>{{ props.row.users_all }}</b-tag>
			</b-table-column>
		</b-table> 
		

</b-tab-item>
</b-tabs>
</div>
</template>

<script>
import axios from 'axios'
import Chart from 'chart.js';

export default {
  name: 'Statistic',
  data () {
    return {
		dictionaries:[{dict:'deedTypes',data:[{description:''}]}],
		start:new Date('2021-01-01'),
		end:new Date('2022-01-01'),
		deedTypes:[],
		topN:10,
		activeTab:1,
	  
	  statistic:[],
	  //rows:this.statistic,
	   ctx_main:document.getElementById('MainChart'),
	   mainChart:null,
	   ctx_middle:document.getElementById('Top'),
	   personChart:null,
	   ctx_person:document.getElementById('Sums'),
	   middleChart:null
    }
  },
  async mounted(){
	this.loader_=document.getElementById('loader_');
	await this.fetchDictionaries();
	//let simulation = new Simulation(this.woundChance_war,this.woundChance_piece,this.humanitaryHelpChance,this.mercenaryHelpChance,this.startBjzi,this.startHumanitary,this.startGold,this.cureChance);
	//console.log(simulation);
	//simulation.start();
	//console.log(statistic);
	//this.drawCharts();
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
	async showStatistic(){
		console.log('рисуем графики',this.deedTypes.filter(el=>el.checked).map(el=>{return el.id}),this.start.toISOString(),this.end.toISOString());
		this.loader_.classList.toggle('hidden');
			let res;
			try{
			res = await axios.post('https://blooming-refuge-12227.herokuapp.com/getHonorStatistic',{
						deedTypes:this.deedTypes.filter(el=>el.checked).map(el=>{return el.id}),
						start:this.start.toISOString().replace('T',' '),
						end:this.end.toISOString().replace('T',' '),
						n:this.topN
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
				this.loader_.classList.toggle('hidden');
				return;
			}
		this.statistic=res.data;
		this.drawCharts();
		console.log(this.statistic);
		this.loader_.classList.toggle('hidden');
	},
	drawCharts(){
		this.ctx_main = document.getElementById('MainChart');
		if(this.mainChart)this.mainChart.destroy();
		this.mainChart = new Chart(this.ctx_main,{
				type:'bar',
				data:{labels: this.statistic.map(el=>this.dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(deed=>deed.id==el.id)[0].description)
					,datasets:[
						{label:'Средняя слава на одно деяние',data: this.statistic.map(el=>el.avg_honor_by_deed),fill:true,backgroundColor:'#ffb400'},
						{label:'Средняя сумма славы на одного игрока',data: this.statistic.map(el=>el.avg_honor_by_player),fill:true,backgroundColor:'#2994b2'},
						{label:'Медиана славы по количеству деяний',data: this.statistic.map(el=>el.honor_median),fill:true,backgroundColor:'#474744'}
					]},
				options:{}
			})
			
		this.ctx_middle = document.getElementById('Top');
		if(this.middleChart)this.middleChart.destroy();
		this.middleChart = new Chart(this.ctx_middle,{
				type:'bar',
				data:{labels: this.statistic.map(el=>this.dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(deed=>deed.id==el.id)[0].description)
					,datasets:[
						{label:'Количество деяний всего',data: this.statistic.map(el=>el.deeds_count),fill:true,backgroundColor:'#ffb400'},
						{label:'Всего игроков с этим деянием',data: this.statistic.map(el=>el.users_all),fill:true,backgroundColor:'#474744'},
						{label:`Процент славы у топ ${this.topN} игроков`,data: this.statistic.map(el=>el.honor_percent_by_n_players),fill:true,backgroundColor:'#2994b2'},
					]},
				options:{}
			})
		this.ctx_person = document.getElementById('Sums');
		if(this.personChart)this.personChart.destroy();
		this.personChart = new Chart(this.ctx_person,{
				type:'bar',
				data:{labels: this.statistic.map(el=>this.dictionaries.filter(el=>el.dict=='deedTypes')[0].data.filter(deed=>deed.id==el.id)[0].description)
					,datasets:[
						{label:'Сумма славы всего',data: this.statistic.map(el=>el.deeds_sum),fill:true,backgroundColor:'#ffb400'},
						{label:`Сумма славы у топ ${this.topN} игроков`,data: this.statistic.map(el=>el.honor_sum_by_n_players),fill:true,backgroundColor:'#2994b2'}
				]},
			options:{}
		})
	}
	,async fetchDictionaries(){
			this.loader_.classList.toggle('hidden');
			let dictionaries;
			try{
			dictionaries = await axios.post('https://blooming-refuge-12227.herokuapp.com/getDictionaries',{
						"dicts":['deedTypes']
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
			this.deedTypes=this.dictionaries.filter(el=>el.dict=='deedTypes')[0].data.map(el=>{return {id:el.id,name:el.name,description:el.description,defaultHonor:el.defaultHonor,checked:false}});
			this.loader_.classList.toggle('hidden');
			//console.log ('dictionaries',this.dictionaries);
		}
	,getImg(deedType){
		let res
		try{
			res=require(`../assets/deeds/${deedType}.png`);
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
.deed{
	//border: 1px solid black;
	border-radius:10%;
	//border:none;
	width:30px;
	height:30px;
	//display:grid;
	grid-template-rows:  2fr 1fr;
	grid-template-columns: 2fr 1fr;
	//aspect-ratio: 1 / 1;
	margin:5px;
}
.flex-deeds{
	display:flex;
	height:100%;
	width:70%;
	flex-wrap: wrap;
	//position: relative;
}
</style>
