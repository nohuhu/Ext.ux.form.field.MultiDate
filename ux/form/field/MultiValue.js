/*
    Mixin that allows multiple values or ranges of values of the same type to be entered in
    a field.

    Version 0.92

    Copyright (C) 2011 Alexander Tokarev.
    
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

Ext.define('Ext.ux.form.field.MultiValue', {
    /**
     * @private Mixin indicator.
     */
    isMultiValued: true,
    
    /**
     * @cfg {Boolean} [multiValue=false] Determines if multiple values are allowed in
     * the field.
     */
    multiValue: false,
    
    /**
     * @cfg {RegExp} valueSeparator Regular expression used to separate input values
     * from each other.
     */
    valueSeparatorRE: /[;,]\s*/,
    
    /**
     * @cfg {RegExp} rangeSeparator Regular expression used to separate start and end
     * of a range.
     */
    rangeSeparatorRE: /\s*-\s*/,

    /**
     * @cfg {RegExp} valuePattern Regular expression used to validate one value or
     * part of a range.
     */
    valuePatternRE: /\d+/,
    
    /**
     * @cfg {String} displayValueSeparator Character or string used to separate
     * displayed values from each other. It may differ from both valueSeparator regex
     * and submitValueSeparator.
     */
	displayValueSeparator: ', ',
	
	/**
	 * @cfg {String} displayRangeSeparator Character or string used to denote a range
	 * of values when displaying. It is placed between range start and end.
	 */
	displayRangeSeparator: '-',
    
    /**
     * @cfg {String} submitValueSeparator Character or string used to separate
     * submitted values from each other. It may differ from valueSeparator regex.
     */
    submitValueSeparator: ';',
    
    /**
     * @cfg {String} submitRangeSeparator Character or string used to denote a range;
     * it is placed between range start and end upon submitting values.
     */
    submitRangeSeparator: '-',
    
    constructor: function(config) {
        var me = this,
            config = config || {};
        
        Ext.apply(me, config);
        
        me.regex = me.multiValue ? me.initMultiRegex()
                 :                 me.initSingleRegex()
                 ;
        
        me.callParent(arguments);
    },
    
    /**
     * @private Creates regex for checking single value when multiValue is off.
     */
    initSingleRegex: function() {
        var me = this,
            value;
        
        value = me.valueRegex();
        
        return new RegExp( '^' + value + '$' );
    },
    
    /**
     * @private Creates regex for checking multiple values and ranges when multiValue is on.
     */
    initMultiRegex: function() {
        var me = this,
            value, vsep, rsep, range, valueOrRange;
        
        value = me.valueRegex();
        
        // Normalize regexen
        me.rangeSeparatorRE = new RegExp(me.rangeSeparatorRE);
        me.valueSeparatorRE = new RegExp(me.valueSeparatorRE);
        
        rsep  = me.rangeSeparatorRE.source;
        vsep  = me.valueSeparatorRE.source;
        
        range = value + rsep + value;
        valueOrRange = '(' + value + '|' + range + ')';
        
        return new RegExp(
            '^' +
                '(' + valueOrRange + ')'
                +
                '(' + vsep + valueOrRange + ')*'
                +
            '$'
        );
    },
    
    /**
     * @private Normalizes single value regex.
     */
    valueRegex: function() {
        var me = this,
            vp;
            
        me.valuePatternRE = vp = new RegExp(me.valuePatternRE);
        
        return vp.source;
    },
    
    /**
     * @private Formats single value for submission.
     */
    formatSubmitValue: function(value) {
        // Does nothing in mixin
        return value;
    },
    
    /**
     * @private Formats single range of values for submission.
     */
    formatSubmitRange: function(range, rsep) {
        var me = this,
            start, end;

        start = me.formatSubmitValue( range[0] );
        end   = me.formatSubmitValue( range[1] );
        
        return start + rsep + end;
    },
    
    /**
     * @private Formats current values as a string for submission.
     */
    formatSubmit: function(values, rsep, vsep) {
        var me = this,
            multi = me.multiValue,
            valsep = me.valueSeparatorRE,
            ransep = me.rangeSeparatorRE,
            items, isStr, doesMatch;
        
        items = me.splitValues(values, valsep);
        
        for ( var i = 0, l = items.length; i < l; i++ ) {
            var item = items[i],
                vr;
                
            vr = me.splitValues(item, ransep);
            
            items[i] = vr.length > 1 ? me.formatSubmitRange(vr, rsep || me.submitRangeSeparator)
                     :                 me.formatSubmitValue(vr)
                     ;
        };
        
        values = items.join(vsep || me.submitValueSeparator);
        
        return values;
    },
    
    /**
     * @private Splits string of values using provided normalized regex.
     * Always returns an array.
     */
    splitValues: function(values, regex) {
        var me = this;
        
        return me.multiValue && Ext.isString(values) &&
               regex.source !== '' && values.match(regex)   ? values.split(regex)
             :                                                [ values ]
             ;
    },

    /**
     * @private Formats single value for displaying in input field.
     */
    formatDisplayValue: function(value) {
        return Ext.isString(value) ? value : value.toString();  // Trying to be generic
    },
    
    /**
     * @private Formats single range of values for displaying in input field.
     */
    formatDisplayRange: function(range, rsep) {
        var me = this,
            start, end;
        
        start = me.formatDisplayValue( range[0] );
        end   = me.formatDisplayValue( range[1] );
        
        return start + rsep + end;
    },
    
    /**
     * @private Formats array of values for displaying in input field. This method is mostly
     * useful for using with pickers that return raw objects and arrays of objects.
     */
    formatDisplay: function(values, rsep, vsep) {
        var me = this,
            multi = me.multiValue,
            results = [];
        
        if ( !multi ) {
            return values[0].toString();
        };
        
        for ( var i = 0, l = values.length; i < l; i++ ) {
            var value = values[i];
            
            if ( Ext.isArray(value) ) {
                results.push( me.formatDisplayRange(value, rsep || me.displayRangeSeparator) );
            }
            else {
                results.push( me.formatDisplayValue(value) );
            };
        };
        
        return results.join(vsep || me.displayValueSeparator);
    }
});