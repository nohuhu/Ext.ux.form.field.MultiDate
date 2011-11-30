/*
    MultiTime input field demo application.
    
    Version 0.93

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

Ext.Loader.setConfig({
    enabled:        true,
    disableCaching: true,
    paths: {
        'Ext.ux':  'ux'
    }
});

Ext.require([
    'Ext.ux.form.field.MultiTime'
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
            xtype: 'multitimefield',
            id: 'multiTimeField',
            allowBlank: false,
            increment: 30,
            multiValue: true,
            submitFormat: 'H:i',
            submitRangeSeparator: '/',
            minValue: '8:00am',
            maxValue: '5:00pm'
        }, {
            xtype: 'button',
            id:    'validateButton',
            text:  'Validate',
            handler: function() {
                var form, field;
                
                form  = Ext.getCmp('formPanel').getForm();
                field = Ext.getCmp('multiTimeField');
                
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
