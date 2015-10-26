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
		const toolbarStyle = {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between'
		};
		const buttonStyle = {
			padding: '4px',
			border: '1px solid #CCC',
			borderRadius: '2px'
		};
		const bottomLeft = Object.assign({}, buttonStyle, { position: 'absolute', left: '0', bottom: '0' });
		const bottomRight = Object.assign({}, buttonStyle, { position: 'absolute', right: '0', bottom: '0' });
		return (
			<div>
				<div style={toolbarStyle}>
					{['Click Me', 'Me Too', 'This One', 'How about this?', 'Me Too'].map((txt, i) => {
						return (<a href="#" key={i} style={buttonStyle} onClick={this.showPopover}>{txt}</a>);
					})}
				</div>
				<a href="#" style={bottomLeft} onClick={this.showPopover}>Bottom Left</a>
				<a href="#" style={bottomRight} onClick={this.showPopover}>Bottom Right</a>
				{this.renderPopover()}
			</div>
		);
	}

});

render(
	<App />,
	mount
);