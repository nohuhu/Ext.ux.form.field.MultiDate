/*
 * Picker for selecting a range of months.
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

Ext.define('Ext.ux.picker.MultiMonth', {
    extend: 'Ext.picker.Month',
    alias:  'widget.multimonthpicker',
    
    alternateClassName: [
        'Ext.picker.MultiMonth',
        'Ext.MultiMonthPicker'
    ],
    
    childEls: [
        'bodyEl', 'prevEl', 'nextEl', 'buttonsEl', 'monthEl', 'yearEl',
        'eventEl', 'bodyElEnd', 'prevElEnd', 'nextElEnd'
    ],

    renderTpl: [
        '<div class="{uxCls}-table">',
            '<div class="{uxCls}-header {uxCls}-table-row{ie}">',
                '<div class="{uxCls}-header-item{ie}">{startingMonthText}</div>',
                '<div class="{uxCls}-header-item{ie}">{endingMonthText}</div>',
            '</div>',
            '<div id="{id}-eventEl" class="{uxCls}-table-row{ie}">',
                '<div id="{id}-bodyEl" class="{baseCls}-body {uxCls}-table-cell{ie}">',
                  '<div class="{baseCls}-months">',
                      '<tpl for="months">',
                          '<div class="{parent.baseCls}-item {parent.baseCls}-month"><a href="#" hidefocus="on">{.}</a></div>',
                      '</tpl>',
                  '</div>',
                  '<div class="{baseCls}-years">',
                      '<div class="{baseCls}-yearnav">',
                          '<button id="{id}-prevEl" class="{baseCls}-yearnav-prev"></button>',
                          '<button id="{id}-nextEl" class="{baseCls}-yearnav-next"></button>',
                      '</div>',
                      '<tpl for="years">',
                          '<div class="{parent.baseCls}-item {parent.baseCls}-year"><a href="#" hidefocus="on">{.}</a></div>',
                      '</tpl>',
                  '</div>',
                  '<div class="' + Ext.baseCSSPrefix + 'clear"></div>',
                '</div>',
                '<div id="{id}-bodyElEnd" class="{baseCls}-body {uxCls}-table-cell{ie} {uxCls}-separator">',
                  '<div class="{baseCls}-months">',
                      '<tpl for="months">',
                          '<div class="{parent.baseCls}-item {parent.baseCls}-month"><a href="#" hidefocus="on">{.}</a></div>',
                      '</tpl>',
                  '</div>',
                  '<div class="{baseCls}-years">',
                      '<div class="{baseCls}-yearnav">',
                          '<button id="{id}-prevElEnd" class="{baseCls}-yearnav-prev"></button>',
                          '<button id="{id}-nextElEnd" class="{baseCls}-yearnav-next"></button>',
                      '</div>',
                      '<tpl for="years">',
                          '<div class="{parent.baseCls}-item {parent.baseCls}-year"><a href="#" hidefocus="on">{.}</a></div>',
                      '</tpl>',
                  '</div>',
                  '<div class="' + Ext.baseCSSPrefix + 'clear"></div>',
                '</div>',
            '</div>',
        '</div>',
        '<tpl if="showButtons">',
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
            '%}</div>',
        '</tpl>'
    ],
    
    /**
     * @cfg {String} startingMonthText Text to display for starting month header.
     */
    startingMonthText: 'Starting Month',
    
    /**
     * @cfg {String} endingMonthText Text to display for ending month header.
     */
    endingMonthText: 'Ending Month',
    
    /**
     * @cfg {String} clearText 'Clear' button text.
     */
    clearText: 'Clear',
    
    /**
     * @cfg {String} uxCls is additional class for this extension.
     */
    uxCls: 'ux-monthpicker',
    
    width: 356,
    
    initComponent: function() {
        var me = this;
        
        me.activeYearEnd = me.getYearEnd(new Date().getFullYear() - 4, -4);
        
        me.callParent();

        if ( me.showButtons ) {
            me.clearBtn = new Ext.button.Button({
                text:     me.clearText,
                handler:  me.onClearClick,
                scope:    me
            });
        };
    },
    
    initEvents: function() {
        var me = this,
            evEl = me.eventEl;
        
        me.callParent();

        evEl.addKeyListener(Ext.EventObject.ENTER, me.onOkClick,     me);
        evEl.addKeyListener(Ext.EventObject.ESC,   me.onCancelClick, me);
    },
    
    beforeRender: function() {
        var me = this,
            body;
        
        Ext.applyIf(me, {
            renderData: {}
        });
        
        Ext.apply(me.renderData, {
            uxCls:             me.uxCls,
            startingMonthText: me.startingMonthText,
            endingMonthText:   me.endingMonthText,
            ie:                Ext.isIE6 || Ext.isIE7 ? '-ie' : ''
        });
        
        me.callParent(arguments);
    },
    
    finishRenderChildren: function() {
        var me = this;
        
        me.callParent();
        
        if ( me.showButtons ) {
            me.clearBtn.finishRender();
        };
    },
    
    afterRender: function() {
        var me = this,
            body = me.bodyElEnd,
            buttonsEl = me.buttonsEl;
        
        me.mon(body, 'click',    me.onBodyClick, me);
        me.mon(body, 'dblclick', me.onBodyClick, me);
            
        me.yearsEnd  = body.select('.' + me.baseCls + '-year a');
        me.monthsEnd = body.select('.' + me.baseCls + '-month a');
        
        me.backRepeaterEnd = Ext.create('Ext.util.ClickRepeater', me.prevElEnd, {
            handler: Ext.Function.bind(me.adjustYearEnd, me, [-me.totalYears])
        });
        me.prevElEnd.addClsOnOver(me.baseCls + '-yearnav-prev-over');

        me.nextRepeaterEnd = Ext.create('Ext.util.ClickRepeater', me.nextElEnd, {
            handler: Ext.Function.bind(me.adjustYearEnd, me, [me.totalYears])
        });
        me.nextElEnd.addClsOnOver(me.baseCls + '-yearnav-next-over');
        
        me.callParent();
    },
    
    clearValues: function() {
        var me = this,
            now;
        
        now = Ext.Date.clearTime( new Date() );
        
        me.value = [
            [ now.getMonth(), now.getFullYear() ],
            [ now.getMonth(), now.getFullYear() ]
        ];
        me.activeYear = me.activeYearEnd = me.getYear(now.getFullYear() - 4, -4);

        me.updateBody();
        
        return me.value;
    },
    
    setValue: function(values) {
        var me = this,
            year, active;
        
        me.value = values || me.clearValues();
        
        year   = me.getYear(null);
        active = me.activeYear;
        if ( year !== null ) {
            if ( year < active || year > active + me.yearOffset ) {
                me.activeYear = year - me.yearOffset + 1;
            };
        };
        
        year   = me.getYearEnd(null);
        active = me.activeYearEnd;
        if ( year !== null ) {
            if ( year < active || year > active + me.yearOffset ) {
                me.activeYearEnd = year - me.yearOffset + 1;
            };
        };
        
        me.updateBody();
    },
    
    getYearsEnd: function(){
        var me = this,
            offset = me.yearOffset,
            start = me.activeYearEnd,
            end = start + offset,
            i = start,
            years = [];

        for (; i < end; ++i) {
            years.push(i, i + offset);
        }

        return years;
    },

    updateBody: function(){
        var me = this;

        if (me.rendered) {
            // Start selector
            me._updateBody({
                years: me.years,
                months: me.months,
                cls: me.selectedCls,
                yearNumbers: me.getYears(),
                value: me.getYear(null),
                month: me.getMonth('start')
            });
            
            // End selector
            me._updateBody({
                years: me.yearsEnd,
                months: me.monthsEnd,
                cls: me.selectedCls,
                yearNumbers: me.getYearsEnd(),
                value: me.getYearEnd(null),
                month: me.getMonth('end')
            });
        }
    },
    
    _updateBody: function(p) {
        var me = this,
            years = p.years,
            months = p.months,
            cls = p.cls,
            yearNumbers = p.yearNumbers,
            monthOffset = me.monthOffset,
            value = p.value,
            month = p.month;
        
        years.removeCls(cls);
        months.removeCls(cls);
        years.each(function(el, all, index){
            var year = yearNumbers[index];
            el.dom.innerHTML = year;
            if (year == value) {
                el.dom.className = cls;
                el.focus(50);
            }
        });
        if (month !== null) {
            if (month < monthOffset) {
                month = month * 2;
            } else {
                month = (month - monthOffset) * 2 + 1;
            }
            months.item(month).addCls(cls);
        }
    },
    
    getMonth: function(which) {
        var me = this,
            month;
        
        try       { month = which == 'start' ? me.value[0][0] : me.value[1][0] }
        catch (e) { month = null };
        
        return month;
    },
    
    setMonth: function(which, value) {
        var me = this;
        
        which == 'start' ? me.value[0][0] = value : me.value[1][0] = value;
    },

    getYear: function(defaultValue, offset) {
        var me = this,
            year;
        
        try { year = me.value[0][1]; } catch (e) { year = null; };
        
        offset = offset || 0;
        
        return year === null ? defaultValue : year + offset;
    },

    getYearEnd: function(defaultValue, offset) {
        var me = this,
            year;

        try { year = me.value[1][1]; } catch (e) { year = null; };
            
        offset = offset || 0;
        
        return year === null ? defaultValue : year + offset;
    },
    
    setYear: function(which, value) {
        var me = this;
        
        which == 'start' ? me.value[0][1] = value : me.value[1][1] = value;
    },
    
    adjustYearEnd: function(offset){
        var me = this;
        
        if ( Ext.typeOf(offset) != 'number' ) {
            offset = me.totalYears;
        };
        
        me.activeYearEnd += offset;
        me.updateBody();
    },
    
    onMonthClick: function(target) {
        var me = this,
            idx, value,
            which = 'start';
        
        idx = me.months.indexOf(target);
        
        if ( idx === -1 ) {
            idx = me.monthsEnd.indexOf(target);
            which = 'end';
        };
        
        value = me.resolveOffset(idx, me.monthOffset);
        
        me.setMonth(which, value);
        
        me.updateBody();
        
        me.fireEvent('monthclick', me, me.value);
        me.fireEvent('select',     me, me.value);
    },
    
    onYearClick: function(target) {
        var me = this,
            idx, value,
            which = 'start';
        
        idx = me.years.indexOf(target);
        
        if ( idx === -1 ) {
            idx = me.yearsEnd.indexOf(target);
            which = 'end';
        };
        
        value = (which == 'start' ? me.activeYear : me.activeYearEnd) +
                me.resolveOffset(idx, me.yearOffset);
        
        me.setYear(which, value);
        
        me.updateBody();
        
        me.fireEvent('yearclick', me, me.value);
        me.fireEvent('select',    me, me.value);
    },
    
    onOkClick: function() {
        this.callParent();
        this.clearValues();
    },
    
    onCancelClick: function() {
        this.callParent();
        this.clearValues();
    },
    
    onClearClick: function() {
        this.clearValues();
    },

    beforeDestroy: function() {
        var me = this;
        
        if ( me.rendered ) {
            Ext.destroy( me.clearBtn );
        };

        me.yearsEnd = me.monthsEnd = null;
        
        Ext.destroyMembers('backRepeaterEnd', 'nextRepeaterEnd', 'eventEl',
                           'prevElEnd', 'nextElEnd', 'clearBtn');
        
        me.callParent();
    }
});
