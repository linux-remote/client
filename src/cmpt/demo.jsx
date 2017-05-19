import { Component , PropTypes} from 'react';
import style from '../css/style.scss';
import countStore from '../store/count';
import {connect, Provider} from 'react-redux';

class Title extends Component {
  static PropTypes = {
    msg: PropTypes.string
  };
  changeMsg = changeMsg;
  state = {msg: 'world'}
  addCount(){
    this.props.dispatch({type:'INCREMENT'})
  }
  reduceCount(){
    this.props.dispatch({type:'DECREMENT'})
  }
  render() {
    return (<div>
      <hr/>
        <span>props.msg = </span><b>{this.props.msg}</b>
        <span>state.msg = </span><b>{this.state.msg}</b>
        <button onClick={::this.changeMsg}>改变state</button>
          <br/>
        <span>store count = </span><b>{this.props.count}</b>
        <button onClick={::this.addCount}>增加count</button>
        <button onClick={::this.reduceCount}>减少count</button>
        <p/>
        <hr/>
      </div>);
  }
}

const mapStateToProps = (state) => { return {count:state}; };
const CountTitle = connect(mapStateToProps)(Title);
function changeMsg() {
  var msg = this.state.msg;
  msg = msg.split('').reverse().join('');
  this.setState({msg});
}

class H1 extends Component {
  render() {
    return (
      <h1>{this.props.msg.split('').join(this.props.count)}</h1>
    );
  }
}
const CountH1 = connect(mapStateToProps)(H1);

class Index extends Component {
  state= {msg: 'hello'};
  changeMsg = changeMsg;
  render() {
    return (
      <div  className={style.test}>
      <h1>react+redux Demo</h1>
      <br/>
      <span>state.msg = </span><b>{this.state.msg}</b>
      <button onClick={::this.changeMsg} style={{margin:'5px'}}>改变state</button>
      <Provider store={countStore}>
        <CountTitle msg={this.state.msg} />
      </Provider>
      <Provider store={countStore}>
      <CountH1 msg={this.state.msg} />
      </Provider>
      </div>
    );
  }
}

export default Index;
