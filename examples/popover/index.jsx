import PopOver from '../../lib/PopOver.jsx'
import React from 'react'
import { render } from 'react-dom'

const mount = document.createElement('div');
document.body.appendChild(mount);

const App = React.createClass({

	getInitialState() {
		return { popover: false }
	},

	showPopover(e) {
		e.preventDefault();
		this.setState({popover: e.currentTarget.getBoundingClientRect()});
	},

	onClosePopover() {
		this.setState({popover: false});
	},

	renderPopover() {
		const {popover} = this.state;
		if (popover) {
			return (
				<PopOver context={popover} onClosePopover={this.onClosePopover}>
					<p style={{padding: '8px', margin: '0'}}>This is a message in a popover.</p>
				</PopOver>	
			)
		}
	},

	render() {
		return (
			<div>
				<a href="#" onClick={this.showPopover}>Click Me</a>
				{this.renderPopover()}
			</div>
		);
	}

});

render(
	<App />,
	mount
);