<template>
<div class="b52">
	<b style="font-size:200%">Табель корпорации Олимп</b><br><b>о деяниях смертных</b><br><br>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
	<div></div>
	<div style="text-align:left;">
	  <b-table :data="players" 
			   :bordered="false" 
			   :hoverable="true" 
			   ref="table"
			   width='100%'
			   style="text-align:left;"
			   aria-next-label="Next page"
				aria-previous-label="Previous page"
				aria-page-label="Page"
				aria-current-label="Current page">
		<b-table-column field="index" label="№" width="40" numeric v-slot="props">
                {{ props.row.index }}
        </b-table-column>
		<b-table-column
                field="name"
                label="Герой"
				centered
                v-slot="props"
            >
                {{ props.row.name }}
            </b-table-column>
			<b-table-column
                field="honor"
                label="Слава"
                v-slot="props"
            >
                {{ props.row.honor }}
            </b-table-column>
			<b-table-column
                field="deeds"
                label="Деяния"
                v-slot="props"
            >
                <div v-for="deed in props.row.deeds">
				<span  :class="`tag ${deed.honor>0?'is-success':'is-danger'}`" style="font-size:100%;margin-bottom:5px;">{{ deed.description }}</span><br>
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
			this.players=players.data.sort((a,b)=>{
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
</style>
