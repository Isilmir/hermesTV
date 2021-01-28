<template>
<div>

<d3-network :net-nodes="nodes" :net-links="links" :options="options" style="height:100%;width:100%"/>

</div>
</template>

<script>
import axios from 'axios'
import D3Network from 'vue-d3-network'

export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
	  nodes:[{id:3,name:'адын',_color:'#00ff00'},{id:2,name:'дыва',_color:'#00ff00'},{id:1,name:'тры',_color:'#ff0000'}],
	links:[{name:'линк адын',tid:1,sid:2,_color:'#ff0000'},{name:'линк дыва',tid:2,sid:1,_color:'#00ff00'},{name:'линк тры',tid:3,sid:1,_color:'#00ffff'}],
	options:{canvas:false,nodeSize:10,force:10000,linkWidth:1,nodeLabels:true,linkLabels:true,strLinks:true}
    }
  }
  ,async mounted(){
  console.log(`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`)
	//const graph = await axios.post('https://blooming-refuge-12227.herokuapp.com/getGraph',{
	//			id:42849,
	//			type:"player",
	//			deep:3
	//		},
	//	{
	//		headers: {
	//		  'Content-Type': 'application/json',
	//		  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
	//		}
	//	});
	//this.msg=graph;
	this.drawGraph();
  }
  ,methods:{
	async drawGraph () {
		this.req_status='loader'
      const response = await axios.post('https://blooming-refuge-12227.herokuapp.com/getGraph',{
				id:42849,
				type:"player",
				deep:3
			},
		{
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
	  //console.log('response.data',response.data)
	  let posts=[]
      /*this.posts = */response.data.map((el)=>posts.push(el))
	  let links=posts.map(el=>{return{sid:el.from.id,tid:el.to.id,_color:'#005500',name:el.description}})
	  //console.log(links)
	  this.links = links
		let nodes=[]
	  posts.filter(el=>{nodes.push({id:el.from.id,name:el.from.name,_color:this.setColor(el.from.objectType)})})
	  posts.filter(el=>{nodes.push({id:el.to.id,name:el.to.name,_color:this.setColor(el.to.objectType)})})
		let nodesPure=[]
		nodes.map(el=>{if(nodesPure.filter(ell=>ell.id==el.id).length>0){return;}else{nodesPure.push(el)}})
	  console.log(nodesPure)
	  this.nodes=nodesPure
	  this.req_status=''
	  
    },
	setColor(sys){
		switch(sys){
			case 1:
				return '#FF0000'
			break;
			case 19:
				return '#ffff00'
			break;
			case 'DIAFRONT':
				return '#0000ff'
			break;
			case 'RSA':
				return '#00ffff'
			break;
			case 'Transdekra':
				return '#00aa10'
			break;
			case 'S1':
				return '#00aa00'
			break;
			case 'S2':
				return '#aa0000'
			break;
			case 'S3':
				return '#0000aa'
			break;
			case 'S4':
				return '#aaaa00'
			break;
			default:
				return '#000000'
			break;
		}
		return '#000000'
	}
  }
  ,components:{
	D3Network
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
text.node-label{
	font-size:20;
	stroke-width:2;
}
</style>
