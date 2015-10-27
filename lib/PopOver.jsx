import React from 'react'

const position = { ABOVE: 1, LEFT: 2, RIGHT: 3, BELOW: 4 };
const center = { BOTH: 3, HORIZONTAL: 1, VERTICAL: 2 };
const edge = { TOP: 0, RIGHT: 1, BOTTOM: 2, LEFT: 3 };

function rect(left, top, width, height, position) {
	return { left, top, width, height, area: width * height, position: position };
}

function extendRect(source, props) {
	return Object.assign({}, source, props);
}

function insetRect(rect, top, right, bottom, left) {
	return Object.assign({}, rect, {
		top:      rect.top + top,
		left:     rect.left + left,
		width:    rect.width - (right + left),
		height:   rect.height - (bottom + top)
	});
};

function rectMaxX(rect) {
	return rect.left + rect.width;
}

function rectMaxY(rect) {
	return rect.top + rect.height;
}

function rectCenter(rect) {
	return {
		x: rect.left + (rectMaxX(rect) - rect.left) * 0.5,
		y: rect.top + (rectMaxY(rect) - rect.top) * 0.5
	}
}

function byArea(regions) {
	// map regions to areas, sort by largest area, return first
	return regions
		// filter out anything with an area of 0
		.filter((r) => r.area > 0)
		// sort by area, largest first
		.sort((a, b) => { return a.area > b.area ? -1 : 1 });
}

function fitRect(area, within, centeredAt) {
	return pinRect(
		centerRect(area, within, centeredAt),
		within,
		edgeForPosition(within.position)
	);
}

function centerRect(area, within, gravity, axis = center.BOTH) {
	if (!gravity) gravity = rectCenter(within);
	const x = axis == center.BOTH || center.VERTICAL ? gravity.x - (area.width * 0.5) : area.x,
				y = axis == center.BOTH || center.HORIZONTAL ? gravity.y - (area.height * 0.5) : area.y;
	return rect(
		Math.max(Math.min(x, within.left + within.width - area.width), within.left),
		Math.max(Math.min(y, within.top + within.height - area.height), within.top),
		Math.min(area.width, within.width),
		Math.min(area.height, within.height)
	);
}

function pinRect(area, within, side) {
	switch (side) {
	case edge.BOTTOM:
		return extendRect(area, { top: within.top + within.height - area.height });
	case edge.TOP:
		return extendRect(area, { top: within.top });
	case edge.LEFT:
		return extendRect(area, { left: within.left });
	case edge.RIGHT:
		return extendRect(area, { left: within.left + within.width - area.width });
	default:
		return area;
	}
}

function regionsFor(area, inRect) {
	// Split the containing rect "inRect" into 4 potential
	// rects that the popover can be placed in
	const max = {x: rectMaxX(area), y: rectMaxY(area)};
	return [
		rect(inRect.left, inRect.top, inRect.width, area.top, position.ABOVE),
		rect(inRect.left, inRect.top, area.left, inRect.height, position.LEFT),
		rect(area.left + area.width, inRect.top, inRect.width - max.x, inRect.height, position.RIGHT),
		rect(inRect.left, max.y, inRect.width, inRect.height - max.y, position.BELOW)
	];
}

function translateRect(area, by) {
	return Object.assign({}, area, { left: area.left + by.x, top: area.top + by.y });
}

function edgeForPosition(pos) {
	switch (pos) {
	case position.ABOVE:
		return edge.BOTTOM;
	case position.BELOW:
		return edge.TOP;
	case position.LEFT:
		return edge.RIGHT;
	case position.RIGHT:
		return edge.LEFT;
	}
}

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
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('scroll', this.onWindowScroll);
	},

	onWindowResize: function() {
		this.props.onClosePopover();
		window.removeEventListener('resize', this.onWindowResize);
	},

	onWindowScroll: function() {
		this.props.onClosePopover();
		window.removeEventListener('scroll', this.onWindowScroll);
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
		return this.refs.popover.getBoundingClientRect();
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

		const [best, ...rest] = byArea(regionsFor(context, containingRect));
		const max = insetRect(best, 10, 10, 10, 10);
		const fit = fitRect(rect, max, rectCenter(context));
		const r = fit;

		// for now we display below
		node.style.left   = r.left + "px";
		node.style.top    = r.top + "px";
		node.style.height = r.height + 'px';
		node.style.width  = r.width + 'px';

		// center of context
		const arrowCenter = rectCenter(context);

		var ctxCenter = context.width * 0.5 + context.left;

		const arr = translateRect(pinRect({
			width: 0, height: 0,
			left: arrowCenter.x, top: arrowCenter.y
		}, r, edgeForPosition(best.position)), {x: -r.left, y: -r.top});

		arrowNode.style.left = arr.left + 'px';
		arrowNode.style.top = arr.top + 'px';

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
		position: 'fixed',
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
		color: '#F0F0F0',
		height: '100%',
		width: '100%'
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