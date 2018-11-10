import React, {Component} from 'react';
import '../App.css';
import {connect} from 'react-redux';
import {setCurrentView} from '../actions/main';
import DropDownButton from './DropDownButton';

class Header extends Component {
    render() {
        return (
            <header className="app-header">
                <label>Account</label>
                <select name="account">
                    <option value="copper">Copper Capital Inc</option>
                    <option value="orderia">Orderia Fin Monsta</option>
                    <option value="blackrock">Blackrock Inc</option>
                </select>
                <label>Layout</label>
                <select name="view" value={this.props.currentView.name} onChange={e => this.props.setCurrentView(e.nativeEvent.target.value)}>
                    <option value="1">Delta - Vega Summary</option>
                    <option value="2">Vega - Vega Grid</option>
                    <option value="3">Delta - Theta</option>
                    <option value="new">+ Create new view</option>
                </select>
                <DropDownButton/>
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        currentView: state.main.currentView
    }
}

const mapDispatchToProps = {setCurrentView};

export default connect(mapStateToProps, mapDispatchToProps)(Header);