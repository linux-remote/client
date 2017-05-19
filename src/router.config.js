import Home from './cmpt/home';
import * as  layout from './cmpt/layout';
import demo from './cmpt/demo';
import test from './cmpt/test';

export default {
  path: '/',
  component: layout.Top,
  indexRoute: { component: Home },
  childRoutes:[
    {path:'demo', component: demo},
    {path:'test', component: test},
    {path:'*', component: layout.NotFound}
  ]
};
