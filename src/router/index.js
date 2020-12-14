import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/Test'
//import qr from '@/components/QR'
//import qrView from '@/components/QRview'
import qr from '@/components/QR_pg'
import qrView from '@/components/QRview_pg'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
	{
      path: '/test',
      name: 'test',
      component: test
    },
	{
      path: '/qr',
      name: 'qr',
      component: qr
    },
	{
      path: '/qrView',
      name: 'qrView',
      component: qrView
    }
  ]
})
