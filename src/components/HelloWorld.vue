<template>
<div class="row">
	<div></div>
	<div style="text-align:left;">
	  <h1>Гермес-ТВ</h1>
		<div>Cайт сейчас находится на реконструкции но вы можете оказать помощь в тестировании.</div><br>
		<h2>Сканер qr-кодов</h2>
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
		<h2>Генератор печатной формы для БЖЗИ</h2>
		<ol>
			<li>Откройте ссылку <a href="https://hermestv.herokuapp.com/printForm">https://hermestv.herokuapp.com/printForm</a>.</li>
			<li>Введите имя БЖЗИ, описание и владельца<br>
			<li>Выберите фотографию. <br>Размер файла не должен превышать 100Кб</li>
			<li>Сохраните печатную форму БЖЗИ.</li>
			<li>Если у вас есть возможность, распечатайте печатную форму БЖЗИ</li>
			<li>Добавьте результаты в таблицу на гуглодиске: <a href="https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0">https://docs.google.com/spreadsheets/d/1Hap_DP8qtkNoYHHFwW-pCZYW98pQD1I6hxikPbSquDQ/edit#gid=0</a></li>
		</ol>
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
