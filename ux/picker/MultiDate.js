/*
    Date picker with support for multiple selections

    Version 0.9

    Copyright (C) 2011 Alexander Tokarev.
    
    Usage: not intended to be used directly
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

Ext.define('Ext.ux.picker.MultiDate', {
    extend: 'Ext.picker.Date',
    alias:  'widget.multidatepicker',
    
    alternateClassName: [ 'Ext.picker.MultiDate', 'Ext.MultiDatePicker' ],
    
    renderTpl: [
        '<div class="{cls}" id="{id}" role="grid">',
            '<div role="presentation" class="{baseCls}-header">',
                '<div class="{baseCls}-prev"><a id="{id}-prevEl" href="#" role="button" data-qtip="{prevText}"></a></div>',
                '<div class="{baseCls}-month" id="{id}-middleBtnEl"></div>',
                '<div class="{baseCls}-next"><a id="{id}-nextEl" href="#" role="button" data-qtip="{nextText}"></a></div>',
            '</div>',
            '<table id="{id}-eventEl" class="u{baseCls}-inner" cellspacing="0" role="presentation" title="{ariaTitle} {value:this.longDay}">',
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
            '<div id="{id}-footerEl" role="presentation" class="{baseCls}-footer"></div>',
        '</div>',
        {
            firstInitial: function(value) {
                return value.substr(0,1);
            },
            isEndOfWeek: function(value) {
                // convert from 1 based index to 0 based
                // by decrementing value once.
                value--;
                var end = value % 7 === 0 && value !== 0;
                return end ? '</tr><tr role="row">' : '';
            },
            longDay: function(value){
                return Ext.Date.format(value, this.longDayFormat);
            }
        }
    ],
    
    nextText:      Ext.isMac ? 'Next Month (&#x2318;&#x2192;)'    : 'Next Month (Control+Right)',
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
     * @cfg {Int[]} workDays Array of 0-based week day numbers that represent work week
     * for given locale. Defaults to Monday-Friday.
     */
    workDays: [ 1, 2, 3, 4, 5 ],
    
    showToday: false,
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
        
        // Active cell class is different
        me.activeCls = 'ux-datepicker-active';
        
        me.selDates = [];
    },
    
    onRender: function(container, position) {
        var me = this;
        
        me.callParent(arguments);
        
        Ext.destroy(me.todayBtn);
        
        me.okBtn = Ext.create('Ext.button.Button', {
            renderTo: me.footerEl,
            text:     me.okText,
            tooltip:  me.okTooltip,
            handler:  me.onOkButton,
            scope:    me
        });
        
        me.cancelBtn = Ext.create('Ext.button.Button', {
            renderTo: me.footerEl,
            text:     me.cancelText,
            tooltip:  me.cancelTooltip,
            handler:  me.onCancelButton,
            scope:    me
        });
        
        me.clearBtn = Ext.create('Ext.button.Button', {
            renderTo: me.footerEl,
            text:     me.clearText,
            tooltip:  me.clearTooltip,
            handler:  me.clearSelection,
            scope:    me
        });
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
                    :                      [ getClearTime(values) ];
        
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

    handleDateClick : function(e, t) {
        var me = this,
            selDates = me.selDates,
            rs = me.rangeSelection,
            dt;

        e.stopEvent();
        
        if ( e.shiftKey && !e.ctrlKey ) {           // Select work week
            dt = me.toggleWeekSelection(t);
        }
        else if ( e.ctrlKey ) {                     // Select range or work range (no toggling)
            if ( !rs ) {    // Start selection
                me.rangeSelection = t.dateValue;
                dt = me.toggleDateSelection(t, true);
            }
            else {          // End selection
               dt = me.selectRange(rs, t.dateValue, e.shiftKey);
               me.rangeSelection = false;
            };
        }
        else {                                      // Select single day
            dt = me.toggleDateSelection(t);
        };
        
        if ( dt ) {
            me.update(selDates);
        };
    },

    handleSpacebar: function(keycode, e) {
        var me = this,
            selDates = me.selDates,
            cells = me.cells,
            acls = me.activeCls,
            active = me.activeDate.getTime(),
            activeCell, activeIdx, dt;
        
        activeIdx = me.getCellIndex(active);
        
        if ( activeIdx === undefined ) {
            return;
        };
        
        activeCell = cells.item(activeIdx);
        
        if ( e.shiftKey ) {
            dt = me.toggleWeekSelection(activeCell.dom.firstChild, activeIdx);
        }
        else {
            dt = me.toggleDateSelection(activeCell.dom.firstChild);
        };
        
        if ( dt ) {
            activeCell.addCls(acls);
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
        cells.filter(function(c, idx) {
            if ( c.dom.firstChild.dateValue === value ) {
                index = idx;
            };
        });
        
        return index;
    },
    
    selectRange: function(start, end, workWeek) {
        var me = this,
            workDays = me.workDays,
            selDates = me.selDates,
            tmp;
        
        // JS is ugly.
        if ( start > end ) {
            tmp = start;
            start = end;
            end = tmp;
        };
        
        DATE:
        for ( var dt = new Date(start); dt.getTime() <= end; dt = Ext.Date.add(dt, Ext.Date.DAY, 1) ) {
            if ( workWeek && !Ext.Array.contains(workDays, dt.getDay()) ) {
                continue DATE;
            };
            
            Ext.Array.include(selDates, dt.getTime());
        };
        
        return true;
    },
    
    toggleWeekSelection: function(c, index) {
        var me = this,
            cells = me.cells,
            dCls = me.disabledCellCls,
            workDays = me.workDays,
            selected, dayNo, firstDay;
        
        if ( index === undefined ) {
            index = me.getCellIndex(c.dateValue);
        };
        
        if ( !me.disabled && !Ext.fly(c.parentNode).hasCls(dCls) ) {
            selected = me.getDaySelection(c);
            dayNo    = index % 7;
            firstDay = index - dayNo;
            
            // We're toggling only work week. If there's a need to toggle
            // whole week, adjust workDays to have values [0..6].
            if ( Ext.Array.contains(workDays, dayNo) ) {
                var i = firstDay + workDays[0],
                    l = firstDay + workDays[ workDays.length - 1 ];
                    
                for (; i <= l; i++ ) {
                    var cell = cells.item(i);
                    me.toggleDateSelection(cell.dom.firstChild, !selected);
                };
            };
        };
        
        return true;
    },
    
    getDaySelection: function(c) {
        var me = this,
            sCls = me.selectedCls,
            dCls = me.disabledCellCls,
            parent = Ext.fly(c.parentNode);
        
        return parent.hasCls(sCls);
    },
    
    toggleDateSelection: function(c, state) {
        var me = this,
            selDates = me.selDates,
            sCls = me.selectedCls,
            dCls = me.disabledCellCls,
            parent = Ext.fly(c.parentNode),
            selected, fn;
        
        if ( !me.disabled && c.dateValue && !parent.hasCls(dCls) ) {
            selected = state !== undefined ? !state : parent.hasCls(sCls);
            
            (selected ? Ext.Array.remove : Ext.Array.include)(selDates, c.dateValue);
            
            return c;
        };
        
        return undefined;
    },
    
    selectedUpdate: function(dates, active) {
        var me = this,
            cells = me.cells,
            sCls = me.selectedCls,
            aCls = me.activeCls,
            visible, cancelFocus;
        
        visible     = me.isVisible();
        cancelFocus = !me.focusOnSelect;
        
        cells.removeCls(sCls);
        cells.removeCls(aCls);
        
        cells.each( function(c) {
            var dv = c.dom.firstChild.dateValue;
            
            if ( dv === active ) {
                this.el.dom.setAttribute('aria-activedescendent', c.dom.id);
                
                c.addCls(aCls);
                
                if ( visible && !cancelFocus ) {
                    Ext.fly(c.dom.firstChild).focus(50);
                };
            };
            
            if ( Ext.Array.contains(dates, dv) ) {
                c.addCls(sCls);
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