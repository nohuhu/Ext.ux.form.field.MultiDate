/*
    Input field that allows selecting either single month or a range of months.
    Range is selected as start and end months, inclusive.

    Version 0.92

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

Ext.define('Ext.ux.form.field.MultiMonth', {
    extend: 'Ext.ux.form.field.MultiDate',
    alias:  'widget.multimonthfield',
    
    alternateClassName: [
        'Ext.form.field.MultiMonth',
        'Ext.form.MultiMonthField',
        'Ext.form.MultiMonth'
    ],
    
    requires: [
        'Ext.picker.Month',
        'Ext.ux.picker.MultiMonth'
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

    valueSeparatorRE: /^$/,
    
    format: 'm/Y',
    altFormats: 'm/y|n/Y|n/y|m|n',
    
    createPicker: function() {
        var me = this,
            format = Ext.String.format;
        
        if ( me.multiValue ) {
            return Ext.create('Ext.picker.MultiMonth', {
                pickerField: me,
                ownerCt: me.ownerCt,
                renderTo: document.body,
                floating: true,
                hidden: true,
                small: false,
                focusOnShow: true,
                minDate: me.minValue,
                maxDate: me.maxValue,
                format: me.format,
                startingMonthText: me.startingMonthText,
                endingMonthText: me.endingMonthText,
                clearText: me.clearText,
                minText: format(me.minText, me.formatDate(me.minValue)),
                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                listeners: {
                    scope: me,
                    cancelclick: me.onCancelClick,
                    okclick: me.onOkClick,
                },
                keyNavConfig: {
                    esc: function() {
                        me.collapse();
                    }
                }
            });
        }
        else {
            return Ext.create('Ext.picker.Month', {
                pickerField: me,
                ownerCt: me.ownerCt,
                renderTo: document.body,
                floating: true,
                hidden: true,
                small: false,
                focusOnShow: true,
                minDate: me.minValue,
                maxDate: me.maxValue,
                format: me.format,
                minText: format(me.minText, me.formatDate(me.minValue)),
                maxText: format(me.maxText, me.formatDate(me.maxValue)),
                listeners: {
                    scope: me,
                    cancelclick: me.onCancelClick,
                    okclick: me.onOkClick,
                    yeardblclick: me.onOkClick,
                    monthdblclick: me.onOkClick
                },
                keyNavConfig: {
                    esc: function() {
                        me.collapse();
                    }
                }
            });
        };
    },
    
    getErrors: function(values) {
        var me = this,
            multi = me.multiValue,
            rsep = me.rangeSeparatorRE,
            format = Ext.String.format,
            errors, range;
        
        errors = me.callParent(arguments) || [];
        
        if ( multi && values !== '' ) {      // Blank values are checked in ancestor class
            range = me.splitValues(values, rsep);
            
            if ( range.length < 2 ) {
                errors.push( format(me.invalidRangeText, values) );
            };
        };
        
        return errors;
    },
    
    onCancelClick: function() {
        var me = this;
        
        me.collapse();
    },
    
    onOkClick: function() {
        var me = this,
            picker = me.picker,
            values, text;
        
        if ( me.multiValue ) {
            values = Ext.Array.map(picker.getValue(), me.formatPickerValue, me);
            text = me.formatDisplay(values);
        }
        else {
            values = me.formatPickerValue( picker.getValue() );
            text = me.formatDisplayValue( values );
        };
        
        me.setRawValue(text);
        
        me.fireEvent('select', me, text);
        me.collapse();
        
        me.validate();
    },
    
    formatPickerValue: function(value) {
        var me = this,
            dt;

        dt = Ext.Date.parse( value[1] + '-' + (value[0] + 1) + '-1', 'Y-n-j' );
        
        return Ext.Date.format(dt, me.format);
    },
    
    formatSubmitValue: function(value) {
        var me = this,
            fmt = me.submitFormat || me.format,
            dt, res;
        
        try {
            dt = Ext.Date.clearTime( me.parseDate(value) );
            dt.setDate(1);
            res = Ext.Date.format(dt, fmt);
        } catch (e) {};
        
        return Ext.isString(res) ? res : '';
    },
    
    formatDisplayValue: function(value) {
        var me = this,
            fmt = me.format,
            text, dt, res;
        
        try {
            dt   = Ext.Date.clearTime( me.parseDate(value) );
            res  = Ext.Date.format(dt, fmt);
        }
        catch (e) {};
        
        return Ext.isString(res) ? res : value;
    },
    
    formatDisplay: function(values, rsep, vsep) {
        var me = this,
            start, end;
        
        if ( !me.multiValue ) {
            return values;          // Should be a string
        };
        
        start = me.formatDisplayValue( values[0] );
        end   = me.formatDisplayValue( values[1] );
        
        return start && end ? start + (rsep || me.displayRangeSeparator) + end
             :                ''
             ;
    },
    
    expandValues: function(text) {
        var me = this,
            rsep = me.rangeSeparatorRE,
            fmt = me.format,
            values, result;
        
        if ( text === '' || text === null ) {
            var now = new Date();
            
            return [
                [ now.getMonth(), now.getFullYear() ], 
                [ now.getMonth(), now.getFullYear() ]
            ];
        };
        
        values = me.splitValues(text, rsep);
        result = Ext.Array.map(values, function(value) {
                    var dt = me.parseDate(value, fmt);
                    return [ dt.getMonth(), dt.getFullYear() ];
                 }, me);
        
        return result;
    }
});