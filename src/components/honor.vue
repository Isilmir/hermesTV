<template>
<div class="b52" style="width:100%;">
	<b style="font-size:200%">Зал Славы</b><br><b></b><br><br>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
	<div></div>
	<div style="text-align:left;width:100%;">
	  <b-table :data="players" 
			   :bordered="false" 
			   :hoverable="true" 
			   ref="table"

			   style="text-align:left;
					width:100%;"
>
		<b-table-column field="index" label="№" width="40" numeric v-slot="props">
                {{ props.row.index }}
        </b-table-column>
		<b-table-column
                field="name"
                label="Герой"
				centered
                v-slot="props"
				width="50%"
            >
                {{ props.row.name }}
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
				width="10"
            >
                <span v-if="props.row.honorChange>0" style="color:#229922;">▲</span>
				<span v-if="props.row.honorChange<0" style="color:#992222;">▼</span>
            </b-table-column>
			<b-table-column
                field="deeds"
                label="Деяния"
                v-slot="props"
				style="width:120"
            >
			
			<div class="flex-deeds">
				<!--<div class="deed-container" v-for="deedGroup in props.row.deedGroups" >
					<div class="deed-container-wrapper">-->
					<b-tooltip :label="deedGroup.description"
							position="is-bottom"  v-for="deedGroup in props.row.deedGroups" :key="deedGroup.name">
						<div :class="`deed ${deedGroup.degree}`">
						<img
							:src="require(`../assets/deeds/${deedGroup.name}.png`)"
							:class="`deed-img`"
						> </img>
						<span class="deed-count">{{ deedGroup.count }}</span>
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
export default {
  name: 'honor',
  data () {
    return {
      players: []
    }
  },
  async mounted(){
	loader_.classList.toggle('hidden');
	let players;
			try{
			players = await axios.get('https://blooming-refuge-12227.herokuapp.com/getPlayers/honor',
			{
				headers: {
				  'Content-Type': 'application/json'
				  //'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
				console.log(e.message);
			}
			this.players=players.data
									//.map(player=>{player.deedTypes=player.deeds.map(deed=>);return player;})
									.sort((a,b)=>{
									if (a.honor > b.honor) return -1; // если первое значение больше второго
									if (a.honor == b.honor) return 0; // если равны
									if (a.honor < b.honor) return 1; // если первое значение меньше второго
									}).map((el,i)=>{el.index=i+1;return el;});

			//console.log(this.players);
	loader_.classList.toggle('hidden');
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
	font-size:150%;
}
.deed-video{
	background:url(../assets/logo.png);
}
.deed{
	border: 1px solid black;
	border-radius:10%;
	//border:none;
	width:70px;
	height:70px;
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
}
.table{
	max-width:100px;
}
.bad{
	background-color:#ff0000
}
.good{
	background-color:#00ff00
}
</style>
