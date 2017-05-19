import { Component} from 'react';
import { Link } from 'react-router';

export class Top extends Component {
  render() {
    return (
      <div className="root">
        <div className="top">
        <Link to='/' onlyActiveOnIndex={true} activeClassName='active'>home</Link>
        <Link to='/demo' activeClassName='active'>demo</Link>
        <Link to='/test' activeClassName='active'>test</Link>
        </div>
        <div className="bottom">{this.props.children}</div>
      </div>
    );
  }
}

export class NotFound extends Component {
  render() {
    return (
      <h1>404 NotFound</h1>
    );
  }
}
