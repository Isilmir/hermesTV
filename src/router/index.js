import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import test from '@/components/Test'
import qr from '@/components/QR'
import qrView from '@/components/QRview'
//import qr from '@/components/QR_pg'
//import qrView from '@/components/QRview_pg'
import printForm from '@/components/printForm'
import login from '@/components/login'

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
			requireAuth:true
		}
	},
	{
      path: '/qrView',
      name: 'qrView',
      component: qrView,
	  meta:{
			requireAuth:true
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
      path: '/login',
      name: 'login',
      component: login,
	  meta:{
			guest:true
		}
    }
  ]
});

router.beforeEach((to,from,next)=>{
	//console.log('beforeEach');
//console.log('to',to);
//console.log('from',from);
	//if(to.path == '/login'){console.log('запревентали');next();return;}
	//if(from.path == '/'){console.log('запревентали');next();return;}
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
			//console.log('jwt',localStorage.getItem('jwt'));
            //let user = JSON.parse(localStorage.getItem('user'))
            //if(to.matched.some(record => record.meta.is_admin)) {
            //    if(user.is_admin == 1){
            //        next()
            //    }
            //    else{
            //        next({ name: 'userboard'})
            //    }
            //}else {
                next()
            //}
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
