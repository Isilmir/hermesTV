<template>
<div>
	<img src="../assets/lazy-img.gif" id="loader_" class="loader_ hidden"></img>
    <h1>{{ msg }}</h1>
	<h1>{{ message }}</h1>
	
	<!--<video id="videoElem" style="height:40vh;"></video>-->
	<b-tabs v-model="activeTab" type="is-boxed" position="is-centered">
		<b-tab-item label="Персонажи">
			<b-tabs v-model="activeTabPersons" position="is-centered" vertical>
				<b-tab-item label="Передать спутника" v-if="permissions.filter(el=>el=='makeBjziTransfer'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTransferSubject')" type="is-success">Герой, кому передаем</b-button>
							<div v-for="obj in transferSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTransferObject')" type="is-success">Спутник, которого передаем</b-button>
							<div v-for="obj in transferObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя передать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">Увы героя нельзя передать
									<!--<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
										<span v-if="obj.stateId==3" class="red">Герой уже был похоронен!</span>
										<span v-if="furnalSubject[0]&&obj.id==furnalSubject[0].id" class="red">Нельзя хоронить самого себя)</span>
									</div>-->
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
										<span v-if="obj.utilized" class="red">Мертвого спутника нельзя передать!</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startTransfer" type="is-success" :disabled="!transferSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Провести похороны" v-if="permissions.filter(el=>el=='makeFuneral'||el=='admin').length>0">
					<div class="innerTabWrap">
						<!--<input value="Сканировать" type="button" v-on:click="startScan('scanObject')"/>-->
						<!--<b-button @click="startScan('scanObject')" type="is-success">Сканировать</b-button>-->
						<!--<div>QR: {{ qr }}</div>-->
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalSubject')" type="is-success">Кто принес тело</b-button>
							<div v-for="obj in furnalSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalObject')" type="is-success">Чье тело хоронят</b-button>
							<div v-for="obj in furnalObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя похоронить</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
										<span v-if="obj.stateId==3" class="red">Герой уже был похоронен!</span>
										<span v-if="furnalSubject[0]&&obj.id==furnalSubject[0].id" class="red">Нельзя хоронить самого себя)</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
										<span v-if="obj.utilized" class="red">Спутник уже был похоронен!</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-checkbox v-model="badFuneral">
                некачественные похороны
            </b-checkbox><br>
			<b-button @click="startFuneral" type="is-success" :disabled="!funeralSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Утилизировать просроченные тела" v-if="permissions.filter(el=>el=='removeTrash'||el=='admin').length>0">
					<div class="innerTabWrap">
						<!--<div class="innerTabCenter">
							<b-button @click="startScan('selectFurnalSubject')" type="is-success">Кто принес тело</b-button>
							<div v-for="obj in furnalSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>-->
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTrashObject')" type="is-success">Чье тело сдают</b-button>
							<div v-for="obj in trashObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя сдать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
										<span v-if="obj.stateId==3" class="red">Герой уже был похоронен!</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
										<span v-if="obj.utilized" class="red">Спутник уже был похоронен!</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startTrash" type="is-success" :disabled="!trashSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Отметить полученное подкрепление" v-if="permissions.filter(el=>el=='makeReinforcementsArrived'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectReinforcementCheckSubject')" type="is-success">Герой, получивший подкрепление</b-button>
							<div v-for="obj in reinforcementCheckSubject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект не может провести похороны</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startReinforcementCheck" type="is-success" :disabled="!reinforcementCheckSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Создать нового персонажа из спутника" v-if="permissions.filter(el=>el=='makeNewPlayerFromBjzi'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectNewPlayer')" type="is-success">Спутник, готовый стать героем</b-button> 
							<div v-for="obj in newPlayer">
								<div class="innerTab" v-if="obj.objectType!='bjzi'">Увы из этого объекта нельзя сделать героя</div>
								<!--<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>-->
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>Имя будущего героя: <b-input v-model="obj.name" maxlength="255" placeholder="Имя героя" style="margin-right:10px"></b-input></span>
										<span>Отряд будущего героя: 
										<b-autocomplete
																		v-model="squadName"
																		placeholder="Название отряда"
																		:keep-first="false"
																		:open-on-focus="true"
																		:data="filteredSquads"
																		field="name"
																		@select="option => {obj.playerSquad=option.id}"
																		:clearable="true"
																		style="min-width:10px"
																	></b-autocomplete></span><br>
										<span><b-switch v-model="newPlayerTransfer"  passive-type='is-success' :disabled="transferDeny">{{ newPlayerTransfer?`Перенести оставшихся спутников`:`Только создать героя` }}</b-switch></span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startNewPlayerMaking" type="is-success" :disabled="!newPlayerSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
		<!---->	<b-tab-item label="Изменить отряд персонажа" v-if="permissions.filter(el=>el=='changePlayerSquad'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectChangeSquadObject')" type="is-success">Кому изменяем отряд</b-button>
							<div v-for="obj in changeSquadObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя сдать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{obj.squadId?dictionaries.filter(el=>el.dict=='squads')[0].data.filter(el=>el.id==obj.squadId)[0].name:'без отряда'}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{obj.playerSquad?dictionaries.filter(el=>el.dict=='squads')[0].data.filter(el=>el.id==obj.playerSquad)[0].name:'без отряда'}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter">
										<span>Выбрать отряд: 
										<b-autocomplete
											v-model="squadName_forChange"
											placeholder="Название отряда"
											:keep-first="false"
											:open-on-focus="true"
											:data="filteredSquads_forChange"
											field="name"
											@select="option => {changeSquadSquadId=option.id}"
											:clearable="true"
											style="min-width:10px"
										></b-autocomplete>
										<img :class="`deed-img`"
														:src="getSquadLogo(changeSquadSquadId)" style="width:40px;height:40px;"
														v-if="changeSquadSquadId"
													> </img></span></div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startSquadChange" type="is-success" :disabled="!changeSquadSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Видимость персонажа" v-if="permissions.filter(el=>el=='test-action'||el=='admin').length>0">
					<div class="innerTab">
						<!--<input value="Активировать" type="button" v-on:click="startScan('activateObject')"/>
						<input value="Деактивировать" type="button" v-on:click="startScan('deactivateObject')"/>-->
						<b-button @click="startScan('activateObject')" type="is-success">Сделать видимым</b-button>
						<b-button @click="startScan('deactivateObject')" type="is-danger">Сделать невидимым</b-button>
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div>result: {{ result }}</div>
					</div>
				</b-tab-item>
				<b-tab-item label="Операция в госпитале" v-if="permissions.filter(el=>el=='makeCure'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectCureObject')" type="is-success">Пациент</b-button>
							<div v-for="obj in cureObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя сдать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startCure" type="is-success" :disabled="!cureSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
				<b-tab-item label="Регистрация на полигоне" v-if="permissions.filter(el=>el=='makeRegistration'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectRegistrationObject')" type="is-success">Персонаж</b-button>
							<div v-for="obj in registrationObject">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы этот объект нельзя зарегистрировать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startRegistration" type="is-success" :disabled="!registrationSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
			</b-tabs>
		</b-tab-item>
		<b-tab-item label="Общее">
			<b-tabs v-model="activeTabCustom" position="is-centered" vertical>
				<b-tab-item label="Информация по объекту"  v-if="permissions.filter(el=>el=='scanObject'||el=='admin').length>0">
					<div class="innerTab">
						<!--<input value="Сканировать" type="button" v-on:click="startScan('scanObject')"/>-->
						<b-button @click="startScan('scanObject')" type="is-success">Сканировать</b-button>
						<!--<div>QR: {{ qr }}</div>-->
						<!--<div>hasCamera: {{ hasCamera }}</div>-->
						<div v-for="obj in scannedObject">
							<div class="innerTab" v-if="obj.objectType=='none'">Увы такого объекта не существует</div>
							<div class="innerTab" v-if="obj.objectType=='player'">
								<hr>
								<b>Герой</b> 
								<div class="innerTabRow"><span class="innerTabRowPropName">Id:</span> <span class="innerTabRowPropVal"> {{obj.id}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Имя:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Статус:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='states')[0].data.filter(el=>el.id==obj.stateId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Отряд:</span> <span class="innerTabRowPropVal"> {{obj.squadId?dictionaries.filter(el=>el.dict=='squads')[0].data.filter(el=>el.id==obj.squadId)[0].name:'без отряда'}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Сторона:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Слава:</span> <span class="innerTabRowPropVal"> {{obj.honor}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Видимый:</span> <span class="innerTabRowPropVal"> {{obj.active?'Да':'Нет'}}</span></div>
							</div>
							<div class="innerTab" v-if="obj.objectType=='bjzi'">
								<hr>
								<b>Спутник</b> 
								<div class="innerTabRow"><span class="innerTabRowPropName">Id:</span> <span class="innerTabRowPropVal"> {{obj.id}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Имя:</span> <span class="innerTabRowPropVal"> {{obj.name}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Статус:</span> <span class="innerTabRowPropVal"> {{obj.utilized?'Мертв':'Жив'}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Канал поступления:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='bjziChannelTypes')[0].data.filter(el=>el.id==obj.bjziChannelTypeId)[0].description}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Похороны:</span> <span class="innerTabRowPropVal"> {{obj.deathCaseId?dictionaries.filter(el=>el.dict=='deathCaseTypes')[0].data.filter(el=>el.id==obj.deathCaseId)[0]:'-'}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Командир:</span> <span class="innerTabRowPropVal"> {{obj.playerName}}</span></div>
								<div class="innerTabRow"><span class="innerTabRowPropName">Сторона:</span> <span class="innerTabRowPropVal"> {{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span></div>
							</div>
						</div>
					</div>
				</b-tab-item>
				<b-tab-item label="Стратегические точки" v-if="permissions.filter(el=>el=='setOrUpdateWarProgress'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							
							<div v-for="obj in warProgressObject">
								
								<div class="innerTab">
									<div class="innerTabFurnal">
										<span>Текущий цикл: <b-tag>{{
				dictionaries.filter(el=>el.dict=='gameCycles')[0].data.filter(cycle=>(new Date())>(new Date(cycle.startTime))&&(new Date())<(new Date(cycle.endTime))).length>0
				?
				dictionaries.filter(el=>el.dict=='gameCycles')[0].data
				.map(cycle=>{cycle.label=`${cycle.id} (${(new Date(cycle.startTime)).getHours()}:${(''+(new Date(cycle.startTime)).getMinutes()).length<2?'0':''}${(new Date(cycle.startTime)).getMinutes()} - ${(new Date(cycle.endTime)).getHours()}:${(''+(new Date(cycle.endTime)).getMinutes()).length<2?'0':''}${(new Date(cycle.endTime)).getMinutes()})`;return cycle})
				.filter(cycle=>(new Date())>(new Date(cycle.startTime))&&(new Date())<(new Date(cycle.endTime)))
				[0].label
				:
				'Игра еще не идет'
}}
										</b-tag></span>
										<div class="innerTabCenter">
											<span>Выбрать цикл: <b-autocomplete
																			v-model="cycleName_warProgress"
																			placeholder="Номер цикла"
																			:keep-first="false"
																			:open-on-focus="true"
																			:data="filteredCycles_warProgress"
																			field="label"
																			@select="option => {obj.cycleId=option.id;obj.cycleType=dictionaries.filter(el=>el.dict=='cycleTypes')[0].data.filter(cT=>cT.id==option.cycleTypeId)[0].description}"
																			:clearable="true"
																			style="min-width:10px"
																		></b-autocomplete>
										<span>{{obj.cycleType}}</span></span>
										</div>
										<div class="innerTabCenter">
											<span>Выбрать точку: 
											<b-autocomplete
																			v-model="checkpointName_warProgress"
																			placeholder="Название точки"
																			:keep-first="false"
																			:open-on-focus="true"
																			:data="filteredСheckpoints_warProgress"
																			field="name"
																			@select="option => {obj.checkpointId=option.id;obj.checkpointState=option.stateId}"
																			:clearable="true"
																			style="min-width:10px"
																		></b-autocomplete>
											<div :class="`checkpoint_state_${obj.checkpointState}`">{{dictionaries.filter(el=>el.dict=='checkpointStates')[0].data.filter(cT=>cT.id==obj.checkpointState)[0]?dictionaries.filter(el=>el.dict=='checkpointStates')[0].data.filter(cT=>cT.id==obj.checkpointState)[0].name:''}}</div>
											</span>
										</div>
										<div class="innerTabCenter">
										<span>Выбрать отряд: 
										<b-autocomplete
																		v-model="squadName_warProgress"
																		placeholder="Название отряда"
																		:keep-first="false"
																		:open-on-focus="true"
																		:data="filteredSquads_warProgress"
																		field="name"
																		@select="option => {obj.squadId=option.id}"
																		:clearable="true"
																		style="min-width:10px"
																	></b-autocomplete>
										<img :class="`deed-img`"
														:src="getSquadLogo(obj.squadId)" style="width:40px;height:40px;"
														v-if="obj.squadId"
													> </img></span></div>
									</div>
								</div>
							</div>
							
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startWarProgress" type="is-success" :disabled="!warProgressSubmit">Подтвердить</b-button></div>
					</div>
					<hr>
					<span>Эмблемы отрядов</span><br>
					<span>(можно нажимать на картинки)</span>
					<div class="innerTabWrap">
						<b-field :label="squad.name" v-for="squad in dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad=>{return !(squad.sideId==15680||squad.sideId==16333)})" :key="squad.id"
								style="margin:10px;padding:2px; border:1px solid black; border-radius:5px"
						>
						<img :class="`deed-img`"
														:src="getSquadLogo(squad.id)" style="width:80px;height:80px;"
														@click="() => {$buefy.toast.open({message: `Выбрано: ${squad.name}`,type: 'is-success'});warProgressObject[0].squadId=squad.id;squadName_warProgress=squad.name}"
													> </img> </b-field>
					</div>
				</b-tab-item>
				<b-tab-item label="Покупка ресурсов" v-if="permissions.filter(el=>el=='setOrUpdateTransaction'||el=='admin').length>0">
					<div class="innerTabWrap">
						<div class="innerTabCenter">
							<b-button @click="startScan('selectTradePlayer')" type="is-success">Герой, который хочет торговать</b-button> 
							<div v-for="obj in tradePlayer">
								<div class="innerTab" v-if="obj.objectType=='none'">Увы с этим объектом нельзя торговать</div>
								<div class="innerTab" v-if="obj.objectType=='player'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (герой)</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.sideId)[0].description}}</span>
									</div>
								</div>
								<div class="innerTab" v-if="obj.objectType=='bjzi'">
									<div class="innerTabFurnal">
										<span>{{obj.name}} (спутник)</span>
										<span>Командир: {{obj.playerName}}</span>
										<span>{{dictionaries.filter(el=>el.dict=='sides')[0].data.filter(el=>el.id==obj.playerSide)[0].description}}</span>
									</div>
								</div>
							</div>
							<div class="flex-deeds">
							<b-tooltip 
							position="is-bottom" multilined v-for="deed in tradeDeeds" :key="deed.id"  style="font-family:'Arial';">
							<template v-slot:content>
							<div v-for="line in deed.description.split(/[\r\n]/)" class="has-margin-15" style="display:flex">
								<div style="justify-content: flex-start;text-align:left;text-indent: 0em; padding-bottom:5px;line-height:110%">
								{{line}}
								</div>
							</div>
						</template>
								<div :class="`deed`" :style="`background-color:${deed.deedTypeId==51
																				||deed.deedTypeId==52
																				||deed.deedTypeId==53
																				||deed.deedTypeId==54
																				||deed.deedTypeId==67?'#CCCCCC'
																				:deed.deedTypeId==36
																				||deed.deedTypeId==37
																				||deed.deedTypeId==50?'#bb0000'
																				:'#00bb00'}`">
										<img :class="`deed-img`"
											:src="getImg(deed.deedTypeName)" style="width:30px"
										> </img>
								</div>
							</b-tooltip> 
							</div>
						</div>
						<div class="innerTabCenter">
											<span>Олимпиец: <b-autocomplete
																			v-model="tradeGodName"
																			placeholder="Олимпиец"
																			:keep-first="false"
																			:open-on-focus="true"
																			:data="filteredTradeGodName"
																			field=""
																			@select="option => {transaction[0].god=option;transaction[0].resource=null;tradeResourceName='';transaction[0].gold=null;transaction[0].quantity=null;}"
																			clearable
																			style="min-width:300px"
																		><template #empty>Нет подходящих олимпийцев</template></b-autocomplete>
										<!--<span>{{transaction.god}}</span>--></span><br>
						
											<span>Ресурс: <b-autocomplete
																			v-model="tradeResourceName"
																			placeholder="Ресурс"
																			:keep-first="false"
																			:open-on-focus="true"
																			:data="filteredTradeResourceName"
																			field="resource"
																			@select="option => {
																								if(transaction[0].god=='Зевс'){transaction[0].gold=5;minTradeValue=5;maxTradeValue=999;transaction[0].quantity=+option.quantity*5;}
																								else if(transaction[0].god=='Гера'){transaction[0].gold=0;minTradeValue=0;maxTradeValue=0;transaction[0].quantity=+option.quantity;}
																								else if(option.resource=='Гуманитарка командиру DBS (перемирие)'){transaction[0].gold=0;minTradeValue=0;maxTradeValue=0;transaction[0].quantity=+option.quantity;}
																								else if(option.resource=='Гуманитарка командиру UC'){transaction[0].gold=0;minTradeValue=0;maxTradeValue=0;transaction[0].quantity=+option.quantity;}
																								else if(option.resource=='Гуманитарка командиру DBS (война)'){transaction[0].gold=0;minTradeValue=0;maxTradeValue=0;transaction[0].quantity=+option.quantity;}
																								else{transaction[0].gold=1;minTradeValue=1;maxTradeValue=999;transaction[0].quantity=+option.quantity;}
																								transaction[0].resource=option.resource;tradeCurrentRate=+option.quantity;
																								}"
																			clearable
																			style="min-width:300px"
																		><template #empty>Нет подходящих ресурсов</template></b-autocomplete>
										<!--<span>{{transaction[0].resource}}{{transaction[0].quantity}}</span>--></span>
										<span v-if="transaction[0].resource">Установленный олимпом курс: <b>{{tradeCurrentRate}}</b></span><br>
										<span>Количество ресурса: <b-numberinput v-model="transaction[0].quantity" :min="0" :controls="true" style="min-width:300px" :disabled="true" ></b-numberinput></span>
										<span>Принятое золото: <b-numberinput @input="()=>{transaction[0].quantity=(+transaction[0].gold)*tradeCurrentRate}" v-model="transaction[0].gold" :min="minTradeValue" :max="maxTradeValue" :controls="true" style="min-width:300px" :disabled="true"></b-numberinput></span>
										<span>Комментарий: <b-input v-model="transaction[0].description" type="textarea" maxlength="255" placeholder="Комментарий по сделке" style="min-width:300px"></b-input></span>
										<!--<span>{{transaction[0].resource}}{{transaction[0].quantity}}</span>--></span>
						</div>
						<div class="innerTabCenter" style="border:none"><b-button @click="startTrade" type="is-success" :disabled="!tradeSubmit">Подтвердить</b-button></div>
					</div>
				</b-tab-item>
			</b-tabs>
		</b-tab-item>
	</b-tabs>
	<b-modal v-model="scannerActive" @close="onCloseModal">
            
                <video id="videoElem" style="height:90vh;"></video>
            
    </b-modal>
	<b-modal v-model="manualScannerActive" @close="onCloseManualModal">
            
            <b-numberinput style="min-width:170px; max-width:170px; margin-left:37%" placeholder="id" v-model="manualScannedId" :min="0" :controls="false" :disabled="false"></b-numberinput>
			<br>
			<b-select placeholder="Тип объекта" v-model="manualScannedObjectType" style="min-width:200px">
                <option
                    v-for="option in [{id:'bjzi'},{id:'player'}]"
                    :value="option.id"
                    :key="option.id">
                    {{ option.id }}
                </option>
            </b-select><br>
			<b-button @click="startManualScan(currentAction)" type="is-warning" :disabled="!manualScanSubmit">Подтвердить</b-button>
            
    </b-modal>
</div>
</template>

<script>
//import PostsService from '@/services/PostsService'
import axios from 'axios'
import QrScanner from 'qr-scanner'
import QrScannerWorkerPath from '!!file-loader!../../node_modules/qr-scanner/qr-scanner-worker.min.js';
import jwt from 'jsonwebtoken'
QrScanner.WORKER_PATH = QrScannerWorkerPath;
export default {
  name: 'QR',
  props:['cert'],
  data () {
    return {
      msg: 'QR-scanner',
	  message:'',
	  qr:'',
	  hasCamera:'',
	  qrScanner:null,
	  result:'',
	  squadName:'',
	  squadName_warProgress:'',
	  squadName_forChange:'',
	  checkpointName_warProgress:'',
	  cycleName_warProgress:'',
	  scannerActive:false,
	  manualScannerActive:false,
	  manualScannedId:null,
	  manualScannedObjectType:null,
	  currentAction:null,
	  activeTab: undefined,
	  activeTabPersons: undefined,
	  activeTabCustom:undefined,
	  dictionaries:[{dict:'sides',data:[{description:''}]},{dict:'squads',data:[{name:''}]},{dict:'checkpoints',data:[{name:''}]},{dict:'gameCycles',data:[{id:''}]},{dict:'checkpointStates',data:[{name:''}]},{dict:'cycleTypes',data:[{description:''}]}],
	  scannedObject:[],
	  furnalSubject:[],
	  furnalObject:[],
	  badFuneral:false,
	  trashObject:[],
	  cureObject:[],
	  registrationObject:[],
	  changeSquadObject:[],
	  changeSquadSquadId:null,
	  transferSubject:[],
	  transferObject:[],
	  reinforcementCheckSubject:[],
	  warProgressObject:[{cycleId:null,checkpointId:null, squadId:null, cycleType:null, checkpointState:null,squadLogo:null}],
	  newPlayer:[],
	  newPlayerTransfer:false,
	  permissions:[],
	  tradePlayer:[],
	  tradeResources:[],
	  tradeDeeds:[],
	  tradeGods:[],
	  tradeGodName:'',
	  tradeResourceName:'',
	  tradeCurrentRate:1,
	  minTradeValue:0,
	  maxTradeValue:999,
	  transaction:[{playerId:null,god:null, resource:null, quantity:null, gold:null,description:null}]
    }
  },
  computed: {
        funeralSubmit() {
            return this.furnalSubject[0]&&this.furnalObject[0]&&!this.furnalObject[0].utilized&&this.furnalObject[0].stateId!=3&&this.furnalSubject[0].id!=this.furnalObject[0].id
        },
		trashSubmit() {
            return this.trashObject[0]&&!this.trashObject[0].utilized&&this.trashObject[0].stateId!=3
        },
		cureSubmit() {
            return !!this.cureObject[0]&&this.cureObject[0].objectType!='none'
        },
		registrationSubmit() {
            return this.registrationObject[0]&&this.registrationObject[0].objectType!='none'
        },
		transferSubmit() {
            return this.transferSubject[0]&&this.transferObject[0]&&!this.transferObject[0].utilized
        },
		reinforcementCheckSubmit() {
            return this.reinforcementCheckSubject[0]
        },
		newPlayerSubmit() {
            return this.newPlayer[0]&&this.newPlayer[0].playerSquad;
        },
		warProgressSubmit() {
            return this.warProgressObject[0]&&this.warProgressObject[0].cycleId&&this.warProgressObject[0].checkpointId&&this.warProgressObject[0].squadId;
        },
		tradeSubmit() {
            return this.tradePlayer[0]&&this.transaction[0]&&this.transaction[0].god&&this.transaction[0].resource&&this.transaction[0].quantity&&this.transaction[0].gold!==null;
        },
		manualScanSubmit() {
            return this.manualScannedId&&this.manualScannedObjectType;
        },
		changeSquadSubmit(){
			return this.changeSquadObject[0]&&(this.changeSquadSquadId||this.squadName_forChange=='без отряда');
		},
		filteredSquads() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad=>{return !(squad.sideId==16333)}).filter(squad => {
				//console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.squadName.toLowerCase()) >= 0
                )
            })
		},
		filteredSquads_warProgress() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad=>{return !(squad.sideId==15680||squad.sideId==16333)}).filter(squad => {
				//console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.squadName_warProgress.toLowerCase()) >= 0
                )
            })
		},
		filteredSquads_forChange() {
			return this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(squad=>{return !(squad.sideId==15680||squad.sideId==16333)}).filter(squad => {
				//console.log(squad);
                return (
                    squad.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.squadName_forChange.toLowerCase()) >= 0
                )
            })
		},
		filteredСheckpoints_warProgress() {
			return this.dictionaries.filter(el=>el.dict=='checkpoints')[0].data.filter(checkpoint => {
				//console.log(squad);
                return (
                    checkpoint.name
                        .toString()
                        .toLowerCase()
                        .indexOf(this.checkpointName_warProgress.toLowerCase()) >= 0
                )
            })
		},
		filteredCycles_warProgress() {
			return this.dictionaries.filter(el=>el.dict=='gameCycles')[0].data
				.map(cycle=>{cycle.label=`${cycle.id} (${(new Date(cycle.startTime)).getHours()}:${(''+(new Date(cycle.startTime)).getMinutes()).length<2?'0':''}${(new Date(cycle.startTime)).getMinutes()} - ${(new Date(cycle.endTime)).getHours()}:${(''+(new Date(cycle.endTime)).getMinutes()).length<2?'0':''}${(new Date(cycle.endTime)).getMinutes()})`;return cycle})
				//это условие открыть на игре!!!
				//.filter(cycle=>(new Date())>(new Date(cycle.startTime)))
				.sort((a,b)=>{
									if (a.endTime > b.endTime) return -1; // если первое значение больше второго
									if (a.endTime == b.endTime) return 0; // если равны
									if (a.endTime < b.endTime) return 1; // если первое значение меньше второго
									})
				.filter(cycle => {
				//console.log(squad);
                return (
                    (''+cycle.label)
                        .toString()
                        .toLowerCase()
                        .indexOf((''+this.cycleName_warProgress).toLowerCase()) >= 0
                )
            })
		},
		filteredTradeGodName(){
			return this.tradeGods.filter(god => {
				//console.log(god);
                return (
                    god
                        .toString()
                        .toLowerCase()
                        .indexOf(this.tradeGodName.toLowerCase()) >= 0
                )
            })
		},
		filteredTradeResourceName(){
			return this.tradeResources.filter(el=>el.god==this.transaction[0].god).filter(resource => {
				//console.log(this.tradeResources.filter(el=>el.god==this.transaction[0].god));
                return (
                    resource.resource
                        .toString()
                        .toLowerCase()
                        .indexOf(this.tradeResourceName.toLowerCase()) >= 0
                )
            })
		},
		transferDeny(){
			if(this.newPlayer.length>0){
				return this.newPlayer[0].playerSide==16333?true:false;
			}else{
				return true;
			}
		}
	},
  async mounted(){
	console.log(jwt.verify(localStorage.getItem('jwt').replace(/"/g,''),this.cert,{ algorithms: ['RS256'] }));
	try{
		this.permissions=jwt.verify(localStorage.getItem('jwt').replace(/"/g,''),this.cert,{ algorithms: ['RS256'] }).permissions;
	}catch(e){
		this.$buefy.toast.open({
								message: `Не удалось получить разрешения эмиссара на использование сканера`,
								type: 'is-danger'
								})
	}
	console.log(this.permissions);
	//console.log('проверка',this.permissions.filter(el=>{console.log(el,el==('test-action'||'admin'));return el==('test-action'||'admin');}))
	this.hasCamera=await QrScanner.hasCamera();
	this.loader_=document.getElementById('loader_');
	await this.fetchDictionaries();
	console.log(this.dictionaries)
	console.log(this.dictionaries.filter(el=>el.dict=='gameCycles')[0].data[0].startTime,(new Date(this.dictionaries.filter(el=>el.dict=='gameCycles')[0].data[0].startTime)).getHours())
	//const videoElem = document.getElementById('videoElem');
	//console.log(videoElem)
	//this.qrScanner = new QrScanner(videoElem, result => {this.result = result;console.log('decoded qr code:', result);return result;});
	//this.qrScanner.start();
  },
  methods:{
	async startScan(action){
		this.currentAction=action;
		this.scannerActive=true;
		await setTimeout(()=>{return;},0);
		const videoElem = document.getElementById('videoElem');
		this.qrScanner = new QrScanner(videoElem, async result => {
										//console.log(videoElem);
										//this.qr = result;
										//console.log('decoded qr code:', result);
										this.qrScanner.stop();
										this.qrScanner.destroy();
										this.qrScanner = null;
										let resultJSON;
										try{
										resultJSON = JSON.parse(result);
										}catch(e){
											this.qr = 'Упс. Похоже QR-код битый((';
											this.$buefy.toast.open({
												message: `Упс. Похоже QR-код битый((`,
												type: 'is-danger'
											})
											return;
										}
										await this[action](resultJSON);
										/*
										//console.log('decoded qr code:', resultJSON);
										if(resultJSON){
											if(action=='activate'){
												resultJSON.activationToggle=true;
												loader_.classList.toggle('hidden');
												let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
													,resultJSON, {
													headers: {
													  'Content-Type': 'application/json',
													  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
													}
												});
												//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
												loader_.classList.toggle('hidden');
												this.result = actionRes.data;
											}else if(action=='deactivate'){
												resultJSON.activationToggle=false;
												loader_.classList.toggle('hidden');
												let actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
													,resultJSON, {
													headers: {
													  'Content-Type': 'application/json',
													  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
													}
												});
												//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
												loader_.classList.toggle('hidden');
												this.result = actionRes.data;
											}
											
										}
										*/
										this.scannerActive=false;

										});
		this.qrScanner.start();
	}
	,async startManualScan(action){
		await this[action]({id:this.manualScannedId,objectType:this.manualScannedObjectType})
		this.manualScannerActive=false;
		this.manualScannedId=null;
		this.manualScannedObjectType=null;
		this.currentAction=null;
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
                    type: 'is-danger'
                });
			}
			//console.log(players.data);
			this.dictionaries=dictionaries.data;
			this.loader_.classList.toggle('hidden');
			//console.log ('dictionaries',this.dictionaries);
		},
	async scanObject(obj){
		this.qr = JSON.stringify(obj);
		this.scannedObject=[];
		switch(obj.objectType){
			case 'player':
				this.scannedObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.scannedObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.scannedObject.push({objectType:'none'});
		}
		console.log(this.scannedObject);
		return;
	},
	async activateObject(obj){
		//this.startScan('activate');
		this.$buefy.toast.open({
                    message: `Активируем объект: ${JSON.stringify(obj)}`,
                    type: 'is-danger'
                })
		obj.activationToggle=true;
		this.loader_.classList.toggle('hidden');
		let obj_;
		switch(obj.objectType){
			case 'player':
				obj_ = await this.getPlayer(obj.id);
				break;
			case 'bjzi':
				obj_ = await this.getBjziSingle(obj.id);
				break;
			default:
				this.$buefy.toast.open({
                    message: `Неизвестный тип объекта`,
                    type: 'is-danger'
                });
				return;
		}
		let actionRes
		try{
		actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,{id:obj_.id,objectType:obj_.objectType,activationToggle:true}, {
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
                    type: 'is-danger'
                });
			}
		//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
		this.loader_.classList.toggle('hidden');
		this.result = actionRes.data;
	},
	async deactivateObject(obj){
		//this.startScan('deactivate');
		this.$buefy.toast.open({
                    message: `Деактивируем объект: ${JSON.stringify(obj)}`,
                    type: 'is-danger'
                })
		obj.activationToggle=false;
		this.loader_.classList.toggle('hidden');
		let obj_;
		switch(obj.objectType){
			case 'player':
				obj_ = await this.getPlayer(obj.id);
				break;
			case 'bjzi':
				obj_ = await this.getBjziSingle(obj.id);
				break;
			default:
				this.$buefy.toast.open({
                    message: `Неизвестный тип объекта`,
                    type: 'is-danger'
                });
				return;
		}
		let actionRes 
		try{
		actionRes = await axios.post('https://blooming-refuge-12227.herokuapp.com/test-action'//'http://192.168.0.181:5000/test-action'
			,{id:obj_.id,objectType:obj_.objectType,activationToggle:false}, {
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
                    type: 'is-danger'
                });
			}
		
		
		//let actionRes = await PostsService.doPost('https://blooming-refuge-12227.herokuapp.com','/test-action',resultJSON);
		this.loader_.classList.toggle('hidden');
		this.result = actionRes.data;
	},
	async selectFurnalSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.furnalSubject=[];
		switch(obj.objectType){
			case 'player':
				this.furnalSubject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.furnalSubject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.furnalSubject.push({objectType:'none'});
		}
		console.log(this.furnalSubject);
		return;
	},
	async selectFurnalObject(obj){
		//this.qr = JSON.stringify(obj);
		this.furnalObject=[];
		switch(obj.objectType){
			case 'player':
				this.furnalObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.furnalObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.furnalObject.push({objectType:'none'});
		}
		console.log(this.furnalObject);
		return;
	},
	async selectChangeSquadObject(obj){
		this.changeSquadObject=[];
		switch(obj.objectType){
			case 'player':
				this.changeSquadObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.changeSquadObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.changeSquadObject.push({objectType:'none'});
		}
		console.log(this.changeSquadObject);
		return;
	},
	async selectTrashObject(obj){
		//this.qr = JSON.stringify(obj);
		this.trashObject=[];
		switch(obj.objectType){
			case 'player':
				this.trashObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.trashObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.trashObject.push({objectType:'none'});
		}
		console.log(this.trashObject);
		return;
	},
	async selectCureObject(obj){
		//this.qr = JSON.stringify(obj);
		console.log(obj)
		this.cureObject=[];
		switch(obj.objectType){
			case 'player':
				this.cureObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.cureObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.cureObject.push({objectType:'none'});
		}
		console.log('cureObject',this.cureObject);
		return;
	},
	async selectRegistrationObject(obj){
		//this.qr = JSON.stringify(obj);
		console.log(obj)
		this.registrationObject=[];
		switch(obj.objectType){
			case 'player':
				this.registrationObject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.registrationObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.registrationObject.push({objectType:'none'});
		}
		console.log('registrationObject',this.registrationObject);
		return;
	},
	async selectTransferSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.transferSubject=[];
		switch(obj.objectType){
			case 'player':
				this.transferSubject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.transferSubject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.transferSubject.push({objectType:'none'});
		}
		console.log('transferSubject',this.transferSubject);
		return;
	},
	async selectTransferObject(obj){
		//this.qr = JSON.stringify(obj);
		this.transferObject=[];
		switch(obj.objectType){
			case 'bjzi':
				this.transferObject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.transferObject.push({objectType:'none'});
		}
		console.log('transferObject',this.transferObject);
		return;
	},
	async selectReinforcementCheckSubject(obj){
		//this.qr = JSON.stringify(obj);
		this.reinforcementCheckSubject=[];
		switch(obj.objectType){
			case 'player':
				this.reinforcementCheckSubject.push(await this.getPlayer(obj.id));
				break;
			case 'bjzi':
				this.reinforcementCheckSubject.push(await this.getBjziSingle(obj.id));
				break;
			default:
				this.reinforcementCheckSubject.push({objectType:'none'});
		}
		console.log('reinforcementCheckSubject',this.reinforcementCheckSubject);
		return;
	},
	async selectNewPlayer(obj){
		//this.qr = JSON.stringify(obj);
		this.newPlayer=[];
		switch(obj.objectType){
			//case 'player':
			//	this.reinforcementCheckSubject.push(await this.getPlayer(obj.id));
			//	break;
			case 'bjzi':
			try{
				let bjzi = await this.getBjziSingle(obj.id);
				if(bjzi.objectType=='bjzi'){
					this.newPlayer.push(bjzi);
					this.squadName=this.dictionaries.filter(el=>el.dict=='squads')[0].data.filter(el=>el.id==this.newPlayer[0].playerSquad)[0].name
					this.newPlayerTransfer=bjzi.playerSide==16333?false:true;
				}else{
					this.newPlayer.push({objectType:'none'});
				}
			}catch(e){
				this.$buefy.toast.open({
                    message: `${e.response?e.response.data:e.message}`,
                    type: 'is-danger'
                });
			}
				break;
			default:
				this.newPlayer.push({objectType:'none'});
		}
		console.log('newPlayer',this.newPlayer);
		return;
	},
	async selectTradePlayer(obj){
		//this.qr = JSON.stringify(obj);
		this.tradePlayer=[];
		let tradeResources;
		switch(obj.objectType){
			case 'player':
				this.tradePlayer.push(await this.getPlayer(obj.id));
				tradeResources=await this.getPlayerTradeResources(obj.id);
				break;
			case 'bjzi':
				this.tradePlayer.push(await this.getBjziSingle(obj.id));
				console.log('до case',this.tradePlayer);
				switch(this.tradePlayer[0].objectType){
					case 'player':
						console.log('case player',this.tradePlayer[0].id);
						tradeResources= await this.getPlayerTradeResources(this.tradePlayer[0].id);
						break;
					case 'bjzi':
						console.log('case bjzi',this.tradePlayer[0].playerId);
						tradeResources=await this.getPlayerTradeResources(this.tradePlayer[0].playerId);
						break;
				}
				break;
			default:
				this.tradePlayer.push({objectType:'none'});
		}
		console.log('после case',this.tradePlayer,tradeResources);
		this.tradeResources=[];
		this.tradeDeeds=[];
		this.tradeGods=[];
		this.tradeResources=tradeResources.resources;
		this.tradeDeeds=tradeResources.deeds;
		this.transaction=[{playerId:null,god:this.transaction[0].god, resource:null, quantity:null, gold:null,description:null}];
		this.tradeResourceName='';
		tradeResources.resources.forEach(el=>{
			if(this.tradeGods.filter(god=>god==el.god).length==0)this.tradeGods.push(el.god);
		})
		console.log('tradePlayer',this.tradePlayer);
		console.log('tradeResources',this.tradeResources);
		console.log('tradeDeeds',this.tradeDeeds);
		console.log('tradeGods',this.tradeGods);
		return;
	},
	async onCloseModal(){
		if(this.qrScanner){
			this.qrScanner.stop();
			this.qrScanner.destroy();
			this.qrScanner = null;
		}
		this.manualScannerActive=true;
	},
	async onCloseManualModal(){
		this.manualScannedId=null;
	    this.manualScannedObjectType=null;
	},
	async getPlayer(id){
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
                    type: 'is-danger'
                });
			}
			this.loader_.classList.toggle('hidden');
			//console.log(response);
			return response.data[0]?response.data[0]:{objectType:'none'};
	},
	async getPlayerTradeResources(id){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/getTradeResources/${id}`,
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
                    type: 'is-danger'
                });
			}
			this.loader_.classList.toggle('hidden');
			//console.log(response);
			return response.data;
	},
	async getBjziSingle(id){
			this.loader_.classList.toggle('hidden');
			let response;
			try{
				response = await axios.get(`https://blooming-refuge-12227.herokuapp.com/bjzi/${id}`,//192.168.0.148:5000
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
						type: 'is-danger'
					});
			}
			this.loader_.classList.toggle('hidden');
			console.log('!!!!',response.data[0]);
			return response.data[0]?(response.data[0].isPlayer?response.data[0].player:response.data[0]):{objectType:'none'};
	},
	async startFuneral(){
		this.loader_.classList.toggle('hidden');
		console.log('Проводим похороны',{SUBJECT:{id:this.furnalSubject[0].id,type:this.furnalSubject[0].objectType},OBJECT:{id:this.furnalObject[0].id,type:this.furnalObject[0].objectType}});
		
		// 1. Добавить деяние субъекту
		// 2. Перевести объект в мертвое состояние
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeFuneral',{
						SUBJECT:{
							id:this.furnalSubject[0].id,
							type:this.furnalSubject[0].objectType
						},
						OBJECT:{
							id:this.furnalObject[0].id,
							type:this.furnalObject[0].objectType
						},
						bad:this.badFuneral
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Похороны успешно проведены`,
                    type: 'is-success'
        })
		this.furnalObject=[];
		this.badFuneral=false;
	},
	async startTrash(){
		this.loader_.classList.toggle('hidden');
		console.log('Проводим утилизацию тела',{SUBJECT:{id:100101,type:'player'},OBJECT:{id:this.trashObject[0].id,type:this.trashObject[0].objectType}});
		
		// 1. Добавить деяние субъекту
		// 2. Перевести объект в мертвое состояние
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeFuneral',{
						SUBJECT:{
							id:100101,
							type:'player'
						},
						OBJECT:{
							id:this.trashObject[0].id,
							type:this.trashObject[0].objectType
						},
						expired:true
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Тело утилизировано`,
                    type: 'is-success'
        })
		this.trashObject=[];
	},
	async startCure(){
		this.loader_.classList.toggle('hidden');
		console.log('Завершаем операцию',this.cureObject);
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeCure',{
						patient:this.cureObject[0].id,
						patientType:this.cureObject[0].objectType
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Операция завершена успешно`,
                    type: 'is-success'
        })
		this.cureObject=[];
	},
	async startRegistration(){
		this.loader_.classList.toggle('hidden');
		//console.log('Регистрируем персонажа на полигоне',this.registrationObject);
		let id;
		if(this.registrationObject[0].objectType=='bjzi')id=this.registrationObject[0].playerId
		if(this.registrationObject[0].objectType=='player')id=this.registrationObject[0].id
		console.log('Регистрируем персонажа на полигоне',this.registrationObject,id);
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeRegistration',{
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Персонаж зарегистрирован`,
                    type: 'is-success'
        })
		this.registartionObject=[];
	},
	async startSquadChange(){
		this.loader_.classList.toggle('hidden');
		//console.log('Меняем отряд',this.changeSquadObject,this.changeSquadSquadId);
		let playerId;
		if(this.changeSquadObject[0].objectType=='player') playerId = this.changeSquadObject[0].id;
		if(this.changeSquadObject[0].objectType=='bjzi') playerId = this.changeSquadObject[0].playerId;
		console.log('Меняем отряд',playerId,this.changeSquadSquadId);

		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/changePlayerSquad',{
						id:playerId,
						squadId:this.changeSquadSquadId
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Отряд изменен`,
                    type: 'is-success'
        })
		this.changeSquadObject=[];
		this.changeSquadSquadId=null;
		this.squadName_forChange='';
	},
	async startTransfer(){
		this.loader_.classList.toggle('hidden');
		console.log('Передаем спутника',{SUBJECT:{id:this.transferSubject[0].id,type:this.transferSubject[0].objectType},OBJECT:{id:this.transferObject[0].id,type:this.transferObject[0].objectType}});
		
		// 1. Добавить деяние субъекту
		// 2. Перевести объект в мертвое состояние
		
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeBjziTransfer',{
						SUBJECT:{
							id:this.transferSubject[0].id,
							type:this.transferSubject[0].objectType
						},
						OBJECT:{
							id:this.transferObject[0].id,
							type:this.transferObject[0].objectType
						}
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Спутник успешно передан`,
                    type: 'is-success'
        })
		this.transferObject=[];
	},
	async startReinforcementCheck(){
		this.loader_.classList.toggle('hidden');
		console.log('Отмечаем полученное подкрепление',this.reinforcementCheckSubject);
		let playerId;
		switch(this.reinforcementCheckSubject[0].objectType){
			case 'player':
				playerId = this.reinforcementCheckSubject[0].id;
				break;
			case 'bjzi':
				playerId = this.reinforcementCheckSubject[0].playerId;
				break;
		}
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeReinforcementsArrived',{
						playerId:playerId
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
		this.$buefy.toast.open({
                    message: `Получение подкрепления подтверждено`,
                    type: 'is-success'
        })
		this.reinforcementCheckSubject=[];
	},
	async startNewPlayerMaking(){
		this.loader_.classList.toggle('hidden');
		console.log('Создаем нового героя',this.newPlayer);
		if(this.newPlayer[0].playerSquad==16333){
			this.loader_.classList.toggle('hidden');
			this.$buefy.toast.open({
                    message: `Нельзя выводить героя в игротехнику`,
                    type: 'is-danger',
					duration:5000
                });
			return;
		}
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/processing/makeNewPlayerFromBjzi',{
						id:this.newPlayer[0].id,
						squadId:this.newPlayer[0].playerSquad,
						name:this.newPlayer[0].name,
						transferBjzi:this.newPlayerTransfer
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
		this.$buefy.toast.open({
                    message: `Спутник успешно стал героем!`,
                    type: 'is-success'
        })
		this.newPlayer=[];
		this.newPlayerTransfer=false;
	},
	async startTrade(){
		this.loader_.classList.toggle('hidden');
		console.log('Проводим торговую транзакцию',this.transaction);
		//this.$buefy.toast.open({
        //            message: `${this.transaction[0].resource}`,
        //            type: 'is-success'
        //})
		let playerId;
		if(this.tradePlayer[0].objectType=='player'){playerId=this.tradePlayer[0].id;}
		else if(this.tradePlayer[0].objectType=='bjzi'){playerId=this.tradePlayer[0].playerId;}
		else{this.$buefy.toast.open({
                    message: `Не подходящий субъект торговли`,
                    type: 'is-danger',
					duration:5000
                });
			return;}
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateTransaction',{
						id:null,
						playerId:playerId,
						god:this.transaction[0].god,
						resource:this.transaction[0].resource,
						quantity:this.transaction[0].quantity,
						gold:this.transaction[0].gold,
						description:this.transaction[0].description
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
		this.$buefy.toast.open({
                    message: `Сделка совершена!`,
                    type: 'is-success',
					duration:5000
        })
		this.transaction=[{playerId:null,god:this.transaction[0].god, resource:null, quantity:null, gold:null,description:null}];
		this.tradeGodName=this.transaction[0].god;
	    this.tradeResourceName='';
		this.loader_.classList.toggle('hidden');
	},
	async startWarProgress(){
		console.log('Отмечаем стратегическую точку',this.warProgressObject[0]);
		
		this.loader_.classList.toggle('hidden');
		let response;
			try{
				response = await axios.post('https://blooming-refuge-12227.herokuapp.com/setOrUpdateWarProgress',{
						id:null,
						cycleId:this.warProgressObject[0].cycleId,
						checkpointId:this.warProgressObject[0].checkpointId,
						squadId:this.warProgressObject[0].squadId
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
                    type: 'is-danger'
                });
				this.loader_.classList.toggle('hidden');
				return;
			}
		
		this.loader_.classList.toggle('hidden');
		this.$buefy.toast.open({
                    message: `Стратегическая точка отмечена`,
                    type: 'is-success'
        })
		this.warProgressObject=[{cycleId:this.warProgressObject[0].cycleId,checkpointId:null, squadId:null, cycleType:null, checkpointState:null,squadLogo:null}];
		this.squadName_warProgress=''
	    this.checkpointName_warProgress=''
	    //this.cycleName_warProgress=''
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
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.innerTab{
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items:center;
}
.innerTabRow{
	padding:10px;
	display:flex;
	justify-content: space-between;
	align-items:center;
	width: 100%
}
.innerTabRowPropName{
	display:flex;
	width: 50%;
	justify-content: flex-start;
	margin-right:20px;
}
.innerTabRowPropVal{
	display:flex;
	width: 50%;
	justify-content: flex-end;
	flex-wrap:wrap;
}
.innerTabWrap{
	padding:10px;
	display:flex;
	flex-wrap:wrap;
	justify-content: flex-start;
}
.innerTabCenter{
	border: 1px solid black;
	border-radius: 5px 15px;
	padding:5px;
	margin:5px;
	display:flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items:center;
}
.innerTabFurnal{
	display:flex;
	justify-content: flex-start;
	flex-direction: column;
	align-items:flex-start;
}
.red{
	color:red;
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
