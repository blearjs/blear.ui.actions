/**
 * 操作拉出框
 * @author ydr.me
 * @create 2016-04-28 13:08
 */


'use strict';

var UI = require('blear.ui');
var Popup = require('blear.ui.popup');
var access = require('blear.utils.access');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');
var number = require('blear.utils.number');
var array = require('blear.utils.array');
var typeis = require('blear.utils.typeis');
var Template = require('blear.classes.template');
var selector = require('blear.core.selector');
var event = require('blear.core.event');
var attribute = require('blear.core.attribute');
var template = require('./template.html', 'html');

var namespace = UI.UI_CLASS + '-actions';
var btnClass = '.' + namespace + '-group-item_button';
var tpl = new Template(template);
var defaults = {
    /**
     * 打开动画
     * @param to
     * @param done
     */
    openAnimation: undefined,

    /**
     * 关闭动画
     * @param to
     * @param done
     */
    closeAnimation: undefined
};
var Actions = Popup.extend({
    className: 'Actions',
    constructor: function (options) {
        var the = this;

        options = the[_options] = object.assign(true, {}, defaults, options);
        Actions.parent(the, {
            openAnimation: options.openAnimation,
            closeAnimation: options.closeAnimation
        });
        the[_groups] = [];
        the[_callbacksMap] = {};

        // init event

        event.on(the.getElement(), 'click', btnClass, function () {
            var el = this;
            var index = attribute.data(el, 'index');
            var id = attribute.data(el, 'id');
            var callback = the[_callbacksMap][id];

            callback.call(the);
            the.emit('action', number.parseInt(index));
        });
    },

    /**
     * 增加一个分组
     * @returns {Actions}
     */
    group: function () {
        var the = this;

        the[_lastButtons] = [];
        the[_groups].push(the[_lastButtons]);

        return the;
    },

    /**
     * 增加一个文本
     * @param text
     * @returns {Actions}
     */
    text: function (text) {
        var the = this;
        the[_lastButtons].push({
            category: 'text',
            text: text
        });
        return the;
    },

    /**
     * 增加一个按钮
     * @param text
     * @param [type]
     * @param [callback]
     * @returns {Actions}
     */
    button: function (text, type, callback) {
        var the = this;
        var args = access.args(arguments);
        var defaultButtonType = 'primary';

        if (args.length === 2) {
            if (typeis.Function(args[1])) {
                callback = args[1];
                type = defaultButtonType;
            }
        }

        var id = sole();
        callback = fun.ensure(callback);
        the[_callbacksMap][id] = callback;
        the[_lastButtons].push({
            id: id,
            category: 'button',
            type: type || defaultButtonType,
            text: text
        });
        return the;
    },


    /**
     * 渲染
     * @returns {Actions}
     */
    render: function () {
        var the = this;
        var html = tpl.render({groups: the[_groups]});

        Actions.parent.setHTML(the, html);
        var btnEls = selector.query(btnClass, the.getElement());
        array.each(btnEls, function (index, el) {
            attribute.data(el, 'index', index);
        });

        return the;
    },


    /**
     * 销毁实例
     * @param callback {Function} 回调
     */
    destroy: function (callback) {
        var the = this;

        callback = fun.noop(callback);
        callback = fun.bind(callback, the);
        Actions.parent.destroy(the, callback);
    }
});
var sole = Actions.sole;
var _options = sole();
var _groups = sole();
var _lastButtons = sole();
var _callbacksMap = sole();

require('./style.css', 'css|style');
Actions.defaults = defaults;
module.exports = Actions;
