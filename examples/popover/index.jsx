import PopOver from '../../lib/PopOver'
import React from 'react'
import { render } from 'react-dom'
import App from './app'

const mount = document.createElement('div');
document.body.appendChild(mount);

render(
	<App />,
	mount
);