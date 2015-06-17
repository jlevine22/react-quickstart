'use strict';

var React = require('react');
var someFunction = require('./js/otherfile.js');

var MyApp = React.createClass({

    componentWillMount() {
        someFunction();
    },

    render() {
        return (
            <div>
                <h1>Hello World :)!!!</h1>
                <p>Hello World... :D!!!</p>
            </div>
        );
    }
});

module.exports = MyApp;

React.render(<MyApp/>, document.getElementById('main'));
