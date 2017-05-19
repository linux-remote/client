import { Component} from 'react';
import style from '../css/style.scss';

class Index extends Component {
  render() {
    return (
      <div  className={style.test}>
      <h1>Clear</h1>
      <hr/>
      <h3>SERVER_CONFIG</h3>
      <pre>
      {JSON.stringify(window.SERVER_CONFIG)}
      </pre>
      </div>
    );
  }
}

export default Index;
