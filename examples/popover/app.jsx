import React from 'react'
import PopOver from '../../lib/PopOver'

const buttonStyle = {
	padding: '4px',
	border: '1px solid #CCC',
	borderRadius: '2px',
	textDecoration: 'none'
};

const appStyle = {
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-between',
	font: '14px helvetica'
};

const lorem = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const toolbarStyle = {
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	margin: '10px',
	padding: '20px 0'
};

export default React.createClass({

	getInitialState() {
		return { popover: false }
	},

	showPopover(e) {
		e.preventDefault();
		this.setState({
			popover: e.currentTarget.getBoundingClientRect(),
			content: e.currentTarget.getAttribute("title")
		});
	},

	componentDidMount() {
		// this.setState({popover: this.refs.start.getBoundingClientRect()});
		var popovers = [];
		for(var ref in this.refs)
			popovers.push(this.refs[ref].getBoundingClientRect());

		this.setState({popovers: popovers});
	},

	onClosePopover() {
		this.setState({ popover: false, popovers: null });
	},

	renderPopovers() {
		const { popovers } = this.state;

		if (popovers) {
			return popovers.map((popover, i) => {
				const { left, top, width, height } = popover;
				return (
					<PopOver key={i} context={popover} onClosePopover={this.onClosePopover}>
						<p style={{padding: '10px', margin: '0', maxWidth: '320px'}}>{ lorem }</p>
					</PopOver>
				);
			})
		}
	},

	renderPopover() {
		const {popover, content} = this.state;
		if (popover) {
			return (
				<PopOver context={popover} onClosePopover={this.onClosePopover}>
					<p style={{padding: '8px', margin: '0', maxWidth: '320px'}}>{content || lorem}</p>
				</PopOver>
			)
		}
	},

	renderButton(key, label, i) {
		if (Array.isArray(label)) {
			var [label, title] = label
		}
		return (<a href="#" key={i} ref={[key, "button", i].join("_")} title={title} style={buttonStyle} onClick={this.showPopover}>{label}</a>);
	},

	renderButtonWithKeyPrefix(prefix) {
		return (label, i) => {
			return this.renderButton(prefix, label, i);
		};
	},

	render() {
		const bottomLeft = Object.assign({}, buttonStyle, { position: 'absolute', left: '10px', bottom: '10px' }),
					bottomRight = Object.assign({}, buttonStyle, { position: 'absolute', right: '10px', bottom: '10px' }),
					centerLeft = Object.assign({}, buttonStyle, { position: 'absolute', left: '10px', top: '50%' }),
					centerRight = Object.assign({}, buttonStyle, { position: 'absolute', right: '10px', top: '50%' }),
					buttons = [
						['Click Me', "Popover message"], 
						['Me Too', lorem],
						'Help',
						'This One',
						'How about this?',
						'Me Too'
					];
		return (
			<div style={appStyle}>
				{ ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((name, i) => {
					return (
						<div style={toolbarStyle} key={i}>
							{buttons.map(this.renderButtonWithKeyPrefix(name))}
						</div>
					)
				})}

				{this.renderPopover()}
				{this.renderPopovers()}
			</div>
		);
	}

});