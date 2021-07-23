<template>
<div>
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>

<div v-for="line in message.split(/[\r\n]/)" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								{{line}}
								</div>
							</div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Message',
  data () {
    return {
	message:''
    }
  }
  ,async mounted(){
  this.loader_=document.getElementById('loader_');
  console.log(this.$route.query.id,this.$route.query.type,this.$route.query.deep);
	this.showMessage();
  }
  ,methods:{
	async showMessage () {
		//this.req_status='loader'
		this.loader_.classList.toggle('hidden');
		let response;
		try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/messages/${this.$route.query.id}`,
			{
			headers: {
			  'Content-Type': 'application/json',
			  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
			}
		});
		}catch(e){
		this.loader_.classList.toggle('hidden');
		console.log(e.message);
		this.message='Увы, что-то пошло не так и мы не смогли показать сообщение'
		return;
		}
		this.loader_.classList.toggle('hidden');
	  console.log('response.data',response.data)
	  this.message=response.data.description;
	  //let posts=[]
      /*this.posts = */ //response.data.map((el)=>posts.push(el))
	  /*let links=posts.map(el=>{if(!el.from.id||!el.to.id){return;}return{sid:el.from.id,tid:el.to.id,_color:'#005500',name:el.description}}).filter(el=>el)
	  //console.log(links)
	  this.links = links
		let nodes=[]
	  posts.filter(el=>{if(!el.from.id){return;}nodes.push({id:el.from.id,name:el.from.name,_color:this.setColor(el.from.objectType)})})
	  posts.filter(el=>{if(!el.to.id){return;}nodes.push({id:el.to.id,name:el.to.name,_color:this.setColor(el.to.objectType)})})
		nodes = nodes.filter(el=>el);
		let nodesPure=[]
		nodes.map(el=>{if(nodesPure.filter(ell=>ell.id==el.id).length>0){return;}else{nodesPure.push(el)}})
	  //console.log(nodesPure,nodes,links)
	  this.nodes=nodesPure
	  this.req_status=''
	  if(this.nodes.length==0)this.nodes.push({id:1,name:`Не удалось найти такой объект с типом ${this.$route.query.type}`})*/
    },
	setColor(sys){
		switch(sys){
			case 'player':
				return '#cc0000'
			break;
			case 'story':
				return '#cccc00'
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
	,lcb (link) {
      return link
    }
  }
  ,components:{
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
