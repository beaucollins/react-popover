import React from 'react'

export default React.createClass({

	getDefaultProps: function() {
		return {
			onClosePopover: function() {},
			onShowPopover: function() {},
			context: null
		};
	},

	componentDidMount: function() {
		this.refs.container.focus();
		this.positionInContext();
		this.props.onShowPopover(this);
		var onResize = (function() {
			window.removeEventListener('resize', onResize);
			this.props.onClosePopover();
		}).bind(this);
		window.addEventListener('resize', onResize);
	},

	rectForDOMNode: function(node) {
		return {
			left: node.offsetLeft,
			top: node.offsetTop,
			width: node.offsetWidth,
			height: node.offsetHeight
		};
	},

	rect: function() {
		return this.rectForDOMNode(this.refs.popover);
	},

	positionInContext: function() {

		if (this.props.context == null) {
			return this.positionCenteredInParent();
		}

		var context = this.props.context,
				rect = this.rect(),
				node = this.refs.popover,
				parent = node.offsetParent || document.body,
				containingRect = this.rectForDOMNode(parent),
				arrowNode = this.refs.arrow,
				arrowRect = arrowNode.getBoundingClientRect();

		rect.left = Math.max((context.left + ((context.width - rect.width) * 0.5)), 10);
		rect.top = context.top + context.height + 10;

		rect.width = Math.min(containingRect.width - rect.left - 10, rect.width);
		rect.height = Math.min(containingRect.height - rect.top - 10, rect.height);

		// for now we display below
		node.style.left = rect.left + "px";
		node.style.top = rect.top + "px";

		node.style.height = rect.height + 'px';
		node.style.width = rect.width + 'px';

		// center of context
		var ctxCenter = context.width * 0.5 + context.left;

		arrowNode.style.left = Math.max((ctxCenter - rect.left), 4) + 'px';

	},

	positionCenteredInParent: function() {
		var node = this.refs.popover,
				parent = node.offsetParent || document.body,
				rect = this.rect();

		var containingRect = this.rectForDOMNode(parent);

		// first bound the sizes to max height and max width
		rect.width = Math.min(rect.width, containingRect.width - 40);
		rect.height = Math.min(rect.height, containingRect.height - 40);

		rect.x = (containingRect.width - rect.width) * 0.5;
		rect.y = (containingRect.height - rect.height) * 0.5;

		node.style.left = rect.x + "px";
		node.style.top = rect.y + "px";
		node.style.width = rect.width + "px";
		node.style.maxHeight = rect.height + "px";
	},

	onClickOutside: function(e) {
		e.preventDefault();
		this.props.onClosePopover();
	},

	onBlur: function() {
		// this.props.onClosePopover();
	},

	onFocus: function() {
	},

	onKeyDown: function(e) {
		if (e.which == 27) {
			this.props.onClosePopover();
		}
	},

	contextStyle: {
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		zIndex: '1'
	},

	shimStyle: {
		position: 'absolute',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		zIndex: '-1',
		cursor: 'default',
		WebkitTapHighlightColor: 'transparent'
	},

	containerStyle: {
		position: 'relative',
		outline: 'none',
		zIndex: '1',
		borderRadius: '4px',
		background: '#222',
		color: '#F0F0F0'
	},

	arrowStyle: {
		zIndex: '-1',
		position: 'absolute',
		top: '0',
		left: '0',
		width: '8px',
		height: '8px',
		background: '#222',
		transform: 'translate(-4px, -4px) rotate(45deg)',
		boxShadow: '0 0px 5px #000'
	},

	popoverStyle: {
		position: 'absolute',
		top: '0',
		left: '0',
		opacity: '0.95',
		borderRadius: '4px',
		boxShadow: '0 0px 3px #000'
	},

	render: function() {
		return (
			<div className="popoverContext" style={this.contextStyle} onClick={this.onClickOutside}>
				<a href="#" onClick={this.onClickOutside} style={this.shimStyle}></a>
				<div ref="popover" style={this.popoverStyle}>
					<div ref="arrow" style={this.arrowStyle}></div>
					<div className="popover-scroll"
						ref="container"
						onKeyDown={this.onKeyDown}
						tabIndex="-1"
						style={this.containerStyle}
						onFocus={this.onFocus}
						onBlur={this.onBlur}>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}

});