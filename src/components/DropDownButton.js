import React, {Component} from 'react';
import './DropDownButton.css';
import {connect} from 'react-redux';
import {addReport} from '../actions/main';

/* eslint-disable */

class DropDownButton extends Component {
    constructor(props) {
        super(props);
        this.clicked = this.clicked.bind(this);
        window.onclick = function (event) {
            if (!event.target.matches('.dropbtn')) {
                let dropDowns = document.getElementsByClassName("dropdown-content");
                let i;
                for (i = 0; i < dropDowns.length; i++) {
                    let openDropDown = dropDowns[i];
                    if (openDropDown.classList.contains('show')) {
                        openDropDown.classList.remove('show');
                    }
                }
            }
        }
    }

    clicked(event) {
        this.props.addReport(event.currentTarget.innerText);
    }

    render() {
        return (
            <div className="dropdown">
                <button onClick={() => document.getElementById("myDropdown").classList.toggle("show")} className="dropbtn">+</button>
                <div id="myDropdown" className="dropdown-content">
                    <a href="#" onClick={this.clicked}>Vega</a>
                    <a href="#" onClick={this.clicked}>Delta</a>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {addReport};

export default connect(null, mapDispatchToProps)(DropDownButton);