import { Component} from 'react';
const _require = require('./ri');
import * as _import from './ri';

const _requireHaveModule = require('./ri2');
import * as _importHaveModule from './ri2';
import ImportHaveModule from './ri2';
console.log(ImportHaveModule === _requireHaveModule )
console.log(ImportHaveModule === _importHaveModule.default )
class Index extends Component {
  render() {
    return (
      <div>
        <h2>require一个没有module.exports的文件</h2>
        {JSON.stringify(_require)}
        <h2>import *一个没有module.exports的文件</h2>
        {JSON.stringify(_import)}
        <h3>结论:exports. = export</h3>
        <hr/>
        <h2>加上module.exports后的require</h2>
        {JSON.stringify(_requireHaveModule)}
        <h2>加上module.exports后的import *</h2>
        {JSON.stringify(_importHaveModule)}
        <h3>结论:module.exports = export default</h3>
        <hr/>
        最终结论:
        <h1>require !== import * !== import default</h1>
      </div>
    );
  }
}

export default Index;
