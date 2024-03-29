import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import cert from '../rsa/publickey.json'
import jwt from 'jsonwebtoken'

import HelloWorld from '@/components/HelloWorld'
import test from '@/components/Test'
import qr from '@/components/QR'
import qrView from '@/components/QRview'
//import qr from '@/components/QR_pg'
//import qrView from '@/components/QRview_pg'
import printForm from '@/components/printForm'
import printForm_players from '@/components/printForm_players'
import login from '@/components/login'
import graph from '@/components/graph'
import stories from '@/components/stories'
import notFound from '@/components/notFound'
import forbidden from '@/components/forbidden'
import simulation from '@/components/simulation'
import honor from '@/components/honor'
import players from '@/components/players'
import message from '@/components/message'
import statistic from '@/components/statistic'

Vue.use(Router) 

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
	  meta:{
			guest:false
		}
    },
	{
      path: '/test',
      name: 'test',
      component: test,
	  meta:{
			requireAuth:true
		}
    },
	{
      path: '/qr',
      name: 'qr',
	component: qr,
	  meta:{
			requireAuth:true//,
			//requireAdmin:true
		}
	},
	{
      path: '/qrView',
      name: 'qrView',
      component: qrView,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/printForm',
      name: 'printForm',
      component: printForm,
	  meta:{
			requireAuth:true
		}
    },
	{
      path: '/printForm_players',
      name: 'printForm_players',
      component: printForm_players,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/login',
      name: 'login',
      component: login,
	  meta:{
			guest:true
		}
    },
	{
      path: '/graph',
      name: 'graph',
      component: graph,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/stories',
      name: 'stories',
      component: stories,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/simulation',
      name: 'simulation',
      component: simulation,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/honor',
      name: 'honor',
      component: honor,
	  meta:{
			requireAuth:false,
			requireAdmin:false,
			guest:true
		}
    },
	{
      path: '/players',
      name: 'players',
      component: players,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/message',
      name: 'message',
      component: message,
	  meta:{
			requireAuth:true
		}
    },
	{
      path: '/statistic',
      name: 'statistic',
      component: statistic,
	  meta:{
			requireAuth:true,
			requireAdmin:true
		}
    },
	{
      path: '/403',
      name: 'forbidden',
      component: forbidden,
	  meta:{
			guest:true
		}
    },
	{
      path: '/404',
      name: 'notFound',
      component: notFound,
	  meta:{
			guest:true
		}
    },
	{
		path: '*', 
		redirect: '/404' 
	}
  ]
});

router.beforeEach(async (to,from,next)=>{
	//console.log('beforeEach');
//console.log('to',to);
//console.log('from',from);
	//if(to.path == '/login'){console.log('запревентали');next();return;}
	//if(from.path == '/'){console.log('запревентали');next();return;}
	if(localStorage.getItem('jwt')){
		//console.log('beforeEach',localStorage.getItem('jwt'),cert);
		try{
			let token=jwt.verify(localStorage.getItem('jwt').replace(/"/g,''),cert.publicKey,{ algorithms: ['RS256'] })
			//console.log('beforeEach2',token);
		}catch(e){
			//console.log('beforeEach3',e);
			localStorage.removeItem('jwt');
			localStorage.removeItem('user');
			next({
                path: '/login',
                params: { nextUrl: to.fullPath },
				query: { nextUrl: to.fullPath || '/' }
            });
		}
	}
	if(to.matched.some(record => record.meta.requireAuth)) {
		//console.log('requireAuth',to.matched.some(record => record.meta.requireAuth));
        if (!localStorage.getItem('jwt')) {
			//console.log('no jwt',localStorage.getItem('jwt'),to.fullPath);
            next({
                path: '/login',
                params: { nextUrl: to.fullPath },
				query: { nextUrl: to.fullPath || '/' }
            });
        } else {
			if(to.matched.some(record => record.meta.requireAdmin)){
				let response;
				try{
					response = await axios.get('https://blooming-refuge-12227.herokuapp.com/isAdmin',{
					headers: {
					  'Content-Type': 'application/json',
					  'Authorization':`Bearer ${localStorage.getItem('jwt').replace(/"/g,'')}`
					}
					});
					//console.log(`получили ответ: ${response}`);
				}catch(e){
					console.log(e.message);
					next({
						path: '/403'
					});
				}
				if(response.data.isAdmin){
					next();
				}else{
					next({
						path: '/403'
					});
				}
			}
			//console.log('jwt',localStorage.getItem('jwt'));
            //let user = JSON.parse(localStorage.getItem('user'))
            //if(to.matched.some(record => record.meta.is_admin)) {
            //    if(user.is_admin == 1){
            //        next()
            //    }
            //    else{
            //        next({ name: 'userboard'})
            //    }
            else {
                next();
            }
        }
    } else if(to.path == '/login') {
	  //console.log('/login');
        if(localStorage.getItem('jwt') == null){
			//console.log('no jwt',localStorage.getItem('jwt'));
            next();
        }
        else{
	  //console.log('jwt',localStorage.getItem('jwt'));
            next({path:'/'});
        }
	  }
	else {
		//console.log('next()');
        next();
    }
});

export default router;
