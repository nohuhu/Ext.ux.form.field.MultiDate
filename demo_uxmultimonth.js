/*
 * MultiMonth input field demo application.
 *
 * Version 0.99
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

Ext.Loader.setConfig({
    enabled:        true,
    disableCaching: true,
    paths: {
        'Ext.ux':  'ux'
    }
});

Ext.require([
    'Ext.ux.form.field.MultiMonth'
]);

var store, panel;

Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();

	panel = Ext.create('Ext.form.Panel', {
        width:	200,
        height: 200,
        
        id: 'formPanel',
        
        layout: 'vbox',
        
        defaults: {
            autoScroll: true,
            bodyPadding: 8,
			listeners: {
				specialkey: function(form, event) {
					if (event.getKey() === event.ENTER) {
						form.up().down('#validateButton').handler();
					};
				}
			}
        },
        
        position: 'absolute',
        x:  20,
        y:  20,
        
        items: [{
            xtype: 'multimonthfield',
            id: 'multiMonthField',
            allowBlank: false,
            multiValue: true,
            submitFormat: 'Y-m-d',
            submitRangeSeparator: '/',
        }, {
            xtype: 'button',
            id:    'validateButton',
            text:  'Validate',
            handler: function() {
                var form, field;
                
                form  = Ext.getCmp('formPanel').getForm();
                field = Ext.getCmp('multiMonthField');
                
                if ( form.isValid() ) {
                    var values = form.getValues();
                    alert('Form is valid: ' + Ext.JSON.encode(values[ field.inputId ]));
                }
                else {
                    alert('Form is invalid');
                };
            }
        }],
        
        renderTo: Ext.getBody()
	});
});
