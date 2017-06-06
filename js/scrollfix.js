/**
 * scrollfix.js
 */
;(function (global) {
    "use strict";

    /**
     * arguments.0: 要固定的dom的选择器
     * arguments.1: 配置
     */
    var ScrollFix = function(options) {
        // 选项默认值
        var defaults = {
            top: 0,
            start_top: 0,//默认是this.dom.offsetTop
            hold_palce: true,
            container: window,
        };
        // 选择器
        var selecter = arguments[0];
        // 选定dom
        this.dom = document.querySelector(selecter);
        this.dom.sf_fixed = false;
        if (typeof this.dom === 'undefined') {
            console.log('选择器没有对应dom');
            return;
        }
        // 选项
        this.opts = defaults;
        this.opts.start_top = this.dom.offsetTop;
        console.log(this.opts);
        // 用户选项覆盖默认值
        if (typeof arguments[1] === 'object') {
            var user_opts = arguments[1];
            for(var opt_name in user_opts){
                if (typeof this.opts[opt_name] !== 'undefined') this.opts[opt_name] = user_opts[opt_name];
            }
        }
        // 开始固定
        this.start();
    };


    ScrollFix.prototype = {
        start: function(){
            var ScrollFix = this;
            do_fix(ScrollFix);
            addEvent(ScrollFix.opts.container, 'scroll', function(){
                do_fix(ScrollFix);
            });
        }
    };

    function do_fix(ScrollFix){
        var c_scroll = {};
        var opts = ScrollFix.opts;
        var dom = ScrollFix.dom;
        c_scroll.y = opts.container.scrollY;
        // scroll比strat大要固定
        if(c_scroll.y > opts.start_top){
            if(dom.sf_fixed === true) return;
            // 进行固定
            if (opts.hold_palce) {
                var holder =  document.createElement("div");
                holder.height = dom.offsetHeight;
                holder.width = dom.offsetWidth;
                dom.parentNode.insertBefore(holder,dom);
            }
            dom.style.position = 'fixed';
            dom.style.top = opts.top;
            dom.sf_fixed = true;
        }
        // strat比scroll小不固定
        if (c_scroll.y <= opts.start_top) {
            console.log(dom.style.position);
            if(dom.sf_fixed === false) return;
            // 取消固定
            if (opts.hold_palce) {
                var holder =  document.createElement("div");
                holder.height = dom.offsetHeight;
                holder.width = dom.offsetWidth;
                dom.parentNode.removeChild(prevNode(dom));
            }
            dom.style.position = 'static';
            dom.sf_fixed = false;
        }
    }

    function addEvent(obj,type,fn){
        if(obj.attachEvent){
            obj.attachEvent('on'+type,function(){
                fn.call(obj);
            })
        }else{
            obj.addEventListener(type,fn,false);
        }
    }

    function prevNode(elem) {          //获取当前节点的上一个元素节点
        do {
            elem = elem.previousSibling;
        }while(elem && elem.nodeType != 1);
        return elem;
    }

    //兼容CommonJs规范
    if (typeof module !== 'undefined' && module.exports) module.exports = ScrollFix;

    //兼容AMD/CMD规范
    if (typeof define === 'function') define(function() { return ScrollFix; });

    global.ScrollFix = ScrollFix;

})(this);