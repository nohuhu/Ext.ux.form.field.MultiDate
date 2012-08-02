/*
 * Date picker with support for multiple selections.
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

Ext.define('Ext.ux.picker.MultiDate', {
    extend: 'Ext.picker.Date',
    alias:  'widget.multidatepicker',
    
    alternateClassName: [ 'Ext.picker.MultiDate', 'Ext.MultiDatePicker' ],
    
    renderTpl: [
        '<div class="{cls}" id="{id}-innerEl" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" title="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl">{%this.renderMonthBtn(values, out)%}</div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" title="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="u{baseCls}-inner" cellspacing="0" role="presentation">',
                '<thead role="presentation"><tr role="presentation">',
                    '<tpl for="dayNames">',
                        '<th role="columnheader" title="{.}"><span>{.:this.firstInitial}</span></th>',
                    '</tpl>',
                '</tr></thead>',
                '<tbody role="presentation"><tr role="presentation">',
                    '<tpl for="days">',
                        '{#:this.isEndOfWeek}',
                        '<td role="gridcell" id="{[Ext.id()]}">',
                            '<a role="presentation" href="#" hidefocus="on" class="{parent.baseCls}-date" tabIndex="1">',
                                '<em role="presentation"><span role="presentation"></span></em>',
                            '</a>',
                        '</td>',
                    '</tpl>',
                '</tr></tbody>',
            '</table>',
            '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer">',
                '<tpl if="this.showToday">',
                    '{%this.renderTodayBtn(values, out)%}',
                '<tpl else>',
                    '{%this.renderOkBtn(values, out)%}',
                    '{%this.renderCancelBtn(values, out)%}',
                    '{%this.renderClearBtn(values, out)%}',
                '</tpl>',
            '</div>',
        '</div>',
        {
            firstInitial: function(value) {
                return Ext.picker.Date.prototype.getDayInitial(value);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            renderTodayBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.todayBtn.getRenderTree(), out);
            },
            renderOkBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.okBtn.getRenderTree(), out);
            },
            renderCancelBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.cancelBtn.getRenderTree(), out);
            },
            renderClearBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.clearBtn.getRenderTree(), out);
            },
            renderMonthBtn: function(values, out) {
                Ext.DomHelper.generateMarkup(values.$comp.monthBtn.getRenderTree(), out);
            }
        }
    ],
    
    nextText:      Ext.isMac ? 'Next Month (&#x2318;&#x2192;)' : 'Next Month (Control+Right)',
    prevText:      Ext.isMac ? 'Previous Month (&#x2318&#x2190;)' : 'Previous Month (Control+Left)',
    monthYearText: Ext.isMac ? 'Choose a month (&#x2318 + &#x2191;/&#x2193; to move years)' : 'Choose a month (Control+Up/Down to move years)',
    
    /**
     * @cfg {String} okText OK button text.
     */
    okText:        'OK',
    
    /**
     * @cfg {String} okTooltip OK button tooltip text.
     */
    okTooltip:     Ext.isMac ? 'Confirm selection (⏎)' : 'Confirm selection (Enter)',
    
    /**
     * @cfg {String} cancelText Cancel button text.
     */
    cancelText:    'Cancel',
    
    /**
     * @cfg {String} cancelTooltip Cancel button tooltip text.
     */
    cancelTooltip: Ext.isMac ? 'Cancel selection (⎋)' : 'Cancel selection (Escape)',
    
    /**
     * @cfg {String} clearText 'Clear selection' button text.
     */
    clearText:     'Clear',
    
    /**
     * @cfg {String} clearTooltip 'Clear selection' button tooltip text.
     */
    clearTooltip:  Ext.isMac ? 'Clear selection (⌘⌫)' : 'Clear selection (Ctrl+Backspace)',
    
    /**
     * @cfg {Int[]/Boolean} workDays Array of 0-based week day numbers that represent
     * work week for given locale. Defaults to Monday-Friday. Set to 'false' to turn
     * this feature off.
     */
    workDays: [ 1, 2, 3, 4, 5 ],
    
    showToday: false,
    
    initComponent: function() {
        var me = this,
            wd = me.workDays;
        
        me.callParent(arguments);
        
        // Active cell class is different
        me.activeCls = 'ux-datepicker-active';
        
        me.selDates = [];
        
        if ( wd && Ext.isArray(wd) ) {
            var hash = {
                0: false, 1: false, 2: false, 3: false, 4: false, 5: false, 6: false
            };
            
            for ( var i = 0, l = wd.length; i < l; i++ ) {
                hash[ wd[i] ] = true;
            };
            
            me.workDaysHash = hash;
        }
        else {
            me.workDaysHash = {
                0: true, 1: true, 2: true, 3: true, 4: true, 5: true, 6: true
            };
        };
    },
    
    beforeRender: function() {
        var me = this;
        
        me.callParent(arguments);
        
        if ( !me.showToday ) {
            Ext.destroy(me.todayBtn);

            var layout = me.getComponentLayout();
        
            me.okBtn = new Ext.button.Button({
                ownerCt:     me,
                ownerLayout: layout,
                text:        me.okText,
                tooltip:     me.okTooltip,
                handler:     me.onOkButton,
                scope:       me
            });
            
            me.cancelBtn = new Ext.button.Button({
                ownerCt:     me,
                ownerLayout: layout,
                text:        me.cancelText,
                tooltip:     me.cancelTooltip,
                handler:     me.onCancelButton,
                scope:       me
            });
            
            me.clearBtn = new Ext.button.Button({
                ownerCt:     me,
                ownerLayout: layout,
                text:        me.clearText,
                tooltip:     me.clearTooltip,
                handler:     me.clearSelection,
                scope:       me
            });
        };
    },
    
    finishRenderChildren: function() {
        var me = this;
        
        me.callParent();
        
        if ( !me.showToday ) {
            me.okBtn.finishRender();
            me.cancelBtn.finishRender();
            me.clearBtn.finishRender();
        };
    },
    
    initEvents: function() {
        var me = this,
            evEl = me.eventEl;
        
        me.callParent(arguments);
        
        // Override default key handlers
        evEl.addKeyListener(Ext.EventObject.ENTER, me.onOkButton,     me);
        evEl.addKeyListener(Ext.EventObject.ESC,   me.onCancelButton, me);
        evEl.addKeyListener(Ext.EventObject.SPACE, me.handleSpacebar, me);
        evEl.addKeyListener({ key: Ext.EventObject.BACKSPACE, ctrl: true }, me.clearSelection, me);
    },
    
    /**
     * @private Assigns values and refreshes the picker.
     */
    setValue: function(values) {
        var me = this;
        
        function getClearTime(d) { return Ext.Date.clearTime(d).getTime() };
        
        me.selDates = Ext.isArray(values) ? Ext.Array.map(values, getClearTime)
                    :                      [ getClearTime(values) ]
                    ;
        
        me.update(me.selDates);
    },
    
    /**
     * @private Returns current selection range.
     */
    getValue: function() {
        var me = this;
        
        return Ext.Array.map(me.selDates, function(t) { return new Date(t) });
    },
    
    onOkButton: function() {
        var me = this,
            handler = me.handler;
        
        if ( !me.disabled ) {
            var value = me.getValue();
            
            me.fireEvent('select', me, value);
        
            if ( handler ) {
                handler.call(me.scope || me, me, value);
            };
            
            me.onSelect();
            me.clearSelection();
        };
    },
    
    onCancelButton: function() {
        var me = this;
        
        me.clearSelection();
        me.pickerField.collapse();
    },
    
    clearSelection: function() {
        var me = this,
            cells = me.cells,
            aCls = me.activeCls,
            sCls = me.selectedCls;
        
        // Clear the selection
        me.selDates = [];
        me.rangeSelection = false;
        cells.removeCls(aCls);
        cells.removeCls(sCls);
        
        me.update(Ext.Date.clearTime( new Date() ));
    },

    handleDateClick : function(event, target) {
        var me = this,
            selDates = me.selDates,
            el, dv, dt;

        event.stopEvent();
        
        el = Ext.fly(target.parentElement);
        dv = target.dateValue;
        
        if ( event.shiftKey && !event.ctrlKey ) {           // Select work week
            dt = me.toggleWeekSelection(el);
        }
        else if ( event.ctrlKey ) {        // Select range or work range (no toggling)
            if ( !me.rangeSelection ) {    // Start selection
                me.rangeSelection = dv;
                dt = me.toggleDateSelection(el, true, dv);
            }
            else {          // End selection
               dt = me.selectRange(me.rangeSelection, dv, event.shiftKey);
               me.rangeSelection = false;
            };
        }
        else {                                      // Select single day
            dt = me.toggleDateSelection(el, undefined, dv);
        };
        
        if ( dt ) {
            me.update(selDates);
        };
        
        // Set active date, too
        me.update( new Date(dv) );
    },

    handleSpacebar: function(keycode, event) {
        var me       = this,
            selDates = me.selDates,
            cells    = me.cells,
            activeDate, activeCell, activeIdx, dt;
        
        activeDate = me.activeDate.getTime();
        activeIdx  = me.getCellIndex(activeDate);
        
        if ( activeIdx == -1 ) {
            return;
        };
        
        activeCell = cells.item(activeIdx);
        
        dt = event.shiftKey ? me.toggleWeekSelection(activeCell, activeIdx)
           :                  me.toggleDateSelection(activeCell, undefined, activeDate)
           ;
        
        if ( dt ) {
            me.update(selDates);
        };
    },
    
    /**
     * @private Returns cell index by date value.
     */
    getCellIndex: function(value) {
        var me = this,
            cells = me.cells,
            index;
            
        // This is suboptimal but I don't know a way to do it otherwise
        // without affecting me.cells.
        cells.each(function(el, c, idx) {
            if ( !index && el.down('a').getAttribute('dateValue') === value ) {
                index = idx;
            };
        });
        
        return index === undefined ? -1 : index;
    },
    
    selectRange: function(start, end, workWeek) {
        var me       = this,
            selDates = me.selDates,
            wdHash   = me.workDaysHash,
            add      = Ext.Date.add,
            DAY      = Ext.Date.DAY,
            contains = Ext.Array.contains,
            include  = Ext.Array.include,
            tmp, dt, dv;
        
        // JS is ugly.
        if ( start > end ) {
            tmp   = start;
            start = end;
            end   = tmp;
        };
        
        // If start date falls on a weekend we shouldn't allow it
        // to be selected
        Ext.Array.remove( selDates, new Date(start).getTime() );
        
        DATE:
        for ( dt = new Date(start), dv = dt.getTime();
              dv <= end;
              dt = add(dt, DAY, 1), dv = dt.getTime() )
        {
            if ( workWeek && !wdHash[ dt.getDay() ] ) {
                continue DATE;
            };
            
            include(selDates, dv);
        };
        
        return true;
    },
    
    toggleWeekSelection: function(el, index) {
        var me          = this,
            cells       = me.cells,
            selectedCls = me.selectedCls,
            disabledCls = me.disabledCellCls,
            workDays    = me.workDays,
            selected, dayNo, firstDay;
        
        if ( index === undefined ) {
            index = me.getCellIndex( el.down('a').getAttribute('dateValue') );
        };
        
        if ( !me.disabled && !el.hasCls(disabledCls) ) {
            selected = el.hasCls(selectedCls);
            dayNo    = index % 7;
            firstDay = index - dayNo;
            
            // We're toggling only work week. If there's a need to toggle
            // whole week, adjust workDays to have values [0..6].
            if ( Ext.Array.contains(workDays, dayNo) ) {
                var i = firstDay + workDays[0],
                    l = firstDay + workDays[ workDays.length - 1 ];
                    
                for (; i <= l; i++ ) {
                    me.toggleDateSelection( cells.item(i), !selected );
                };
            };
        };
        
        return true;
    },
    
    toggleDateSelection: function(el, state, dv) {
        var me = this,
            selDates = me.selDates,
            selectedCls = me.selectedCls,
            disabledCls = me.disabledCellCls,
            selected, dv;
        
        if ( dv === undefined ) {
            dv = el.down('a').getAttribute('dateValue');
        };
        
        if ( !me.disabled && !el.hasCls(disabledCls) && dv ) {
            selected = state !== undefined ? !state : el.hasCls(selectedCls);
            
            if ( selected ) {
                Ext.Array.remove(selDates, dv);
            }
            else {
                Ext.Array.include(selDates, dv);
            };
            
            return el;
        };
        
        return undefined;
    },
    
    selectedUpdate: function(dates, active) {
        var me          = this,
            cells       = me.cells,
            selectedCls = me.selectedCls,
            activeCls   = me.activeCls,
            visible, cancelFocus;
        
        visible     = me.isVisible();
        cancelFocus = !me.focusOnSelect;
        
        cells.each( function(el) {
            var picker = this,
                dv;
            
            el.removeCls([activeCls, selectedCls]);
            
            dv = el.down('a').getAttribute('dateValue');
            
            if ( dv === active ) {
                picker.getEl().set({ 'aria-activedescendant': el.id });
                
                el.addCls(activeCls);
                
                if ( visible && !cancelFocus ) {
                    Ext.fly( el.down('a') ).focus(50);
                };
            };
            
            if ( Ext.Array.contains(dates, dv) ) {
                el.addCls(selectedCls);
            };
        }, me);
    },
    
    update: function(dates, forceRefresh) {
        var me = this,
            selDates,
            active = me.activeDate,
            newActive;
        
        if ( Ext.isArray(dates) ) {
            me.selDates = dates;
        };
        
        selDates = me.selDates || [];
        
        newActive = Ext.isDate(dates)       ? dates
                  :                           active
                  ;
        
        if ( me.rendered ) {
            var am = active    && active.getMonth(),
                ay = active    && active.getFullYear(),
                nm = newActive && newActive.getMonth(),
                ny = newActive && newActive.getFullYear();
                
            me.activeDate = newActive;

            if ( !forceRefresh && am == nm && ay == ny ) {
                me.selectedUpdate(selDates, newActive.getTime());
            }
            else {
                me.fullUpdate(newActive, active);
                me.selectedUpdate(selDates, newActive.getTime());
            };
        };
        
        return me;
    },
    
    beforeDestroy: function() {
        var me = this;
        
        if ( me.rendered ) {
            Ext.destroy(
                me.okBtn,
                me.cancelBtn,
                me.clearBtn
            );
            
            delete me.selDates;
        };
        
        me.callParent(arguments);
    }
});