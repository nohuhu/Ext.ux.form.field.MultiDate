/*
 * Input field that allows time range to be entered.
 *
 * Version 0.99, compatible with Ext JS 4.1.
 *  
 * Copyright (c) 2011-2012 Alexander Tokarev.
 *  
 * Usage: see demo application.
 *
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.form.field.MultiTime', {
    extend: 'Ext.ux.form.field.MultiMonth',
    alias:  'widget.multitimefield',
    
    alternateClassName: [
        'Ext.form.field.MultiTime',
        'Ext.form.MultiTimeField',
        'Ext.form.MultiTime'
    ],
    
    requires: [ 'Ext.ux.picker.MultiTime' ],
    
    /**
     * @cfg {String} minText Error text to display if minValue validation fails.
     */
    minText: '{0} is less than minimum time',
    
    /**
     * @cfg {String} maxText Error text to display if maxValue validation fails.
     */
    maxText: '{0} is more than maximum time',
    
	/**
	 * @cfg {String} invalidRangeText
	 * Error text to display when an invalid date range is entered.
	 */
	invalidRangeText: '{0} is not a valid time range',
	
	/**
	 * @cfg {String} invalidRangeEndsText
	 * Error text to display when range end is less than range start.
	 */
	invalidRangeEndsText: '{0} is invalid: start time must be less than end time',
	
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
     * @cfg {String} format
     * The default time format string which can be overriden for localization support. The format must be valid
     * according to {@link Ext.Date#parse} (defaults to 'g:i A', e.g., '3:15 PM'). For 24-hour time format try 'H:i'
     * instead.
     */
    format : "g:i A",

    /**
     * @cfg {String} submitFormat
     * The date format string which will be submitted to the server. The format must be valid according to {@link
     * Ext.Date#parse} (defaults to {@link #format}).
     */
    submitFormat: 'H:i',

    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format.
     */
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A",

    /**
     * @cfg {Number} increment
     * The number of minutes between each time value in the list.
     * Supported values are 15, 30 or 60 minutes.
     */
    increment: 15,
    
    /**
     * @cfg {String} invalidIncrementText Text to display when time entered does not match increment.
     */
    invalidIncrementText: 'Time should be entered in {0} minutes increments',
    
    triggerCls: 'ux-form-time-trigger',

    valueSeparatorRE: /^$/,
    
    submitRangeSeparator: '/',
    
    createPicker: function() {
        var me = this;
        
        return Ext.create('Ext.ux.picker.MultiTime', {
            pickerField:      me,
            ownerCt:          me.ownerCt,
            renderTo:         document.body,
            floating:         true,
            hidden:           true,
            focusOnShow:      true,
            minTime:          me.getMinTime(),
            maxTime:          me.getMaxTime(),
            multiValue:       me.multiValue,
            startingTimeText: me.startingTimeText,
            endingTimeText:   me.endingTimeText,
            amText:           me.amText,
            pmText:           me.pmText,
            hoursText:        me.hoursText,
            minutesText:      me.minutesText,
            okText:           me.okText,
            cancelText:       me.cancelText,
            clearText:        me.clearText,
            hourValues:       me.hourValues,
            minuteValues:     me.minuteValues,
            increment:        me.increment,
            listeners: {
                scope:        me,
                okclick:      me.onOkClick,
                cancelclick:  me.onCancelClick
            },
            keyNavConfig: {
                esc: function() {
                    me.collapse();
                }
            }
        });
    },
    
    onExpand: function() {
        var me = this,
            text, values;
        
        if ( me.multiValue ) {
            return me.callParent();
        };
        
        text = me.getRawValue();
        
        if ( me.isValid() ) {
            values = me.expandValues(text);
            me.picker.setValue(values);
        }
        else if ( text === '' ) {
            me.clearInvalid();
        };
    },
    
    getMinTime: function() {
        var me = this,
            dt;
        
        try { dt = new Date(me.minValue) } catch (e) {};
        
        return Ext.isDate(dt) && !isNaN( dt.getTime() ) ? dt.getHours()   * 3600 + 
                                                          dt.getMinutes() * 60
             :                                            -Infinity;
    },
    
    getMaxTime: function() {
        var me = this,
            dt;

        try { dt = new Date(me.maxValue) } catch (e) {};
        
        return Ext.isDate(dt) && !isNaN( dt.getTime() ) ? dt.getHours()   * 3600 + 
                                                          dt.getMinutes() * 60
             :                                            +Infinity;
    },
    
    validateRange: function(range) {
        var me     = this,
            rsep   = me.displayRangeSeparator,
            format = Ext.String.format,
            start, end,
            isValid;
        
        isValid = me.callParent(arguments);
        
        if ( isValid !== true ) {
            return isValid;
        };
        
        // Should be safe by this point
        start = me.parseDate( range[0] );
        end   = me.parseDate( range[1] );
        
        if ( start.getHours() * 3600 + start.getMinutes() * 60 < me.getMinTime() ) {
            return format(me.minText, range[0]);
        };
        
        if ( end.getHours() * 3600 + end.getMinutes() * 60 > me.getMaxTime() ) {
            return format(me.maxText, range[1]);
        };
        
        if ( start.getMinutes() % me.increment !== 0 || end.getMinutes() % me.increment !== 0 ) {
            return format(me.invalidIncrementText, me.increment);
        };
        
        return true;
    },
    
    validateDate: function(value) {
        var me     = this,
            isDate = Ext.isDate,
            format = Ext.String.format,
            dt;
        
        try { dt = me.parseDate(value); } catch (e) {};
        
        if ( !isDate(dt) ) {
            return format(me.invalidText, value, me.format);
        };
        
        if ( dt.getHours() * 3600 + dt.getMinutes() * 60 < me.getMinTime() ) {
            return format(me.minText, value);
        };
        
        if ( dt.getHours() * 3600 + dt.getMinutes() * 60 > me.getMaxTime() ) {
            return format(me.maxText, value);
        };
        
        if ( dt.getMinutes() % me.increment !== 0 ) {
            return format(me.invalidIncrementText, me.increment);
        };
        
        return true;
    },
    
    formatSubmitValue: function(value) {
        var me  = this,
            fmt = me.submitFormat || me.format,
            dt, res;
        
        try {
            dt  = me.parseDate(value);
            res = Ext.Date.format(dt, fmt);
        } catch (e) {};
        
        return Ext.isString(res) ? res : '';
    },
    
    formatDisplayValue: function(value) {
        var me  = this,
            fmt = me.format,
            dt, res;
        
        try {
            dt  = me.parseDate(value);
            res = Ext.Date.format(dt, fmt);
        } catch (e) {};
        
        return Ext.isString(res) ? res : value;
    },
    
    formatPickerValue: function(value) {
        var me           = this,
            hourValues   = me.hourValues,
            minuteValues = me.minuteValues,
            indexOf      = Ext.Array.indexOf,
            hours, minutes, dt;
        
        if ( value[0] === null || value[1] === null || value[2] === null ) {
            return '';
        };
        
        try {
            hours   = (value[0] * 12) + indexOf(hourValues, value[1]);
            minutes = indexOf(minuteValues, value[2]) * 15;
            
            dt = new Date();
            dt.setHours(hours, minutes, 0, 0);
        } catch (e) { return };
        
        return Ext.Date.format(dt, me.format);
    },
    
    expandValues: function(text) {
        var me           = this,
            rsep         = me.rangeSeparatorRE,
            increment    = me.increment,
            hourValues   = me.hourValues,
            minuteValues = me.minuteValues,
            fmt          = me.format,
            mfloor       = Math.floor,
            values, times, result;
        
        if ( text === '' || text === null ) {
            return [ [ null, null, null ], [ null, null, null ] ];
        };
        
        values = me.splitValues(text, rsep);
        times  = Ext.Array.map(values, Ext.bind(me.parseDate, me, [ fmt ], 1));
        result = Ext.Array.map(times, function(dt) {
            var hours, minutes, hrIdx, mnIdx;
            
            hours   = dt.getHours();
            minutes = dt.getMinutes();

            hrIdx   = hours > 11 ? hours - 12 : hours;
            mnIdx   = mfloor(minutes / 15);
            
            return [
                hours > 11 ? 1 : 0,
                hourValues[hrIdx],
                minuteValues[mnIdx]
            ];
        });
        
        return result;
    }
});