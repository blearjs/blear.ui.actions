/**
 * 文件描述
 * @author ydr.me
 * @create 2018-10-12 13:24
 * @update 2018-10-12 13:24
 */


'use strict';

var Actions = require('../src/index');

var actions = new Actions();

actions
    .group()
    .text('一段文本')
    .button('一个按钮', 'primary')
    .render();

document.getElementById('open').onclick = function () {
    actions.open();
};
