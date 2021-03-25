import React from 'react';
import { render } from 'react-dom';
import * as $ from 'jquery'
import Post from '@models/Post';
import WebpackLogo from './assets/webpack-logo.png';
import json from './assets/json';
import xml from './assets/data.xml';
import csv from './assets/data.csv';
import './babel';
import './styles/styles.css';
import './styles/less.less';
import './styles/scss.scss';

const post = new Post('Webpack Post Title', WebpackLogo);

console.log('Post to string', post.toString());

console.log('json', json);

console.log('xml', xml);

console.log('csv', csv);

$('pre').addClass('code').html(post.toString());



const App = () => (
  <h3 style={{ 'color':'gold', 'textAlign': 'center', 'fontSize': '28px'}}>It is React app !!!</h3>
);

render(<App/>, document.getElementById('root'));
