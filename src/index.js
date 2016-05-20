/**
 * 操作拉出框
 * @author ydr.me
 * @create 2016-04-28 13:08
 */


'use strict';

var UI =        require('blear.ui');
var Popup =     require('blear.ui.popup');
var access =    require('blear.utils.access');
var object =    require('blear.utils.object');
var fun =       require('blear.utils.function');
var number =    require('blear.utils.number');
var array =     require('blear.utils.array');
var Template =  require('blear.classes.template');
var selector =  require('blear.core.selector');
var event =     require('blear.core.event');
var attribute = require('blear.core.attribute');
var template =  require('./template.html', 'html');

var namespace = UI.UI_CLASS + '-actions';
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


        // init event
        var className = '.' + namespace + '-group-item_button';
        var btnEls = selector.query(className, the.getElement());
        array.each(btnEls, function (index, el) {
            attribute.data(el, 'index', index);
        });

        event.on(the.getElement(), 'click', className, function () {
            var el = this;
            var index = attribute.data(el, 'index');

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
            type: 'text',
            text: text
        });
        return the;
    },

    /**
     * 增加一个按钮
     * @param text
     * @param status
     * @returns {Actions}
     */
    button: function (text, status) {
        var the = this;
        var args = access.args(arguments);

        the[_lastButtons].push({
            type: 'button',
            status: status || 'primary',
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
var _options = Actions.sole();
var _groups = Actions.sole();
var _lastButtons = Actions.sole();

require('./style.css', 'css|style');
Actions.defaults = defaults;
module.exports = Actions;
