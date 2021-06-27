<template>
<div>
<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
Управление персонажами<br><br>

<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">

<!--Персонажи-->
<b-tab-item label="Персонажи">
<div style="display:flex;margin-bottom:10px;justify-content:space-between;">
 <b-field label="Сортировка" >
            <div style="display:flex;">
			<b-select placeholder="Select a name" v-model="playerSortProp">
                <option
                    v-for="option in [{id:'name',name:'Имя персонажа'},{id:'honor',name:'Слава'},{id:'squadName',name:'Название отряда'},{id:'sideDescription',name:'Сторона конфликта'}]"
                    :value="option.id"
                    :key="option.id">
                    {{ option.name }}
                </option>
            </b-select><b-switch v-model="playerSortOrder" true-value="1" false-value="-1" passive-type='is-success' @input="isOpenPlayer=-1">{{ playerSortOrder>0?`Вверх`:`Вниз` }}</b-switch>
			</div>
        </b-field>
<b-field label="Фильтры" >
            <div style="display:flex;">
			<b-autocomplete
				v-model="filteredSideName"
				placeholder="Сторона"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredSides_forFilter"
				field="description"
				_input="option => {console.log(newPlayerName,option,filteredPlayers)}"
				@select="option => {filters.sides=[{description:option.description,id:option.id}];isOpenPlayer=-1;console.log('!!!',option);}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete>
			<b-autocomplete
				v-model="filteredSquadName"
				placeholder="Название отряда"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredSquads_forFilter"
				field="name"
				_input="option => {console.log(newPlayerName,option,filteredPlayers)}"
				@select="option => {filters.squads=[{name:option.name,id:option.id}];isOpenPlayer=-1;console.log('!!!',option);}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete>
			<b-autocomplete
				v-model="filteredPlayerName"
				placeholder="Имя персонажа"
				:keep-first="false"
				:open-on-focus="true"
				:data="filteredPlayers_forFilter"
				field="name"
				_input="option => {console.log(newPlayerName,option,filteredPlayers)}"
				@select="option => {filters.players=[{name:option.name,id:option.id}];isOpenPlayer=-1;console.log('!!!',option);}"
				:clearable="true"
				style="min-width:10px"
			></b-autocomplete>
			<b-button v-if="filters.players.length>0||filters.sides.length>0||filters.squads.length>0" @click="filters={sides:[],squads:[],players:[]};filteredPlayerName='';filteredSideName='';filteredSquadName='';isOpenPlayer=-1;" type="is-warning" style="max-width:100px;margin-left:10px">Сбросить</b-button>
			</div>
        </b-field>
</div>
<b-collapse
            class="card"
            animation="slide"
            v-for="(player, index) of playersWithFilters"
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
                        <span><span v-if="player.stateId!=3">{{player.name}}</span><s v-if="player.stateId==3">{{player.name}}</s> ({{player.sideDescription}})</span> <!--<router-link :to="`/graph?id=${player.id}&type=${player.objectType}&deep=${deep}`" target="_blank">посмотреть граф</router-link>-->
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
									<div class="player_deeds_list">
										<!--
											<div class="" style="display:flex;justify-content: space-around;">
												<b-field label="Тип деяния"></b-field>
												<b-field label="Дата"></b-field>
												<b-field label="Время"></b-field>
												<b-field label="Описание деяния"></b-field>
												<b-field label="Слава"></b-field>
												<b-field label=" "></b-field>
											</div>
											<div class="" v-for="(deed,deedIndex) in curPlayer.deeds" :key="deed.id" style="display:flex;justify-content: space-around;">
												<b-input v-model="curPlayer.deeds[deedIndex].type.description" maxlength="255" disabled></b-input>
												<b-input :value="curPlayer.deeds[deedIndex].date.match(/\d\d\d\d-\d\d-\d\d/)[0]" maxlength="255" placeholder="Дата начисления" disabled></b-input>
												<b-input :value="curPlayer.deeds[deedIndex].date.match(/\d\d:\d\d:\d\d/)[0]" maxlength="255" placeholder="Дата начисления" disabled></b-input>
												<b-input v-model="curPlayer.deeds[deedIndex].description" maxlength="255" placeholder="Описание деяния" ></b-input>
												<b-input  v-model="curPlayer.deeds[deedIndex].honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
												<b-button @click="updateDeed(curPlayer,{id:deed.id,type:deed.objectType,description:deed.description,type:deed.type,honor:deed.honor})" type="is-success">✔</b-button>
												<b-button @click="deleteDeed(curPlayer,{id:deed.id,type:deed.objectType,description:deed.description,type:deed.type,honor:deed.honor})" type="is-danger">☓</b-button>
											</div>-->
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
												@select="option => {newDeed.type = {defaultHonor:option.defaultHonor,description:option.description,id:option.id,name:option.name,visible:option.visible};newDeed.honor = option.defaultHonor;newDeed.heroic=false;console.log(newDeed)}"
												:clearable="true"
												style="min-width:400px"
											>
											</b-autocomplete>
											<!--<b-input v-model="newDeed.description" maxlength="255" placeholder="Описание деяния" style="min-width:400px"></b-input>-->
											<textarea class="story_textarea" v-model="newDeed.description" placeholder="Описание деяния" style="margin-left:10px;margin-right:10px"></textarea>
											<b-input v-model="newDeed.honor" type="number" maxlength="255" placeholder="Очки Славы" style="margin-right:10px"></b-input>
											<b-switch v-model="newDeed.heroic" >{{ newDeed.heroic?`Героическое`:`Не героическое` }}</b-switch>
											<div>
												<div :class="`deed`" :style="`background-color:${newDeed.color?newDeed.color:activeDeedGroup=='achievment'?'#999999':newDeed.honor>0?'#00bb00':'#bb0000'}`">
													<img :class="`deed-img`"
														:src="getImg(newDeed.type.name)" style="width:30px"
													> </img>
													<span :class="`deed-count`" >{{ newDeed.heroic?''/*'★'*/:1 }}</span>
												</div>
												<b-input placeholder="#9Ab"
												  type="text"
												  v-model="newDeed.color"
												  validation-message="Only lowercase is allowed"
												  pattern="#([0-9a-fA-F]{3}){1,2}">
												</b-input>
												<!--<b-input
												  type="color"
												  v-model="newDeed.color">
												</b-input>-->
											</div>
											<b-button @click="addDeed(curPlayer,newDeed)" type="is-success">✔</b-button>
										</div>
									</div>
							</div>
					<b-tabs type="is-boxed" position="is-centered" v-model="activeDeedGroup">
						<template><b-tab-item label="Медийные" value="media">
							<b-table :data="curPlayer.deeds.filter(deed=>!(deed.type.id==33||deed.type.id==32||deed.type.id==34||deed.type.id==35||deed.type.id==45||deed.type.id==46||deed.type.id==47||deed.type.id==48
																||deed.type.id==49||deed.type.id==50||deed.type.id==51||deed.type.id==52
																||deed.type.id==53||deed.type.id==54||deed.type.id==55||deed.type.id==56
																||deed.type.id==57||deed.type.id==58||deed.type.id==59||deed.type.id==60||deed.type.id==61||deed.type.id==62||deed.type.id==63||deed.type.id==64||deed.type.id==67))" 
										   :bordered="false" 
										   :hoverable="true" 
										   ref="table"

										   style="text-align:left;
												width:100%;"
							>
							<b-table-column field="type.description" label="Тип деяния" width="15%" v-slot="props">
									<b-tag>{{ props.row.type.description }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Дата"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d\d\d-\d\d-\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Время" width="5%"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d:\d\d:\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="description" label="Описание деяния" width="45%"  v-slot="props">
									<textarea class="story_textarea" v-model="props.row.description"></textarea>
							</b-table-column>
							<b-table-column field="honor" label="Слава" width="15%"  v-slot="props">
									<b-input  v-model="props.row.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
							</b-table-column>
							<b-table-column field="heroic" label="Героическое" width="10%"  v-slot="props">
									<b-switch v-model="props.row.heroic" >{{ props.row.heroic?`Героическое`:`Не героическое` }}</b-switch>
							</b-table-column>
							<b-table-column field="color" label="Цвет" width="9%"  v-slot="props">
								<div :class="`deed`" :style="`background-color:${props.row.color?props.row.color:props.row.honor>0?'#00bb00':'#bb0000'}`">
									<img :class="`deed-img`"
										:src="getImg(props.row.type.name)" style="width:30px"
									> </img>
									<span :class="`deed-count`" >{{ props.row.heroic?''/*'★'*/:1 }}</span>
								</div>
								<b-input placeholder="#9Ab"
								  type="text"
								  v-model="props.row.color"
								  validation-message="Only lowercase is allowed"
								  pattern="#([0-9a-fA-F]{3}){1,2}">
								</b-input>
								<!--<b-input
								  type="color"
								  v-model="props.row.color">
								</b-input>-->
							</b-table-column>
							<b-table-column field="honor" label=" " width="10%"  v-slot="props">
									<b-button @click="updateDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor,heroic:props.row.heroic,color:props.row.color})" type="is-success">✔</b-button>
									<b-button @click="deleteDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor})" type="is-danger">☓</b-button>
							</b-table-column>
							</b-table>
						</b-tab-item></template>
						<template><b-tab-item label="Боевые" value="war">
							<b-table :data="curPlayer.deeds.filter(deed=>deed.type.id==33||deed.type.id==32||deed.type.id==34||deed.type.id==35||deed.type.id==63||deed.type.id==64)" 
										   :bordered="false" 
										   :hoverable="true" 
										   ref="table"

										   style="text-align:left;
												width:100%;"
							>
							<b-table-column field="type.description" label="Тип деяния" width="15%" v-slot="props">
									<b-tag>{{ props.row.type.description }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Дата"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d\d\d-\d\d-\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Время" width="5%"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d:\d\d:\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="description" label="Описание деяния" width="45%"  v-slot="props">
									<textarea class="story_textarea" v-model="props.row.description"></textarea>
							</b-table-column>
							<b-table-column field="honor" label="Слава" width="15%"  v-slot="props">
									<b-input  v-model="props.row.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
							</b-table-column>
							<b-table-column field="heroic" label="Героическое" width="10%"  v-slot="props">
									<b-switch v-model="props.row.heroic" >{{ props.row.heroic?`Героическое`:`Не героическое` }}</b-switch>
							</b-table-column>
							<b-table-column field="color" label="Цвет" width="9%"  v-slot="props">
								<div :class="`deed`" :style="`background-color:${props.row.color?props.row.color:props.row.honor>0?'#00bb00':'#bb0000'}`">
									<img :class="`deed-img`"
										:src="getImg(props.row.type.name)" style="width:30px"
									> </img>
									<span :class="`deed-count`" >{{ props.row.heroic?''/*'★'*/:1 }}</span>
								</div>	
								<b-input placeholder="#9Ab"
								  type="text"
								  v-model="props.row.color"
								  validation-message="Only lowercase is allowed"
								  pattern="#([0-9a-fA-F]{3}){1,2}">
								</b-input>
								<!--<b-input
								  type="color"
								  v-model="props.row.color">
								</b-input>-->
							</b-table-column>
							<b-table-column field="honor" label=" " width="10%"  v-slot="props">
									<b-button @click="updateDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor,heroic:props.row.heroic,color:props.row.color})" type="is-success">✔</b-button>
									<b-button @click="deleteDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor})" type="is-danger">☓</b-button>
							</b-table-column>
							</b-table>
						</b-tab-item></template>
						<template><b-tab-item label="Ачивки"  value="achievment">
							<b-table :data="curPlayer.deeds.filter(deed=>deed.type.id==45||deed.type.id==46||deed.type.id==47||deed.type.id==48
																||deed.type.id==49||deed.type.id==50||deed.type.id==51||deed.type.id==52
																||deed.type.id==53||deed.type.id==54||deed.type.id==55||deed.type.id==56
																||deed.type.id==57||deed.type.id==58||deed.type.id==59||deed.type.id==60||deed.type.id==61||deed.type.id==62||deed.type.id==67)" 
										   :bordered="false" 
										   :hoverable="true" 
										   ref="table"

										   style="text-align:left;
												width:100%;"
							>
							<b-table-column field="type.description" label="Тип деяния" width="15%" v-slot="props">
									<b-tag>{{ props.row.type.description }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Дата"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d\d\d-\d\d-\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="date" label="Время" width="5%"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d:\d\d:\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="description" label="Описание деяния" width="45%"  v-slot="props">
									<textarea class="story_textarea" v-model="props.row.description"></textarea>
							</b-table-column>
							<b-table-column field="honor" label="Слава" width="15%"  v-slot="props">
									<b-input  v-model="props.row.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
							</b-table-column>
							<b-table-column field="heroic" label="Героическое" width="10%"  v-slot="props">
									<b-switch v-model="props.row.heroic" >{{ props.row.heroic?`Героическое`:`Не героическое` }}</b-switch>
							</b-table-column>
							<b-table-column field="color" label="Цвет" width="9%"  v-slot="props">
								<div :class="`deed`" :style="`background-color:${props.row.color?props.row.color:'#999999'}`">
									<img :class="`deed-img`"
										:src="getImg(props.row.type.name)" style="width:30px"
									> </img>
									<span :class="`deed-count`" >{{ props.row.heroic?''/*'★'*/:1 }}</span>
								</div>
								<b-input placeholder="#9Ab"
								  type="text"
								  v-model="props.row.color"
								  validation-message="Only lowercase is allowed"
								  pattern="#([0-9a-fA-F]{3}){1,2}">
								</b-input>
								<!--<b-input
								  type="color"
								  v-model="props.row.color">
								</b-input>-->
							</b-table-column>
							<b-table-column field="honor" label=" " width="10%"  v-slot="props">
									<b-button @click="updateDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor,heroic:props.row.heroic,color:props.row.color})" type="is-success">✔</b-button>
									<b-button @click="deleteDeed(curPlayer,{id:props.row.id,type:props.row.objectType,description:props.row.description,type:props.row.type,honor:props.row.honor})" type="is-danger">☓</b-button>
							</b-table-column>
							</b-table>
						</b-tab-item></template>
					</b-tabs>
								<!--<div class="player-deeds">
									<div class="player_deeds_list">

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
												@select="option => {newDeed.type = option;newDeed.honor = option.defaultHonor;newDeed.heroic=false;console.log(newDeed)}"
												:clearable="true"
												style="min-width:400px"
											>
											</b-autocomplete>

											<textarea class="story_textarea" v-model="newDeed.description" placeholder="Описание деяния" style="margin-left:10px;margin-right:10px"></textarea>
											<b-input v-model="newDeed.honor" type="number" maxlength="255" placeholder="Очки Славы" style="margin-right:10px"></b-input>
											<b-switch v-model="newDeed.heroic" >{{ newDeed.heroic?`Героическое`:`Не героическое` }}</b-switch>
											<b-button @click="addDeed(curPlayer,newDeed)" type="is-success">✔</b-button>
										</div>
									</div>
								</div>-->
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
<b-tab-item label="Стратегия">
	<b-button @click="fetchWarProgress()" type="is-info">Обновить</b-button>
	<b-table v-if="warProgress.length>0" :data="warProgress" :bordered="false" :hoverable="true" ref="table" style="text-align:left; width:100%;">
							<b-table-column field="type.description" label="cycleId" width="50" v-slot="props">
									<b-tag>{{ props.row.cycleId }}</b-tag>
							</b-table-column>
							<b-table-column v-for="checkpoint in warProgress[0].checkpoints" field="type.description" :key="checkpoint.checkpointId" :label="checkpoint.checkpointName" width="50">
							<template v-slot:header="{ column }">
								<div>{{ column.label }}</div>
								<b-select placeholder="Статус точки" v-model="dictionaries.filter(el=>el.dict=='checkpoints')[0].data.filter(el => el.id==checkpoint.checkpointId)[0].stateId" 
											v-if="dictionaries.filter(el=>el.dict=='checkpointStates')[0]"
											@input="setCheckpointState(checkpoint.checkpointId,dictionaries.filter(el=>el.dict=='checkpoints')[0].data.filter(el => el.id==checkpoint.checkpointId)[0].stateId)"
											>
									<option
										v-for="option in dictionaries.filter(el=>el.dict=='checkpointStates')[0].data"
										:value="option.id"
										:key="option.id"
										@input="setCheckpointState(checkpoint.checkpointId,option.id)"
										>
										{{ option.name }}
									</option>
								</b-select>
								<!--<b-tooltip :label="column.label" append-to-body dashed>
									{{ column.label }}
								</b-tooltip>-->
							</template>
							<template v-slot="props">
							<div :class="`checkpoint_state_${props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].checkpointStateId}`"  style="width:100px">
									<!--<b-tag style="width:50px">{{ props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].warProgressId }}</b-tag><br>-->
									<span v-if="dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad => squad.id==props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].squadId)[0]">{{ dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad => squad.id==props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].squadId)[0].name }}
									<b-tooltip :label="`${dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad => squad.id==props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].squadId)[0].name}`"
									position="is-top">
									<img :class="`deed-img`"
														:src="getSquadLogo(props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].squadId)" style="width:40px;height:40px;"
													> </img></b-tooltip>
									</span>
									<br>
									<b-tooltip label="Начислить славу"
									position="is-bottom">
									<b-button v-if="props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].ishonorgiven===false" @click="setHonorforCheckpoint(props.row.checkpoints.filter(el=>el.checkpointId==checkpoint.checkpointId)[0].warProgressId)" type="is-primary is-light" style="width:25px;height:25px;">✔</b-button>
									</b-tooltip>
							</div>
							</template>
							</b-table-column>
							</b-table>
</b-tab-item>
<b-tab-item label="Сообщения">
<b-field label="Добавить сообщение">
										</b-field>
										<div class="" style="display:flex;justify-content: space-around;">
											<b-autocomplete
												v-model="newMessagePlayerName"
												placeholder="Начните вводить имя игрока"
												:keep-first="false"
												:open-on-focus="true"
												:data="filteredPlayers_message"
												field="name"
												@select="option => {newMessage.player = JSON.parse(JSON.stringify(option));console.log(newMessage)}"
												:clearable="true"
												style="min-width:400px"
											></b-autocomplete>
											<b-autocomplete
												v-model="newMessageTypeDescription"
												placeholder="Начните вводить тип деяния"
												:keep-first="false"
												:open-on-focus="true"
												:data="filteredDeedTypes_message"
												field="description"
												@select="option => {newMessage.type = JSON.parse(JSON.stringify(option));console.log(newMessage)}"
												:clearable="true"
												style="min-width:400px"
											>
											</b-autocomplete>
											<!--<b-input v-model="newDeed.description" maxlength="255" placeholder="Описание деяния" style="min-width:400px"></b-input>-->
											<textarea class="story_textarea" v-model="newMessage.description" placeholder="Послание персонажу" style="margin-left:10px;margin-right:10px"></textarea>
											<!--<b-input v-model="newDeed.honor" type="number" maxlength="255" placeholder="Очки Славы" style="margin-right:10px"></b-input>
											<b-switch v-model="newDeed.heroic" >{{ newDeed.heroic?`Героическое`:`Не героическое` }}</b-switch>-->
											<b-button @click="addMessage(newMessage)" type="is-success">✔</b-button>
										</div>
<b-table :data="messages" 
		:bordered="false" 
		:hoverable="true" 
		ref="table"

		style="text-align:left;
		width:100%;"
		>
							<b-table-column field="player.name" label="Персонаж" width="15%" v-slot="props">
									<b-tag>{{ props.row.player.name }}</b-tag>
							</b-table-column>
							<b-table-column field="deed.date" label="Дата" width="15%" v-slot="props">
									<b-tag>{{ props.row.deed.date.match(/\d\d\d\d-\d\d-\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="description" label="Сообщение" width="50%" v-slot="props">
									<textarea class="story_textarea" v-model="props.row.description"></textarea>
							</b-table-column>
							<b-table-column field="type" label="Тип деяния"  v-slot="props">
									<b-tag>{{ props.row.deed.deedType.description }}</b-tag>
							</b-table-column>
							<!--<b-table-column field="date" label="Время" width="5%"  v-slot="props">
									<b-tag>{{ props.row.date.match(/\d\d:\d\d:\d\d/)[0] }}</b-tag>
							</b-table-column>
							<b-table-column field="description" label="Описание деяния" width="50%"  v-slot="props">
									<textarea class="story_textarea" v-model="props.row.description"></textarea>
							</b-table-column>
							<b-table-column field="honor" label="Слава" width="15%"  v-slot="props">
									<b-input  v-model="props.row.honor" type="number" maxlength="255" placeholder="Очки Славы"></b-input>
							</b-table-column>
							<b-table-column field="heroic" label="Героическое" width="10%"  v-slot="props">
									<b-switch v-model="props.row.heroic" >{{ props.row.heroic?`Героическое`:`Не героическое` }}</b-switch>
							</b-table-column>-->
							<b-table-column field="update" label=" " width="10%"  v-slot="props">
									<b-button @click="updateMessage(props.row)" type="is-success">✔</b-button>
									<b-button @click="deleteMessage({id:props.row.id})" type="is-danger">☓</b-button>
							</b-table-column>
							</b-table>
</b-tab-item>
<b-tab-item label="Массовое начисление славы">
	<b-tabs type="is-boxed" position="is-centered">
		<b-tab-item label="Деяния">
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
						@input="option => {console.log(newPlayerName,option,filteredPlayers)}"
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
													<b-switch v-model="mass_players_deed.heroic" >{{ mass_players_deed.heroic?`Героическое`:`Не героическое` }}</b-switch>
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
		<b-tab-item label="Субботнее подкрепление">
			<b-button @click="makeReinforcementsAwaiting()" type="is-danger">Отправить подкрепления в Троаду</b-button>
		</b-tab-item>
	</b-tabs>
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
<b-tab-item label="Конфиг">
	<div v-for="storage in configStorages" :label="storage">
		<b-field :label="storage"></b-field>
		<div class="" v-for="configVar in config.filter(el=>el.storage==storage)" :key="configVar.id" style="display:flex;justify-content: space-around; align-items:flex-start">
				<b-input v-model="configVar.description" maxlength="255" disabled width="500" type="text"></b-input>
				<!--<b-input v-model="configVar.key_" maxlength="255" disabled></b-input>-->
				<b-field :label="configVar.valueType" label-position="on-border"><b-input v-model="configVar.value" :type="'text'" ></b-input><br></b-field>
				<b-button @click="updateConfig(configVar)" type="is-success">✔</b-button>
		</div>
	</div>
</b-tab-item>
<b-tab-item label="Синхронизация с JoinRPG">
	Дата последней синхронизации: <b>{{lastUpdate}}</b><br>
	<b-button @click="startJoinrpgSync()" type="is-success">Синхронизировать</b-button>
</b-tab-item>
</b-tabs>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'players',
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
	  newDeed:{type:{},
				description:'',
				honor:'',
				heroic:false
				},
	  newDeedName:'',
	  newDeedName_mass:'',
	  newPlayerName:'',// тестовые значения для поисковых фильтров задавать только так - через отдельное корневое свойство. Иначе все сломается. Уж поверь.
	  sideName:'',
	  squadName:'',
	  filteredPlayerName:'',
	  filteredSideName:'',
	  filteredSquadName:'',
	  newDeedType:{name:'',
					description:'',
					defaultHonor:0,
					visible:false},
	  selected:null,
	  mass_players_deed:{type:'',
				description:'',
				honor:'',
				heroic:false,
				players:[]},
	  newStory:{},
	  dictionaries:[{dict:'sides',data:[{description:''}]},{dict:'squads',data:[{name:''}]}],
	  filters:{sides:[],squads:[],players:[]},
	  playerSortProp:'name',
	  playerSortOrder:1,
	  lastUpdate:'',
	  activeDeedGroup:'media',
	  messages:[],
	  newMessage:{
				description:'',
				type:{description:'',id:58},
				player:{name:''}
				},
	  newMessagePlayerName:'',
	  newMessageTypeDescription:'',
	  config:[],
	  configStorages:[],
	  warProgress:[]
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
		filteredPlayers_message() {
            return this.players.filter(player => {
                return (
                    player.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newMessagePlayerName.toLowerCase()) >= 0
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
		filteredDeedTypes() {
			//if(this.newDeedName=='')return this.deedTypes;
			//console.log(this.deedTypes,this.activeDeedGroup,this.deedTypes.filter(deedType=>{
			//	(this.activeDeedGroup==0&&(!(deedType.id==33||deedType.id==32||deedType.id==34||deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
			//													||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
			//													||deedType.id==53||deedType.id==54||deedType.id==55)))
			//	||(this.activeDeedGroup==1&&(deedType.id==33||deedType.id==32||deedType.id==34))
			//	||(this.activeDeedGroup==2&&deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
			//													||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
			//													||deedType.id==53||deedType.id==54||deedType.id==55)
			//}));
			console.log('filteredDeedTypes',this.newDeedName,this.newDeed)
            return this.deedTypes.filter(deedType=>{
				return(this.activeDeedGroup=='media'&&(!(deedType.id==33||deedType.id==32||deedType.id==34||deedType.id==35||deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
																||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
																||deedType.id==53||deedType.id==54||deedType.id==55||deedType.id==56
																||deedType.id==57||deedType.id==58||deedType.id==59||deedType.id==60||deedType.id==61||deedType.id==62||deedType.id==63||deedType.id==64||deedType.id==67)))
				||(this.activeDeedGroup=='war'&&(deedType.id==33||deedType.id==32||deedType.id==34||deedType.id==35||deedType.id==63||deedType.id==64))
				||(this.activeDeedGroup=='achievment'&&(deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
																||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
																||deedType.id==53||deedType.id==54||deedType.id==55||deedType.id==56
																||deedType.id==57||deedType.id==59||deedType.id==60||deedType.id==61||deedType.id==62||deedType.id==67))
			}).filter(deedType => {
                return (
                    deedType.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newDeedName.toLowerCase()) >= 0
                )
            })
        },
		filteredDeedTypes_message() {
			//if(this.newDeedName=='')return this.deedTypes;
			//console.log(this.deedTypes,this.activeDeedGroup,this.deedTypes.filter(deedType=>{
			//	(this.activeDeedGroup==0&&(!(deedType.id==33||deedType.id==32||deedType.id==34||deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
			//													||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
			//													||deedType.id==53||deedType.id==54||deedType.id==55)))
			//	||(this.activeDeedGroup==1&&(deedType.id==33||deedType.id==32||deedType.id==34))
			//	||(this.activeDeedGroup==2&&deedType.id==45||deedType.id==46||deedType.id==47||deedType.id==48
			//													||deedType.id==49||deedType.id==50||deedType.id==51||deedType.id==52
			//													||deedType.id==53||deedType.id==54||deedType.id==55)
			//}));
            return this.deedTypes.filter(deedType => {
                return (
                    deedType.description
                        .toString()
                        .toLowerCase()
                        .indexOf(this.newMessageTypeDescription.toLowerCase()) >= 0
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
		
    }
  ,async mounted(){
		this.console=console;
		this.loader_=document.getElementById('loader_');
		await this.fetchDeedTypes();
		//console.log(this.deedTypes);
		//this.fetchStories();
		await this.fetchPlayers();
		await this.fetchWarProgress();
		await this.fetchDictionaries();
		await this.fetchMessages();
		//console.log(this.dictionaries);
		await this.getLastUpdate();
		await this.getConfig();
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

			this.newDeed={type:{},
				description:'',
				honor:''
				}
			 console.log('currentPlayer',this.currentPlayer);
			 this.newDeedName='';
			 this.$forceUpdate();
			 //this.activeDeedGroup='media';
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
                    type: 'is-danger',
					duration:5000
                });
			}
			//console.log(players.data);
			this.players=players.data.filter(player=>player.realName);
			this.loader_.classList.toggle('hidden');
			//console.log ('players',this.players);
		}
		,async fetchMessages(){
			this.loader_.classList.toggle('hidden');
			let messages;
			try{
			messages = await axios.get('https://blooming-refuge-12227.herokuapp.com/messages',
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
                    type: 'is-danger',
					duration:5000
                });
			}
			//console.log(players.data);
			this.messages=messages.data.sort((a,b)=>{
									if (a.deed.date > b.deed.date) return -1; // если первое значение больше второго
									if (a.deed.date == b.deed.date) return 0; // если равны
									if (a.deed.date < b.deed.date) return 1; // если первое значение меньше второго
									});
			this.loader_.classList.toggle('hidden');
			//console.log ('messages',this.messages);
		}
		,async fetchWarProgress(){
			this.loader_.classList.toggle('hidden');
			let warProgress;
			try{
			warProgress = await axios.get('https://blooming-refuge-12227.herokuapp.com/getWarProgress',
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
                    type: 'is-danger',
					duration:5000
                });
			}
			//console.log(players.data);
			this.warProgress=[];
			warProgress.data.forEach(el=>{
				if(this.warProgress.filter(cycle=>cycle.cycleId==el.cycleId).length==0){
					this.warProgress.push({cycleId:el.cycleId,
					startTime:el.startTime,
					endTime:el.endTime,
					cycleType:el.cycleType,
					checkpoints:[]});
				}
			});
			this.warProgress.forEach((cycle,cycleIndex)=>{
				warProgress.data.forEach(el=>{
				if(cycle.cycleId==el.cycleId){
					this.warProgress[cycleIndex].checkpoints.push({checkpointId:el.checkpointId,
					checkpointName:el.checkpointName,
					warProgressId:el.warProgressId,
					checkpointStateId:el.checkpointStateId,
					squadId:el.squadId,
					ishonorgiven:el.ishonorgiven});
				}
			});
			});
			//this.warProgress = warProgress.data;
			this.loader_.classList.toggle('hidden');
			console.log ('warProgress',this.warProgress);
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
                    type: 'is-danger',
					duration:5000
                });
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
                    type: 'is-danger',
					duration:5000
                });
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
                    type: 'is-danger',
					duration:5000
                });
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
			if(deed.description.length>255){
				this.$buefy.toast.open({
                    message: 'Длина описания должна быть не более 255 символов',
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
						honor:deed.honor,
						heroic:deed.heroic,
						color:deed.color
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].honor=this.currentPlayer[0].honor;
		}
		,async addMessage(message){
			if(!message.type.id){
				this.$buefy.toast.open({
                    message: 'Выберите тип деяния!',
                    type: 'is-danger'
                })
				return;
			}
			if(!message.player.id){
				this.$buefy.toast.open({
                    message: 'Выберите персонажа!',
                    type: 'is-danger'
                })
				return;
			}
			console.log('добавляем сообщение',message);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateMessage',{
						id:null,
						description:message.description,
						typeId:message.type.id,
						playerId:message.player.id,
						honor:null,
						heroic:null
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this.newMessage={
				description:'',
				type:{description:'',id:58},
				player:{name:''}
				};
			this.newMessagePlayerName='';
			this.newMessageTypeDescription='';
			await this.fetchMessages();
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
						honor:deed.honor,
						heroic:deed.heroic,
						color:deed.color
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.showPlayer(this.players[this.players.findIndex(el=>el.id==player.id)],this.isOpenPlayer);
			this.players[this.players.findIndex(el=>el.id==player.id)].honor=this.currentPlayer[0].honor;
		},
		async deleteMessage(message){
			console.log('удаляем сообщение',message);
			
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/deleteMessage',{
						id:message.id
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchMessages();			
		},
		async updateMessage(message){
			console.log('изменяем сообщение',message);
			
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateMessage',{
						id:message.id,
						description:message.description,
						deedDescription:message.deed.description,
						typeId:message.deed.deedType.id,
						playerId:message.player.id,
						honor:message.honor,
						heroic:message.heroic
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchMessages();
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
                    type: 'is-danger',
					duration:5000
                });
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
                    type: 'is-danger',
					duration:5000
                });
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
                    type: 'is-danger',
					duration:5000
                });
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
				//console.log(e.response);
				if(e.response){
					if(e.response.status==403){
						localStorage.removeItem('jwt');
						localStorage.removeItem('user');
						this.$router.push(`/login?nextUrl=${this.$route.fullPath}`)
					}
				}
				this.$buefy.toast.open({
                    message: `Возможно деяния с этим типом еще остались у игроков.\nТекст ошибки: ${e.response?e.response.data:e.message}`,
                    type: 'is-danger',
					duration:5000
                });
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
			console.log('массово добавляем деяние',deed);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setDeed/mass',{
						description:deed.description,
						typeId:deed.type.id,
						players:JSON.stringify(deed.players),
						honor:deed.honor,
						heroic:deed.heroic
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this.mass_players_deed={type:'',description:'',honor:'',heroic:false,players:[]};
			this.newPlayerName='';
			this.newDeedName_mass='';
			this.$buefy.toast.open({
                    message: `Деяние добавлено`,
                    type: 'is-success'
                })
			await this.fetchPlayers();
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
                    type: 'is-danger',
					duration:5000
                });
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
		,async getLastUpdate(){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/getLastUpdate`// 'https://blooming-refuge-12227.herokuapp.com/getPlayers'
			,{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this.lastUpdate = response.data;
		},
		async getConfig(){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/getConfig`// 'https://blooming-refuge-12227.herokuapp.com/getPlayers'
			,{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			this.config = response.data;
			this.configStorages=[];
			this.config.map(el=>{
				//console.log(el.storage,this.configStorages.filter(storage=>storage==el.storage));
				if(this.configStorages.filter(storage=>storage==el.storage).length==0){this.configStorages.push(el.storage)}
			})
			//console.log('config',this.config,this.configStorages);
		},
		async updateConfig(configVar){
			console.log('изменяем конфиг',configVar,configVar.valueType=='decimal',+configVar.value,isNaN(+configVar.value));
			this.loader_.classList.toggle('hidden');
			if(configVar.valueType=='decimal'&&isNaN(+configVar.value)){
				this.$buefy.toast.open({
                    message: `Значение должно быть десятичной дробью!`,
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateConfig',{
						id:configVar.id,
						description:configVar.description,
						storage:configVar.storage,
						key_:configVar.key_,
						value:configVar.value,
						valueType:configVar.valueType
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.getConfig();
		},
		async startJoinrpgSync(){
			this.loader_.classList.toggle('hidden');
			let response;

			// обновляем кэш персонажей
			try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/joinrpg/getPlayers?since=${this.lastUpdate}`// 'https://blooming-refuge-12227.herokuapp.com/getPlayers'
			,{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			
			// обновляем отряды
			try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/joinrpg/setSquads`// 'https://blooming-refuge-12227.herokuapp.com/getPlayers'
			,{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			
			// обновляем персонажей
			try{
			response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/joinrpg/setPlayers`// 'https://blooming-refuge-12227.herokuapp.com/getPlayers'
			,{
				headers: {
				  'Content-Type': 'application/json',
				  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
				}
			});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			
			this.loader_.classList.toggle('hidden');
			
			await this.fetchPlayers();
			
			this.$buefy.toast.open({
				
                    message: `Персонажи успешно синхронизированы`,
                    type: 'is-success'
                });
			
			
		},
		async makeReinforcementsAwaiting(){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeReinforcementsAwaiting',{},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.$buefy.toast.open({
                    message: `Подкрепления отправлены!`,
                    type: 'is-success'
                });
			this.loader_.classList.toggle('hidden');
		}
		,async setCheckpointState(checkpointId,stateId){
			console.log('изменяем статус точки',checkpointId,stateId);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setCheckpointState',{
						id:checkpointId,
						stateId:stateId
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchWarProgress();
		}
		,async setHonorforCheckpoint(id){
			console.log('начисляем славу за точку',id);
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setHonorforCheckpoint',{
						id:id
				},
				{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
				});
			}catch(e){
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
                    type: 'is-danger',
					duration:5000
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
			this.loader_.classList.toggle('hidden');
			//await this.fetchPlayers();
			await this.fetchWarProgress();
			this.$buefy.toast.open({
                    message: `Слава начислена`,
                    type: 'is-success',
					duration:3000
                });
		}
		,getImg(deedName){
			let res
			try{
				res=require(`../assets/deeds/${deedName}.png`);
			}
			catch(e){
				res=require(`../assets/deeds/feat.png`);
			}
			return res
		}
		,getSquadLogo(squadId){
			let res
			try{
				res=require(`../assets/squads/squad_${squadId}.png`);
			}
			catch(e){
				res=require(`../assets/squads/default.png`);
			}
			return res
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
.checkpoint_state_1{
	background-color:#55bb55
}
.checkpoint_state_2{
	background-color:#bbbb55
}
.checkpoint_state_3{
	background-color:#bb5555
}
</style>
