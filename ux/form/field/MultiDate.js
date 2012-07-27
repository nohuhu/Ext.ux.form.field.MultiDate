/*
 * Input field that allows multiple date values, including multiple contiguous ranges.
 *
 * Version 0.99, compatible with Ext JS 4.1.
 *  
 * Copyright (c) 2011-2012 Alexander Tokarev.
 *  
 * Usage: drop-in replacement for Ext.form.field.Date. See demo application
 * for more details.
 *
 * This code is licensed under the terms of the Open Source LGPL 3.0 license.
 * Commercial use is permitted to the extent that the code/component(s) do NOT
 * become part of another Open Source or Commercially licensed development library
 * or toolkit without explicit permission.
 * 
 * License details: http://www.gnu.org/licenses/lgpl.html
 */

Ext.define('Ext.ux.form.field.MultiDate', {
	extend: 'Ext.form.field.Date',
	alias:	'widget.multidatefield',
	
	alternateClassName: [
	    'Ext.form.field.MultiDate',
	    'Ext.form.MultiDateField',
	    'Ext.form.MultiDate'
	],
	
	requires: [ 'Ext.ux.picker.MultiDate' ],

	mixins: {
	    multivalue: 'Ext.ux.form.field.MultiValue'
	},

    /**
     * @cfg {String} okText OK button text.
     */
    okText: 'OK',
    
    /**
     * @cfg {String} cancelText Cancel button text.
     */
    cancelText: 'Cancel',
    	
    /**
     * @cfg {String} clearText 'Clear' button text.
     */
    clearText: 'Clear',

	/**
	 * @cfg {String} multiDisabledText
	 * Error text to display when multiple values are entered while multiValue is false.
	 */
	multiDisabledText: 'Multiple dates are not allowed',
	
	/**
	 * @cfg {String} invalidRangeText
	 * Error text to display when an invalid date range is entered.
	 */
	invalidRangeText: '{0} is not a valid date range',
	
	/**
	 * @cfg {String} invalidRangeEndsText
	 * Error text to display when range end is less than range start.
	 */
	invalidRangeEndsText: '{0} is invalid: start date must be earlier than end date',
	
    /**
     * @cfg {Int[]} workDays Array of 0-based week day numbers that represent work week
     * for given locale. Defaults to Monday-Friday.
     */
    workDays: [ 1, 2, 3, 4, 5 ],

    altFormats : "m/d/Y|n/j/Y|n/j/y|m/j/y|n/d/y|m/j/Y|n/d/Y|m/d|n/j",
    
    initComponent: function() {
        var me = this;
        
        me.callParent(arguments);
        
        // It's always turned off when multiValue is on
        if ( me.multiValue ) {
            me.showToday = false;
        };
    },
    
    initValue: function() {
        var me    = this,
            value = me.value;
        
        if ( value && Ext.isString(value) ) {
            me.setRawValue(value);
        }
        else if ( Ext.isDate(value) ) {
            me.setRawValue( me.formatDisplayValue(value) );
        }
        else {
            return;
        };
        
        me.validate();
    },
    
    setValue: function(value, isSubmit) {
        var me = this;
        
        if ( isSubmit ) {
            me.setSubmitValue(value);
        }
        else {
            me.callParent([value]);
        };
    },
    
    setSubmitValue: function(value) {
        var me = this,
            fmt = me.submitFormat,
            vsep, rsep, values, collapsed, text;
        
        vsep = new XRegExp(me.submitValueSeparator);
        rsep = new XRegExp(me.submitRangeSeparator);
        
        values = me.expandValues(value, fmt, vsep, rsep);
        
        if ( values && values.length ) {
            collapsed = me.collapseRange(values);
            text      = me.formatDisplay(collapsed);
            
            me.setRawValue(text);
        }
        else {
            me.setRawValue('');
        };
    },
    
    getSubmitValue: function() {
        var me = this,
            values;
        
        values = me.getRawValue();
        
        return me.formatSubmit(values);
    },

    createPicker: function() {
        var me = this,
            format = Ext.String.format;
            
        if ( !me.multiValue ) {
            return me.callParent(arguments);
        };
        
        return Ext.create('Ext.picker.MultiDate', {
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            okText: me.okText,
            cancelText: me.cancelText,
            clearText: me.clearText,
            workDays: Ext.Array.sort(me.workDays, function(a, b) { return a - b }),
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            listeners: {
                scope: me,
                select: me.onSelect
            }
        });
    },
    
    getErrors: function(values) {
        var me = this,
            multi = me.multiValue,
            vsep = me.valueSeparatorRE,
            rsep = me.rangeSeparatorRE,
            errors = [],
            matches, range, isValid, dt;
        
        if ( values === null || values.length < 1 ) {
            if ( !me.allowBlank ) {
                errors.push(me.blankText);
            };
            
            return errors;
        };
        
        matches = me.splitValues(values, vsep);
        
        if ( !multi && matches.length > 1 ) {
            errors.push(me.multiDisabledText);
        };
        
        MATCHES:
        for ( var i = 0, l = matches.length; i < l; i++ ) {
            var match = matches[i];
        
            // Try to validate the match as a single date; it may just be one
            dt = me.parseDate(match);
            
            if ( Ext.isDate(dt) ) {
                isValid = me.validateDate(match);
            }
            else if ( !rsep.test(match) ) {
                isValid = Ext.String.format(me.invalidText, match, me.format);
            }
            else {
                range = me.splitValues(match, rsep);
                
                if ( !multi && range.length > 1 ) {       // Got date range
                    errors.push(me.multiDisabledText);
                };
                    
                isValid = me.validateRange(range);
            };

            if ( isValid !== true ) {
                errors.push(isValid);
            };
        };
        
        return errors;
    },
    
    splitValues: function(values, regex) {
        var me = this;
        
        return Ext.isString(values) &&
               regex.source !== '' && values.match(regex)   ? values.split(regex)
             :                                                [ values ]
             ;
    },

    onExpand: function() {
        var me = this,
            text, values;
            
        if ( !me.multiValue ) {
            return me.callParent(arguments);
        };
        
        text = me.getRawValue();

        // We don't care for invalid input
        if ( me.isValid() ) {
            values = me.expandValues( text );
            me.picker.setValue( values );
        }
        else if ( text === '' ) {
            me.clearInvalid();
        };
    },
    
    onSelect: function(picker, dates) {
        var me = this,
            collapsed, text;
        
        if ( !me.multiValue ) {
            return me.callParent(arguments);
        };
        
        collapsed = me.collapseRange(dates);
        text      = me.formatDisplay(collapsed);
        
        me.setRawValue(text);
        
        me.fireEvent('select', me, text);
        
        me.collapse();
    },
    
    parseDate: function(value, format) {
        var me = this,
            dt;
        
        if ( format && (dt = me.safeParse(value, format)) ) {
            return dt;
        };
        
        return me.callParent([value]);
    },
    
    validateDate: function(value) {
        var me = this,
            dt;
        
        dt = me.parseDate(value);
        
        return Ext.isDate(dt) || Ext.String.format(me.invalidText, value, me.format);
    },
    
    validateRange: function(range) {
        var me = this,
            rsep = me.displayRangeSeparator,
            isDate = Ext.isDate,
            getElapsed = Ext.Date.getElapsed,
            format = Ext.String.format,
            start, end,
            isValid = false;
        
        try {
            start   = me.parseDate( range[0] );
            end     = me.parseDate( range[1] );
            
            isValid = !!(isDate(start) && isDate(end) && start.getTime() <= end.getTime());
        } catch (e) {};
        
        if ( !isDate(start) || !isDate(end) ) {
            return format(me.invalidRangeText, range[0] + rsep + range[1] );
        };
        
        if ( start.getTime() > end.getTime() ) {
            return format(me.invalidRangeEndsText, me.formatDisplayRange(range, rsep) );
        };
        
        if ( (isValid = me.validateDate(range[0])) !== true ) {
            return isValid;
        };
        
        if ( (isValid = me.validateDate(range[1])) !== true ) {
            return isValid;
        };
        
        return true;
    },
    
    formatSubmit: function(values, rsep, vsep) {
        var me = this,
            multi = me.multiValue,
            valsep = me.valueSeparatorRE,
            ransep = me.rangeSeparatorRE,
            items, isStr, doesMatch, dt;
        
        items = me.splitValues(values, valsep);
        
        for ( var i = 0, l = items.length; i < l; i++ ) {
            var item = items[i],
                vr;
            
            if ( Ext.isDate( me.parseDate(item) ) ) {
                items[i] = me.formatSubmitValue(item);
            }
            else {
                vr = me.splitValues(item, ransep);
                
                items[i] = vr.length > 1 ? me.formatSubmitRange(vr, rsep || me.submitRangeSeparator)
                         :                 me.formatSubmitValue(vr)
                         ;
            };
        };
        
        values = items.join(vsep || me.submitValueSeparator);
        
        return values;
    },
    
    formatSubmitValue: function(value) {
        var me = this,
            fmt = me.submitFormat || me.format,
            dt, res;
        
        try {
            dt  = Ext.Date.clearTime( me.parseDate(value) );
            res = Ext.Date.format(dt, fmt);
        } catch (e) {};
        
        return Ext.isString(res) ? res : '';
    },
    
    formatDisplayValue: function(value) {
        var me = this,
            fmt = me.format,
            dt, res;
        
        try { res = Ext.Date.format(value, fmt); } catch (e) {};
        
        return Ext.isString(res) ? res : '';
    },
    
    expandValues: function(text, format, vSeparator, rSeparator) {
        var me   = this,
            vsep = vSeparator || me.valueSeparatorRE,
            rsep = rSeparator || me.rangeSeparatorRE,
            values, dt,
            result = [];
        
        if ( text === '' || text === null ) {
            return [];
        };
        
        values = me.splitValues(text, vsep);
        
        for ( var i = 0, l = values.length; i < l; i++ ) {
            var value = values[i];
            
            dt = me.parseDate(value, format);
            
            if ( Ext.isDate(dt) ) {
                result.push(dt);
            }
            else {
                var range = me.splitValues(value, rsep);
                
                // Ugh. What an ugliness.
                result = [].concat( result, 
                                    range.length > 1 ? me.expandRange(range, format)
                                  :                    me.parseDate(range[0])
                                  );
            };
        };
        
        return result;
    },
    
    expandRange: function(range, format) {
        var me = this,
            start, end,
            result = [];
        
        start = me.parseDate( range[0], format );
        end   = me.parseDate( range[1], format );
        
        if ( !Ext.isDate(start) || !Ext.isDate(end) || Ext.Date.getElapsed(start, end) < 0 ) {
            return [];
        };
        
        dt = start;
        
        for ( var dt = start; dt <= end; dt = Ext.Date.add(dt, Ext.Date.DAY, 1) ) {
            result.push(dt);
        };
        
        return result;
    },

	/**
	 * @private
	 * Collapses item ranges. The code is adapted from Perl module Range::Object
	 */
	collapseRange: function(data) {
		var me = this,
			range = Ext.clone(data),
			first, last,
			result = [];
		
		if ( Ext.isEmpty(data) ) {
		    return result;
		};
		
		range.sort( function(a, b) { return a.getTime() - b.getTime() } );
		
		ITEM:
		for ( var i = 0, l = range.length; i < l; i++ ) {
			var item = range[i];
			
			// If first is defined, it means range has started
			if ( first === undefined ) {
				first = last = item;
				continue ITEM;
			};
			
			// If last immediately preceeds item in range,
			// item becomes next last
			if ( me.nextInRange(last, item) ) {
				last = item;
				continue ITEM;
			};
			
			// If item doesn't follow last and last is defined,
			// it means that current contiguous range is complete
			if ( !me.equalValues(first, last) ) {
				result.push( [first, last] );
				first = last = item;
				continue ITEM;
			};
			
			// If last wasn't defined, range was never contiguous
			result.push( first );
			first = last = item;
		};
		
		// We're here when last item has been processed
		if ( me.equalValues(first, last) ) {
			result.push( first );
		}
		else {
			result.push( [first, last] );
		};
		
		return result;
	},
	
	nextInRange: function(first, last) {
		var dt;
		
		dt = Ext.Date.add(first, Ext.Date.DAY, 1);
		
		return !!(dt.getTime() === last.getTime());
	},
	
	equalValues: function(first, last) {
		return first.getTime() === last.getTime();
	}
});