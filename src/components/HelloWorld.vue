<template>
<div class="row">
	<div></div>
	<div style="text-align:left;">
	  <B>Гермес-ТВ</B><br><br>
		<div>Вас приветствует корпорация Олимп!<br>Cайт сейчас находится на реконструкции и мы приносим свои извинения за доставленные неудобства.</div><br>
		<br>
		<b>Ссылки</b>
		<ol>
		<li><router-link :to="`/honor`">Зал славы корпорации Олимп</router-link></li>
		</ol>
		<!--<b>Сканер qr-кодов</b>
		<ol>
			<li>Откройте на вашем ПК (или любом другом устройстве с большим экраном) ссылку <a href="https://hermestv.herokuapp.com/qrView">https://hermestv.herokuapp.com/qrView</a> .
	<br>Там будет некоторое количество кодов для нескольких типов игровых объектов (да, там есть проблема с кодировкой, но не это сейчас главное).</li>
			<li>Откройте на телефоне ссылку <a href="https://hermestv.herokuapp.com/qr">https://hermestv.herokuapp.com/qr</a> .<br>
	Это сканер.<br>
	Кнопка "Сканировать" - просто посмотреть что написано в qr<br>
	Кнопка "Активировать" - активирует объект по qr<br>
	Кнопка "Деактивировать" - деактивирует объект по qr</li>
			<li>Чтобы посмотреть результат обновите страничку с qr-кодами</li>
			<li>Если у вас есть возможность распечатать qr-коды, то попробуйте отсканировать их с бумаги</li>
			<li>Добавьте результаты в таблицу на гуглодиске: <a href="https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0">https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0</a></li>
		</ol>
		<br><br>
		<b>Генератор печатной формы для Спутников</b>
		<ol>
			<li>Откройте ссылку <a href="https://hermestv.herokuapp.com/printForm">https://hermestv.herokuapp.com/printForm</a>.</li>
			<li>Если у игрока уже были сохранены спутники, то они загрузятся. <br>Важно! Изображения не сохраняются и их нужно каждый раз загружать заново.</li>
			<li>Добавьте спутников (введите имя и описание)</li>
			<li>Для добавленных спутников можете поменять имя или описание</li>
			<li>Выберите фотографию для каждого спутника. <br>Размер файла не должен превышать 10Мб</li>
			<li>Отправьте изображения спутников в редакцию Гермес-ТВ.</li>
			<li>Если у вас есть возможность, распечатайте печатную форму спутника</li>
			<li>Добавьте результаты в таблицу на гуглодиске: <a href="https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0">https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0</a></li>
		</ol>-->
	</div>
	<div></div>
</div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
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
