/*
 * Picker for selecting a period of time.
 *
 * Version 0.99, compatible with Ext JS 4.1.
 *  
 * Copyright (c) 2011-2012 Alexander Tokarev.
 *  
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.picker.MultiTime', {
    extend: 'Ext.Component',
    alias:  'widget.multitimepicker',
    
    alternateClassName: [
        'Ext.picker.MultiTime',
        'Ext.MultiTimePicker'
    ],
    
    requires: [
        'Ext.XTemplate',
        'Ext.Date',
        'Ext.button.Button'
    ],
    
    childEls: [
        'bodyEl', 'eventEl', 'bodyElStart', 'bodyElEnd', 'buttonsEl'
    ],
    
    renderTpl: [
        '<div id="{id}-bodyEl" class="{baseCls}-table">',
            '<div class="{baseCls}-header {baseCls}-table-row{ie}">',
                '<tpl if="multiValue">',
                    '<div class="{baseCls}-header-item{ie}">{startingTimeText}</div>',
                    '<div class="{baseCls}-header-item{ie}">{endingTimeText}</div>',
                '<tpl else>',
                    '<div class="{baseCls}-header-item{ie}">{selectTimeText}</div>',
                '</tpl>',
            '</div>',
            '<div id="{id}-eventEl" class="{baseCls}-table-row{ie}">',
                '<div id="{id}-bodyElStart" class="{baseCls}-body {baseCls}-table-cell{ie}">',
                    '<div class="{baseCls}-table-row{ie}">',
                        '<div class="{baseCls}-item {baseCls}-ampm"><a href="#" hidefocus="on">{amText}</a></div>',
                        '<div class="{baseCls}-item {baseCls}-ampm"><a href="#" hidefocus="on">{pmText}</a></div>',
                    '</div>',
                    '<div class="{baseCls}-separator">',
                        '<div class="{baseCls}-separator-stricken {baseCls}-separator-left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                        '<div class="{baseCls}-separator-text">{hoursText}</div>',
                        '<div class="{baseCls}-separator-stricken {baseCls}-separator-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                    '</div>',
                    '<div class="{baseCls}-table-row{ie}">',
                        '<tpl for="hours">',
                            '<div class="{parent.baseCls}-item {parent.baseCls}-hour"><a href="#" hidefocus="on">{.}</a></div>',
                        '</tpl>',
                    '</div>',
                    '<div class="{baseCls}-separator">',
                        '<div class="{baseCls}-separator-stricken {baseCls}-separator-left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                        '<div class="{baseCls}-separator-text">{minutesText}</div>',
                        '<div class="{baseCls}-separator-stricken {baseCls}-separator-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                    '</div>',
                    '<div class="{baseCls}-table-row{ie} {baseCls}-minutes">',
                        '<tpl for="minutes">',
                            '<div class="{parent.baseCls}-item {parent.baseCls}-minute"><a href="#" hidefocus="on">{.}</a></div>',
                        '</tpl>',
                    '</div>',
                '</div>',
                '<tpl if="multiValue">',
                    '<div id="{id}-bodyElEnd" class="{baseCls}-body {baseCls}-table-cell{ie} {baseCls}-inner-border">',
                        '<div class="{baseCls}-table-row{ie}">',
                            '<div class="{baseCls}-item {baseCls}-ampm"><a href="#" hidefocus="on">{amText}</a></div>',
                            '<div class="{baseCls}-item {baseCls}-ampm"><a href="#" hidefocus="on">{pmText}</a></div>',
                        '</div>',
                        '<div class="{baseCls}-separator">',
                            '<div class="{baseCls}-separator-stricken {baseCls}-separator-left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                            '<div class="{baseCls}-separator-text">{hoursText}</div>',
                            '<div class="{baseCls}-separator-stricken {baseCls}-separator-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                        '</div>',
                        '<div class="{baseCls}-table-row{ie}">',
                            '<tpl for="hours">',
                                '<div class="{parent.baseCls}-item {parent.baseCls}-hour"><a href="#" hidefocus="on">{.}</a></div>',
                            '</tpl>',
                        '</div>',
                        '<div class="{baseCls}-separator">',
                            '<div class="{baseCls}-separator-stricken {baseCls}-separator-left">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                            '<div class="{baseCls}-separator-text">{minutesText}</div>',
                            '<div class="{baseCls}-separator-stricken {baseCls}-separator-right">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>',
                        '</div>',
                        '<div class="{baseCls}-table-row{ie} {baseCls}-minutes">',
                            '<tpl for="minutes">',
                                '<div class="{parent.baseCls}-item {parent.baseCls}-minute"><a href="#" hidefocus="on">{.}</a></div>',
                            '</tpl>',
                        '</div>',
                    '</div>',
                '</tpl>',
            '</div>',
        '</div>',
        '<div id="{id}-buttonsEl" class="{baseCls}-buttons">{%',
            'var me        = values.$comp,',
                'okBtn     = me.okBtn,',
                'cancelBtn = me.cancelBtn,',
                'clearBtn  = me.clearBtn;',
            
            'okBtn.ownerLayout = cancelBtn.ownerLayout = clearBtn.ownerLayout = me.componentLayout;',
            'okBtn.ownerCt     = cancelBtn.ownerCt     = clearBtn.ownerCt     = me;',
            
            'Ext.DomHelper.generateMarkup(okBtn.getRenderTree(), out);',
            'Ext.DomHelper.generateMarkup(cancelBtn.getRenderTree(), out);',
            'Ext.DomHelper.generateMarkup(clearBtn.getRenderTree(), out);',
        '%}</div>'
    ],
    
	/**
	 * @cfg {String} selectTimeText Text to display for picker header in single-value mode.
	 */
	selectTimeText: 'Select Time',
	
    /**
     * @cfg {String} startingTimeText Text to display for starting time header.
     */
    startingTimeText: 'Starting Time',
    
    /**
     * @cfg {String} endingTimeText Text to display for ending time header.
     */
    endingTimeText: 'Ending Time',
    
    /**
     * @cfg {String} amText Text to display in AM field.
     */
    amText: 'AM',
    
    /**
     * @cfg {String} pmText Text to display in PM field.
     */
    pmText: 'PM',
    
	/**
	 * @cfg {String} hoursText Text to display in Hours separator.
	 */
	hoursText: 'Hours:',
	
	/**
	 * @cfg {String} minutesText Text to display in Minutes separator.
	 */
	minutesText: 'Minutes:',

	/**
	 * @cfg {String} okText Text to display in OK button.
	 */
	okText: 'OK',
	
	/**
	 * @cfg {String} cancelText Text to display in Cancel button.
	 */
	cancelText: 'Cancel',
	
	/**
	 * @cfg {String} clearText Text to display in Clear button.
	 */
	clearText: 'Clear',
	
	/**
	 * @cfg {String[]} hourValues Array of hour values.
	 */
	hourValues: [
	    '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'
	],
	
	/**
	 * @cfg {String[]} minuteValues Array of minute values.
	 */
	minuteValues: [
	    '00', '15', '30', '45'
	],
	
    /**
     * @cfg {String} baseCls The base CSS class to apply to the picker element. Defaults to <tt>'ux-timepicker'</tt>
     */
    baseCls: 'ux-timepicker',

    /**
     * @cfg {String} selectedCls The class to be added to selected items in the picker. Defaults to
     * <tt>'{baseCls}-selected'</tt>
     */
    
    /**
     * @cfg {String} disabledCls The class to be added to disabled items in the picker.
     * Defaults to <tt>'{baseCls}-disabled'</tt>
     */
    
    /**
     * @private Width for one picker item, i.e. when multiValue is off.
     */
    width: 179,
    
    initComponent: function() {
        var me = this;
        
        if ( me.multiValue ) {
            me.width *= 2;
        };
        
        me.selectedCls = me.baseCls + '-selected';
        me.disabledCls = me.baseCls + '-disabled';
        
        me.addEvents(
            /**
             * @event okclick
             * Fires when the OK button is pressed.
             * @param {Ext.picker.MultiTime} this
             * @param {Array} value The current value
             */
            'okclick',
            
            /**
             * @event cancelclick
             * Fires when the Cancel button is pressed.
             * @param {Ext.picker.MultiTime} this
             */
            'cancelclick',
            
            /**
             * @event clearclick
             * Fires when the Clear button is pressed.
             * @param {Ext.picker.MultiTime} this
             */
            'clearclick',
            
            /**
             * @event ampmclick
             * Fires when AM/PM is selected.
             * @param {Ext.picker.MultiTime} this
             * @param {Array} value The current value
             */
            'ampmclick',
            
            /**
             * @event hourclick
             * Fires when an hour is selected.
             * @param {Ext.picker.MultiTime} this
             * @param {Ext.picker.MultiTime} value The current value
             */
            'hourclick',
            
            /**
             * @event minuteclick
             * Fires when minutes field is selected.
             * @param {Ext.picker.MultiTime} this
             * @param {Ext.picker.MultiTime} value The current value
             */
            'minuteclick'
        );
        
        me.callParent();
        
        me.initButtons();
        me.initDisabledValues();
        me.setInitialValue();
    },
    
    show: function() {
        var me = this;
        
        me.callParent();
        
        // This is a stupid but robust way to work around
        // keydown events that fire twice (XXX why?)
        me.seenEnter  = false;
        me.seenEscape = false;
        
        me.updateBody();
    },
    
    initDisabledValues: function() {
        var me = this,
            disabledMinutes;
        
        switch ( me.increment ) {
        case 60:
            disabledMinutes = [ 1, 2, 3 ];
            break;
        case 30:
            disabledMinutes = [ 1, 3 ];
            break;
        default:
            disabledMinutes = [];
        };
        
        me.disabledMinutes = disabledMinutes;
    },
    
    setInitialValue: function() {
        var me = this;
        
        me.setValue( me.value || me.clearValue() );
        
        me.updateBody();
    },
    
    // private, inherit docs
    beforeRender: function() {
        var me = this;
        
        me.callParent(arguments);

        Ext.apply(me.renderData, {
            selectTimeText:   me.selectTimeText,
            startingTimeText: me.startingTimeText,
            endingTimeText:   me.endingTimeText,
            amText:           me.amText,
            pmText:           me.pmText,
            hoursText:        me.hoursText,
            minutesText:      me.minutesText,
            hours:            me.hourValues,
            minutes:          me.minuteValues,
            baseCls:          me.baseCls,
            multiValue:       me.multiValue,
            ie:               Ext.isIE6 || Ext.isIE7 ? '-ie' : ''
        });
    },
    
    afterRender: function() {
        var me = this;
            
        me.callParent();
        
        me.initEvents();
        me.initCollections();
    },
    
    finishRenderChildren: function() {
        var me = this;
        
        me.callParent();
        
        me.okBtn.finishRender();
        me.cancelBtn.finishRender();
        me.clearBtn.finishRender();
    },
    
    initEvents: function() {
        var me = this,
            bodyStart = me.bodyElStart,
            bodyEnd   = me.bodyElEnd,
            evEl      = me.eventEl;
        
        me.mon(bodyStart, 'click',    me.onBodyStartClick, me);
        me.mon(bodyStart, 'dblclick', me.onBodyStartClick, me);
        
        if ( bodyEnd ) {
            me.mon(bodyEnd, 'click',    me.onBodyEndClick, me);
            me.mon(bodyEnd, 'dblclick', me.onBodyEndClick, me);
        };
            
        evEl.addKeyListener(Ext.EventObject.ENTER, me.onEnter,  me);
        evEl.addKeyListener(Ext.EventObject.ESC,   me.onEscape, me);
    },
    
    initCollections: function() {
        var me = this,
            bodyStart = me.bodyElStart,
            bodyEnd   = me.bodyElEnd;
        
        me.ampmStart    = bodyStart.select('.' + me.baseCls + '-ampm a');
        me.hoursStart   = bodyStart.select('.' + me.baseCls + '-hour a');
        me.minutesStart = bodyStart.select('.' + me.baseCls + '-minute a');
        
        if ( bodyEnd ) {
            me.ampmEnd    = bodyEnd.select('.' + me.baseCls + '-ampm a');
            me.hoursEnd   = bodyEnd.select('.' + me.baseCls + '-hour a');
            me.minutesEnd = bodyEnd.select('.' + me.baseCls + '-minute a');
        };
    },
    
    initButtons: function() {
        var me = this;

        me.okBtn     = me.initOkButton();
        me.cancelBtn = me.initCancelButton();
        me.clearBtn  = me.initClearButton();
    },
    
    initOkButton: function() {
        var me = this;

        return new Ext.button.Button({
            text:     me.okText,
            handler:  me.onOkClick,
            scope:    me
        });
    },
    
    initCancelButton: function() {
        var me = this;
        
        return new Ext.button.Button({
            text:     me.cancelText,
            handler:  me.onCancelClick,
            scope:    me
        });
    },
    
    initClearButton: function() {
        var me = this;
        
        return new Ext.button.Button({
            text:     me.clearText,
            handler:  me.onClearClick,
            scope:    me
        });
    },
    
    onBodyStartClick: function(e, t) {
        this.onBodyClick(e, t, 'start');
    },
    
    onBodyEndClick: function(e, t) {
        this.onBodyClick(e, t, 'end');
    },
    
    onBodyClick: function(e, t, which) {
        var me          = this,
            disabledCls = me.disabledCls;
        
        if ( new Ext.Element(t).hasCls(disabledCls) ) {
            return;
        };
        
        if ( e.getTarget('.' + me.baseCls + '-ampm') ) {
            e.stopEvent();
            me.onAmPmClick(t, which);
        }
        else if ( e.getTarget('.' + me.baseCls + '-hour') ) {
            e.stopEvent();
            me.onHourClick(t, which);
        }
        else if ( e.getTarget('.' + me.baseCls + '-minute') ) {
            e.stopEvent();
            me.onMinuteClick(t, which);
        };
    },
    
    onAmPmClick: function(t, which) {
        var me    = this,
            value = me.value,
            ampm, idx;
        
        ampm = which == 'start' ? me.ampmStart : me.ampmEnd;
        idx  = ampm.indexOf(t);
        
        me.setAmPm(which, idx);

        me.fireEvent('ampmclick', me, me.value);
        me.updateBody();
    },
    
    onHourClick: function(t, which) {
        var me         = this,
            value      = me.value,
            hourValues = me.hourValues,
            hours, idx;
        
        hours = which == 'start' ? me.hoursStart : me.hoursEnd;
        idx   = hours.indexOf(t);
        
        me.setHours(which, hourValues[idx]);
        
        me.fireEvent('hourclick', me, me.value);
        me.updateBody();
    },
    
    onMinuteClick: function(t, which) {
        var me           = this,
            value        = me.value,
            minuteValues = me.minuteValues,
            minutes, idx;
        
        minutes = which == 'start' ? me.minutesStart : me.minutesEnd;
        idx     = minutes.indexOf(t);
        
        me.setMinutes(which, minuteValues[idx]);
        
        me.fireEvent('minuteclick', me, me.value);
        me.updateBody();
    },
    
    clearValue: function() {
        var me = this;
        
        me.value = [ [ null, null, null ], [ null, null, null ] ];
        
        return me.value;
    },
    
    getValue: function(values) {
        var me = this;
    
        return me.multiValue ? me.value : me.getStartValue();
    },
    
    setValue: function(values) {
        var me = this;
        
        if ( me.multiValue ) {
            me.value = values;
        }
        else if ( Ext.isArray(values) ) {
            me.value = [ values[0], [ null, null, null ] ];
        }
        else {
            me.value = me.clearValue();
        };
        
        me.updateBody();
    },
    
    updateBody: function(){
        var me = this;

        if (me.rendered) {
            // Start selector
            me.updateBodySections({
                ampm:        me.ampmStart,
                hours:       me.hoursStart,
                minutes:     me.minutesStart,
                value:       me.getStartValue(),
                which:      'start'
            });
            
            // End selector
            if ( me.multiValue ) {
                me.updateBodySections({
                    ampm:        me.ampmEnd,
                    hours:       me.hoursEnd,
                    minutes:     me.minutesEnd,
                    value:       me.getEndValue(),
                    which:      'end'
                });
            };
        }
    },
    
    updateBodySections: function(p) {
        var me          = this,
            ampm        = p.ampm,
            hours       = p.hours,
            minutes     = p.minutes,
            value       = p.value,
            which       = p.which;
        
        me.updateAmPmSelection(ampm, value, which);
        me.updateHourSelection(hours, value, which);
        me.updateMinuteSelection(minutes, value, which);
    },
    
    updateAmPmSelection: function(section, value) {
        var me          = this,
            selectedCls = me.selectedCls,
            ampm        = value[0],
            item;
        
        section.removeCls(selectedCls);
        
        item = section.item(ampm);
        
        if ( item ) {
            item.addCls(selectedCls);
        };
    },
    
    updateHourSelection: function(section, value) {
        var me = this,
            selectedCls = me.selectedCls,
            disabledCls = me.disabledCls,
            hourValues  = me.hourValues,
            increment   = me.increment,
            mfloor      = Math.floor,
            ampm        = value[0],
            hours       = value[1],
            minutes     = value[2],
            minTime, maxTime, offset;
        
        offset  = 12 * ampm;
        minTime = mfloor(me.minTime / 3600) * 3600;
        maxTime = mfloor(me.maxTime / 3600) * 3600;
        
        section.removeCls(selectedCls);
        section.removeCls(disabledCls);
        
        section.each(function(el, all, index) {
            var hourValue = hourValues[index],
                seconds, disabled;
            
            seconds = (offset + index) * 3600;
            disabled = ampm === null    ? false
                     :                    seconds < minTime || seconds > maxTime
                     ;
            
            if ( disabled ) {
                el.dom.className = disabledCls;
            }
            else if ( hourValue === hours ) {
                el.dom.className = selectedCls;
                el.focus(50);
            };
        });
    },
    
    updateMinuteSelection: function(section, value, which) {
        var me = this,
            selectedCls  = me.selectedCls,
            disabledCls  = me.disabledCls,
            hourValues   = me.hourValues,
            minuteValues = me.minuteValues,
            disabledMin  = me.disabledMinutes,
            increment    = me.increment,
            minTime      = me.minTime,
            maxTime      = me.maxTime,
            contains     = Ext.Array.contains,
            indexOf      = Ext.Array.indexOf,
            ampm         = value[0],
            minutes      = value[2],
            hours, offset;
        
        offset = 12 * ampm;
        hours  = value[1] !== null ? indexOf(hourValues, value[1])
               :                     NaN
               ;
        
        section.removeCls(selectedCls);
        section.removeCls(disabledCls);
        
        section.each(function(el, all, index) {
            var minuteValue = minuteValues[index],
                seconds, disabled;
            
            seconds  = (offset + hours) * 3600 + (index * 15) * 60;
            disabled = contains(disabledMin, index) ? true
                     : ampm  === null               ? false
                     : which == 'start'             ? seconds < minTime
                     : which == 'end'               ? seconds > maxTime
                     :                                false
                     ;
            
            if ( disabled ) {
                el.dom.className = disabledCls;
            }
            else if ( minutes === minuteValue ) {
                el.dom.className = selectedCls;
                el.focus(50);
            };
        });
    },
    
    getStartValue: function() {
        var me    = this,
            value = me.value;
        
        return value[0];
    },
    
    getEndValue: function() {
        var me    = this,
            value = me.value;
        
        return value[1];
    },
    
    setAmPm: function(which, value) {
        this.value[which == 'start' ? 0 : 1][0] = value;
    },
    
    setHours: function(which, value) {
        this.value[which == 'start' ? 0 : 1][1] = value;
    },
    
    setMinutes: function(which, value) {
        this.value[which == 'start' ? 0 : 1][2] = value;
    },
    
    onEnter: function(key, e) {
        var me = this;

        e.stopEvent();              // Does it ever help?
        
        if ( !me.seenEnter ) {
            me.onOkClick();
            me.seenEnter = true;
        }
        else {
            me.seenEnter = false;   // It lives only twice
        };
    },
    
    onEscape: function(key, e) {
        var me = this;
        
        e.stopEvent();
        
        if ( !me.seenEscape ) {
            me.onCancelClick();
            me.seenEscape = true;
        }
        else {
            me.seenEscape = false;
        };
    },
    
    onOkClick: function() {
        var me = this;
        
        me.fireEvent('okclick', me, me.value);
        
        me.clearValue();
        me.updateBody();
    },
    
    onCancelClick: function() {
        var me = this;
        
        me.fireEvent('cancelclick', me);

        me.clearValue();
        me.updateBody();
    },
    
    onClearClick: function() {
        var me = this;

        me.fireEvent('clearclick', me);
        
        me.clearValue();
        me.updateBody();
    },

    beforeDestroy: function() {
        var me = this;
        
        if ( me.rendered ) {
            Ext.destroy(
                me.okBtn,
                me.cancelBtn,
                me.clearBtn
            );
        };

        Ext.destroyMembers('bodyEl', 'bodyElStart', 'bodyElEnd', 'eventEl', 'buttonsEl');
        
        me.callParent();
    }
});