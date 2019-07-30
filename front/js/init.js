var serviceUrl = 'http://localhost:3000/'

var login = Ext.create('Ext.window.Window', {
    title: 'Ingreso',
    closeAction: 'method-hide',
    closable: false,
    items: [
        {
            xtype: 'form',
            bodyPadding: 15,
            defaultType: 'textfield',
            items: [
                {
                    allowBlank: false,
                    name: 'user',
                    fieldLabel: 'Usuario',
                    emptyText: 'usuario'
                }, {
                    allowBlank: false,
                    name: 'password',
                    fieldLabel: 'Contraseña',
                    emptyText: 'contraseña',
                    inputType: 'password',
                    listeners: {
                        specialkey: function (field, e) {
                            if (e.getKey() == e.ENTER) {
                                login.down('toolbar #login').click();
                            }
                        }
                    }
                }],
            buttons: [
                {
                    text: 'Registrarse',
                    itemId: 'registry',
                    handler: function (button) {
                        createRegistry(button);
                    }
                },
                '->',
                {
                    text: 'Ingresar',
                    itemId: 'login',
                    handler: function (button) {
                        Ext.data.JsonP.request({
                            url: serviceUrl + 'login',
                            params: button.up('form').getValues(),
                            success: function (result) {
                                if (result.success) {
                                    button.up('window').credential = result.credential;
                                    button.up('window').privilegios = Ext.JSON.decode(result.credential.PRIVILEGIOS);
                                    createViewport();
                                    button.up('window').close();
                                } else {
                                    Ext.Msg.alert('Ingreso', 'Usuario/Contraseña Inválidos');
                                }
                            },
                            failure: function (result) {
                                Ext.Msg.alert('Error', result.msg);
                            }
                        });
                    }
                }
            ],
            defaults: {
                anchor: '100%',
                labelWidth: 120
            }
        }
    ]
});

var createRegistry = function (button) {
    Ext.create('Ext.window.Window', {
        title: 'Registro',
        animateTarget: button,
        width: 500,
        //        height: 400,
        height: 495,
        layout: 'form',
        items: [
            {
                xtype: 'form',
                bodyPadding: 5,
                items: [
                    {
                        xtype: 'fieldset',
                        itemId: 'userInfo',
                        title: 'Información de Usuario',
                        defaultType: 'textfield',
                        defaults: {
                            anchor: '99%',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        field.up('window').down('#sendRegistry').click();
                                    }
                                }
                            }
                        },
                        items: [
                            {
                                allowBlank: false,
                                fieldLabel: 'Usuario',
                                emptyText: 'nombre.apellido',
                                name: 'user',
                                regex: new RegExp('[a-z]+\\.[a-z]+'),
                                regexText: 'Forma correcta >> [nombre.apellido]',
                                value: button.up('window').down('form').child('textfield[name=user]').getValue()
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'Contraseña',
                                emptyText: 'contraseña',
                                name: 'pass',
                                inputType: 'password',
                                minLength: 8,
                                value: button.up('window').down('form').child('textfield[name=password]').getValue()
                            }
                        ]
                    },
                    {
                        xtype: 'fieldset',
                        itemId: 'contactInfo',
                        title: 'Información de Contacto',
                        defaultType: 'textfield',
                        defaults: {
                            anchor: '99%',
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        field.up('window').down('#sendRegistry').click();
                                    }
                                }
                            }
                        },
                        items: [
                            {
                                allowBlank: false,
                                fieldLabel: 'Nombre Completo',
                                emptyText: 'Nombre(s) Paterno Materno',
                                name: 'name',
                                validator: function (value) {
                                    var result = 'Forma correcta >> [Nombre(s) Paterno Materno]';
                                    var values = value.split(' ');
                                    var reg = /[A-Z][a-z]+/;
                                    if (values.length >= 3) {
                                        if (values.every(function (item) {
                                            return reg.test(item);
                                        })) {
                                            result = true;
                                        }
                                    }
                                    return result;
                                }
                            },
                            {
                                xtype: 'combobox',
                                allowBlank: false,
                                fieldLabel: 'Puesto',
                                emptyText: 'Puesto',
                                valueField: 'CARGO',
                                displayField: 'CARGO',
                                queryMode: 'remote',
                                editable: false,
                                name: 'place',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['CARGO'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAllPlaces',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'cargos'
                                        }
                                    }
                                }),
                            },
                            {
                                xtype: 'combobox',
                                allowBlank: false,
                                fieldLabel: 'Autoridad',
                                emptyText: 'Autoridad',
                                valueField: 'ID_AUTORIDAD',
                                displayField: 'NOMBRE_AUTORIDAD',
                                queryMode: 'remote',
                                editable: false,
                                name: 'authority',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['ID_AUTORIDAD', 'NOMBRE_AUTORIDAD'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAllAuthorities',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'authorities'
                                        }
                                    }
                                }),
                            },
                            {
                                xtype: 'combobox',
                                allowBlank: false,
                                fieldLabel: 'Rol',
                                emptyText: 'Rol',
                                valueField: 'ID_ROL',
                                displayField: 'NOMBRE_ROL',
                                queryMode: 'remote',
                                editable: false,
                                name: 'rol',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['ID_ROL', 'NOMBRE_ROL'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAllRoles',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'roles'
                                        }
                                    }
                                }),
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'Teléfono',
                                emptyText: '12345678',
                                name: 'phone',
                                maxLength: 10,
                                minLength: 8
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'Extensión',
                                emptyText: '123',
                                name: 'ext',
                                maxLength: 5,
                                minLength: 1
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'Celular',
                                emptyText: '5512345678',
                                name: 'cell',
                                maxLength: 10,
                                minLength: 8
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'Correo',
                                emptyText: 'correo@dominio.com',
                                name: 'mail',
                                vtype: 'email'
                            }
                        ]
                    },
                    {
                        xtype: 'displayfield',
                        itemId: 'errorInfo',
                        name: 'errorInfo',
                        labelWidth: false,
                        labelStyle: 'width: auto;',
                        fieldStyle: 'color: red;font-size: small',
                        fieldLabel: '',
                        value: ''
                    }
                ]
            }
        ],
        listeners: {
            show: function () {
                login.close();
            },
            close: function () {
                login.show();
            }
        },
        buttons: [
            {
                text: 'Solicitar Registro',
                itemId: 'sendRegistry',
                handler: function (button) {
                    var thisForm = button.up('window').down('form');
                    var error = thisForm.child('#errorInfo');
                    if (thisForm.isValid()) {
                        error.setFieldLabel('');
                        error.setValue('');
                        //firma
                        signWindow(button, 6)
                        //Enviar registro
                        //                        Ext.data.JsonP.request({
                        //                            url: serviceUrl + 'registry',
                        //                            params: thisForm.getValues(),
                        //                            success: function (result) {
                        //                                if (result.success) {
                        //                                    Ext.Msg.show({
                        //                                        title: 'Registro solicitado',
                        //                                        message: '¿Desea obtener acuse de registro',
                        //                                        buttons: Ext.Msg.YESNO,
                        //                                        icon: Ext.Msg.INFO,
                        //                                        fn: function (btn) {
                        //                                            if (btn == 'yes') {
                        //                                                button.idCredencial = result.idCredencial;
                        //                                                signWindow(button, 6);
                        //                                            } else {
                        //                                                button.up('window').close();
                        //                                            }
                        //                                        }
                        //                                    });
                        //                                } else {
                        //                                    Ext.Msg.alert('Registro', 'No fue posible enviar la solicitud, intente mas tarde.');
                        //                                }
                        //                            }
                        //                        });
                    } else {
                        var field = thisForm.getForm().getFields().items.find(function (item) {
                            if (!Ext.isEmpty(item.activeErrors)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        error.setFieldLabel(field.fieldLabel);
                        error.setValue(field.activeErrors[0]);
                        field.focus();
                        //                        Ext.Msg.alert('Error en registro', 'Favor de revisar los campos marcados en rojo.');
                    }
                }
            }
        ]
    }).show();
};

var createViewport = function () {
    Ext.onReady(function () {
        var viewPort = Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: 'panel',
                    layout: 'border',
                    colspan: 3,
                    items: [
                        {
                            xtype: 'panel',
                            region: 'north',
                            title: 'Busqueda de Ordenes de Servicio',
                            collapsed: false,
                            collapsible: true,
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'form',
                                    id: 'serviceOrdersFilter',
                                    bodyPadding: 15,
                                    buttonAlign: 'left',
                                    listeners: {
                                        beforerender: function (panel, eOpts) {
                                            //                                            Ext.data.JsonP.request({
                                            //                                                url: 'http://localhost:3000/form',
                                            //                                                params: {},
                                            //                                                success: function (result) {
                                            //                                                    panel.loadRecord(Ext.create('Ext.data.Model', result));
                                            //                                                },
                                            //                                                failure: function (result) {
                                            //                                                    Ext.Msg.alert('Failed', result.msg);
                                            //                                                }
                                            //                                            });
                                        }
                                    },
                                    defaults: {
                                        listeners: {
                                            change: function (field, newValue, oldValue, eOpts) {
                                                field.up('form').down('toolbar').getComponent('filterButton').click();
                                            }
                                        }
                                    },
                                    items: [
                                        {
                                            xtype: 'fieldset',
                                            defaultType: 'datefield',
                                            layout: 'hbox',
                                            border: false,
                                            defaults: {
                                                listeners: {
                                                    change: function (field, newValue, oldValue, eOpts) {
                                                        field.up('form').down('toolbar').getComponent('filterButton').click();
                                                    }
                                                }
                                            },
                                            items: [
                                                {
                                                    fieldLabel: 'Fecha (Desde)',
                                                    name: 'filtroFechaFrom',
                                                    keyMapEnabled: true,
                                                    margin: '0 10 0 0',
                                                },
                                                {
                                                    fieldLabel: 'Fecha (Hasta)',
                                                    name: 'filtroFechaTo',
                                                    keyMapEnabled: true,
                                                    margin: '0 10 0 0',
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            defaultType: 'timefield',
                                            layout: 'hbox',
                                            border: false,
                                            defaults: {
                                                listeners: {
                                                    change: function (field, newValue, oldValue, eOpts) {
                                                        field.up('form').down('toolbar').getComponent('filterButton').click();
                                                    }
                                                }
                                            },
                                            items: [
                                                {
                                                    fieldLabel: 'Hora (Desde)',
                                                    name: 'filtroHoraFrom',
                                                    margin: '0 10 0 0',
                                                },
                                                {
                                                    fieldLabel: 'Hora (Hasta)',
                                                    name: 'filtroHoraTo',
                                                    margin: '0 10 0 0',
                                                }

                                            ]
                                        },
                                        {
                                            xtype: 'fieldset',
                                            defaultType: 'combobox',
                                            layout: 'hbox',
                                            border: false,
                                            defaults: {
                                                listeners: {
                                                    change: function (field, newValue, oldValue, eOpts) {
                                                        field.up('form').down('toolbar').getComponent('filterButton').click();
                                                    }
                                                }
                                            },
                                            items: [
                                                {
                                                    itemId: 'ID_STATUS',
                                                    name: 'ID_STATUS',
                                                    fieldLabel: 'Estado de Orden',
                                                    valueField: 'ID_STATUS',
                                                    displayField: 'NOMBRE_STATUS',
                                                    margin: '0 10 0 0',
                                                },
                                                {
                                                    itemId: 'TIPO_ORDEN_SERVICIO',
                                                    name: 'TIPO_ORDEN_SERVICIO',
                                                    fieldLabel: 'Tipo de Orden',
                                                    valueField: 'TIPO_ORDEN_SERVICIO',
                                                    displayField: 'TIPO_ORDEN_SERVICIO',
                                                    margin: '0 10 0 0',
                                                    store: Ext.create('Ext.data.Store', {
                                                        fields: ['TIPO_ORDEN_SERVICIO'],
                                                        data: [
                                                            { TIPO_ORDEN_SERVICIO: "Operativo" },
                                                            { TIPO_ORDEN_SERVICIO: "Movimiento por almacén" },
                                                        ]
                                                    })
                                                },
                                                {
                                                    itemId: 'modcancel',
                                                    name: 'modcancel',
                                                    fieldLabel: 'Orden',
                                                    valueField: 'name',
                                                    displayField: 'name',
                                                    margin: '0 10 0 0',
                                                    store: Ext.create('Ext.data.Store', {
                                                        fields: ['modcancel'],
                                                        data: [
                                                            { name: "MODIFICADO" },
                                                            { name: "CANCELADO" }
                                                        ]
                                                    })
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: 'Generar Informe Total de Servicios',
                                                    hidden: true,
                                                    listeners: {
                                                        beforerender: function (thisbutton) {
                                                            thisbutton.setVisible(login.privilegios.repoXLSX);
                                                        }
                                                    },
                                                    handler: function (thisbutton) {
                                                        Ext.data.JsonP.request({
                                                            url: serviceUrl + 'getInformeServicios',
                                                            success: function (result) {
                                                                console.log('Listo');
                                                            },
                                                            extraParams: {
                                                                tipoOrdenServicio: thisbutton.up('fieldset').items.getByKey('TIPO_ORDEN_SERVICIO').getValue()
                                                            }
                                                        });
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            xtype: 'textfield',
                                            fieldLabel: 'Nombre',
                                            name: 'NOMBRE',
                                            margin: '0 0 0 10',
                                        }
                                    ],
                                    buttons: [
                                        {
                                            text: 'Filtrar',
                                            glyph: 'xf0b0@FontAwesome',
                                            itemId: 'filterButton',
                                            handler: function (button) {
                                                var dateFilter = new Object();
                                                var grid = Ext.getCmp('serviceOrdersGrid');
                                                var formValues = button.up('form').getValues();
                                                var filters = new Array();
                                                Ext.Object.each(formValues, function (key, value) {
                                                    if (!Ext.isEmpty(value)) {
                                                        switch (key) {
                                                            case 'NOMBRE':
                                                                filters.push({ property: key, value: value, operator: '/=' });
                                                                break;
                                                            case 'TIPO_ORDEN_SERVICIO':
                                                                filters.push({ property: key, value: value, operator: '/=' });
                                                                break;
                                                            case 'ID_STATUS':
                                                                filters.push({ property: key, value: value, operator: '=' });
                                                                break;
                                                            case 'modcancel':
                                                                filters.push({ property: value, value: 1, operator: '=' });
                                                                break;
                                                            default:
                                                                dateFilter[key] = value;
                                                                break;
                                                        }
                                                    }
                                                });
                                                if (!Ext.isEmpty(dateFilter)) {
                                                    filters.push({
                                                        property: 'FECHA_SOLICITUD', filterFn: function (item) {
                                                            var dateString = Ext.Date.format(item.data.FECHA_SOLICITUD, 'd/m/Y');
                                                            var isValidDate = true;
                                                            if (isValidDate && dateFilter.hasOwnProperty('filtroFechaFrom')) {
                                                                isValidDate = item.data.FECHA_SOLICITUD >= Ext.Date.parse(dateFilter.filtroFechaFrom, 'd/m/Y');
                                                            }
                                                            if (isValidDate && dateFilter.hasOwnProperty('filtroFechaTo')) {
                                                                isValidDate = item.data.FECHA_SOLICITUD <= Ext.Date.parse(dateFilter.filtroFechaTo, 'd/m/Y');
                                                            }
                                                            if (isValidDate && dateFilter.hasOwnProperty('filtroHoraFrom')) {
                                                                isValidDate = item.data.FECHA_SOLICITUD >= Ext.Date.parse(dateString + ' ' + dateFilter.filtroHoraFrom, 'd/m/Y g:i A');
                                                            }
                                                            if (isValidDate && dateFilter.hasOwnProperty('filtroHoraTo')) {
                                                                isValidDate = item.data.FECHA_SOLICITUD <= Ext.Date.parse(dateString + ' ' + dateFilter.filtroHoraTo, 'd/m/Y g:i A');
                                                            }
                                                            return isValidDate;
                                                        }
                                                    });
                                                }

                                                //Agrega Filtros
                                                if (!Ext.isEmpty(grid.store.filters)) {
                                                    grid.store.filters.removeAll();
                                                }
                                                if (!Ext.isEmpty(filters)) {
                                                    grid.getStore().filter(filters);
                                                }
                                            }
                                        },
                                        {
                                            text: 'Limpiar Filtros',
                                            glyph: 'xf1f8@FontAwesome',
                                            handler: function (button) {
                                                Ext.getCmp('serviceOrdersFilter').reset();
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            id: 'serviceOrdersGrid',
                            region: 'center',
                            title: 'Ordenes de Servicio',
                            height: 500,
                            collapsed: false,
                            collapsible: true,
                            listeners: {
                                itemdblclick: function (grid, record, item, index, e, eOpts) {
                                    orderWindow(record);
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoLoad: true,
                                fields: [
                                    { name: 'ID_ORDEN_SERVICIO', type: 'int' },
                                    { name: 'FECHA_SOLICITUD', type: 'date' },
                                    { name: 'DOMICILIO', type: 'string' },
                                    { name: 'NOMBRE', type: 'string' },
                                    { name: 'CARGO', type: 'string' },
                                    { name: 'NOMBRE_AUTORIDAD', type: 'string' },
                                    { name: 'NIVEL', type: 'string' },
                                    { name: 'SERVICIO', type: 'string' },
                                    { name: 'NOMBRE_STATUS', type: 'string' }
                                ],
                                proxy: {
                                    type: 'jsonp',
                                    url: serviceUrl + 'getAllOrdenServicio',
                                    reader: {
                                        type: 'json',
                                        rootProperty: 'ordenesServicio'
                                    },
                                    extraParams: {
                                        idCredencial: login.credential.ID_CREDENCIAL,
                                        idRol: login.credential.idRol,
                                        idAutoridad: login.credential.idAutoridad,
                                        vi: login.privilegios.vi
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, eOpts) {
                                        var map = new Array();
                                        var data = new Array();
                                        var record;
                                        records.forEach(function (item) {
                                            if (map.indexOf(item.data.ID_STATUS) === -1) {
                                                record = new Object();
                                                record.ID_STATUS = item.data.ID_STATUS;
                                                record.NOMBRE_STATUS = item.data.NOMBRE_STATUS;
                                                map.push(record.ID_STATUS);
                                                data.push(record);
                                            }
                                        });
                                        Ext.getCmp('serviceOrdersFilter').queryById('ID_STATUS').setStore(Ext.create('Ext.data.Store', {
                                            fields: ['ID_STATUS', 'NOMBRE_STATUS'],
                                            data: data
                                        }));

                                        //Validar generación de reporte
                                        Ext.data.JsonP.request({
                                            url: serviceUrl + 'getCurDate',
                                            success: function (result) {
                                                var availableTen = result.success && result.avalibleTen;
                                                var avalibleFifteen = result.success && result.avalibleFifteen;
                                                viewPort.down('toolbar #reportA').setDisabled(!availableTen);
                                                viewPort.down('toolbar #leftDaysA').setValue(availableTen ? '<span style="color:gray;">(' + result.leftDayTen + ' días restantes)</span>' : '');
                                                if (login.privilegios.f4) {
                                                    //muestra botones
                                                    viewPort.down('toolbar #reportB').setHidden(false);
                                                    viewPort.down('toolbar #leftDaysB').setHidden(false);
                                                    //                                                    viewPort.down('toolbar #reportC').setHidden(false);
                                                    viewPort.down('toolbar #leftDaysC').setHidden(false);
                                                    //configura botones
                                                    viewPort.down('toolbar #reportB').setDisabled(!avalibleFifteen);
                                                    viewPort.down('toolbar #leftDaysB').setValue(avalibleFifteen ? '<span style="color:gray;">(' + result.leftDayFifteen + ' días restantes)</span>' : '');
                                                    //                                                    viewPort.down('toolbar #reportC').setDisabled(!availableTen);
                                                    viewPort.down('toolbar #leftDaysC').setValue(availableTen ? '<span style="color:gray;">(' + result.leftDayTen + ' días restantes)</span>' : '');
                                                } else {
                                                    //quita botones
                                                    viewPort.down('toolbar #reportB').setHidden(true);
                                                    viewPort.down('toolbar #leftDaysB').setHidden(true);
                                                    //                                                    viewPort.down('toolbar #reportC').setHidden(true);
                                                    viewPort.down('toolbar #leftDaysC').setHidden(true);
                                                }
                                                viewPort.down('toolbar #reportC').setHidden(!login.privilegios.cons);
                                            }
                                        });

                                    }
                                },
                                sorters: []
                            }),
                            columns: [
                                { text: 'ID', dataIndex: 'ID_ORDEN_SERVICIO', flex: 1, filter: 'number' },
                                { text: 'Fecha', dataIndex: 'FECHA_SOLICITUD', xtype: 'datecolumn', flex: 2, format: 'd/m/Y g:i A', filter: 'date' },
                                { text: 'Domicilio', dataIndex: 'DOMICILIO', flex: 4, filter: 'string' },
                                { text: 'Nombre', dataIndex: 'NOMBRE', flex: 2, filter: 'string' },
                                { text: 'Cargo', dataIndex: 'CARGO', flex: 2, filter: 'string' },
                                { text: 'Autoridad', dataIndex: 'NOMBRE_AUTORIDAD', flex: 2, filter: 'string' },
                                { text: 'Nivel', dataIndex: 'NIVEL', flex: 1, filter: 'string' },
                                { text: 'Servicio', dataIndex: 'SERVICIO', flex: 2, filter: 'string' },
                                { text: 'Estado', dataIndex: 'NOMBRE_STATUS', flex: 2, filter: 'string' },
                                {
                                    xtype: 'actioncolumn',
                                    width: 50,
                                    items: [
                                        {
                                            iconCls: 'pictos pictos-info',
                                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                                orderWindow(record);
                                            }
                                        }
                                    ]
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    defaultType: 'button',
                                    items: [
                                        {
                                            text: 'Nueva Orden de Servicio',
                                            glyph: 'xf055@FontAwesome',
                                            handler: function (button) {
                                                orderWindow();
                                            }
                                        },
                                        {
                                            text: 'Actualizar',
                                            glyph: 'xf021@FontAwesome',
                                            handler: function (button) {
                                                Ext.getCmp('serviceOrdersGrid').getStore().reload();
                                            }
                                        },
                                        {
                                            text: 'Generar Reporte',
                                            itemId: 'reportA',
                                            //                                            disabled: true,
                                            glyph: 'xf15b@FontAwesome',
                                            handler: function (button) {
                                                signWindow(button, 3);
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            itemId: 'leftDaysA',
                                            labelWidth: 150
                                        },
                                        {
                                            text: 'Factura',
                                            itemId: 'reportB',
                                            glyph: 'xf15b@FontAwesome',
                                            handler: function (button) {
                                                preFormReport(button);
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            itemId: 'leftDaysB',
                                            labelWidth: 150
                                        },
                                        {
                                            text: 'Consolidado',
                                            itemId: 'reportC',
                                            glyph: 'xf15b@FontAwesome',
                                            handler: function (button) {
                                                signWindow(button, 5);
                                            }
                                        },
                                        {
                                            xtype: 'displayfield',
                                            itemId: 'leftDaysC',
                                            labelWidth: 150
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ],
            renderTo: "target"
        });
        //alert("init");
    });
};

var preFormReport = function (button) {
    Ext.create('Ext.window.Window', {
        title: 'Registro',
        animateTarget: button,
        width: 350,
        height: 270,
        layout: 'form',
        items: [
            {
                xtype: 'form',
                bodyPadding: 5,
                items: [
                    {
                        xtype: 'fieldset',
                        title: 'Datos de Factura',
                        defaultType: 'textfield',
                        defaults: {
                            listeners: {
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        field.up('window').down('#billReport').click();
                                    }
                                }
                            }
                        },
                        items: [
                            {
                                allowBlank: false,
                                fieldLabel: 'Factura',
                                emptyText: 'Factura',
                                name: 'bill'
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'NoOficio',
                                emptyText: 'NoOficio',
                                name: 'noOficio'
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'NoIdPedido',
                                emptyText: 'NoIdPedido',
                                name: 'noIdPedido'
                            },
                            {
                                allowBlank: false,
                                fieldLabel: 'NoIdRecepcion',
                                emptyText: 'NoIdRecepcion',
                                name: 'noIdRecepcion'
                            },
                            {
                                xtype: 'combobox',
                                allowBlank: false,
                                fieldLabel: 'Autoridad',
                                emptyText: 'Autoridad',
                                valueField: 'ID_AUTORIDAD',
                                displayField: 'NOMBRE_AUTORIDAD',
                                queryMode: 'remote',
                                editable: false,
                                name: 'idAutoridad',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['ID_AUTORIDAD', 'NOMBRE_AUTORIDAD'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAllAuthorities',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'authorities'
                                        }
                                    }
                                }),
                            }
                        ]
                    }
                ]
            }
        ],
        buttons: [
            {
                text: 'Acpetar',
                itemId: 'billReport',
                handler: function (button) {
                    var thisForm = button.up('window').down('form');
                    if (thisForm.isValid()) {
                        signWindow(button, 4);
                    } else {
                        var field = thisForm.getForm().getFields().items.find(function (item) {
                            if (!Ext.isEmpty(item.activeErrors)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        field.focus();
                        Ext.Msg.alert('Error', 'Revisar los campos marcados en rojo.');
                    }
                }
            }
        ]
    }).show();
};

var signWindow = function (button, report) {
    Ext.create('Ext.window.Window', {
        title: 'Firma',
        animateTarget: button,
        height: 200,
        width: 300,
        layout: 'center',
        modal: true,
        items: [
            {
                xtype: 'form',
                itemId: 'sf1',
                bodyPadding: 15,
                items: [
                    {
                        xtype: 'label',
                        text: 'Firma Digital'
                    },
                    {
                        xtype: 'filefield',
                        itemId: 'cer',
                        fieldLabel: '.cer',
                        accept: '.cer'
                    },
                    {
                        xtype: 'filefield',
                        itemId: 'key',
                        fieldLabel: '.key',
                        accept: '.key'
                    },
                    {
                        xtype: 'textfield',
                        itemId: 'password',
                        fieldLabel: 'Contraseña',
                        emptyText: 'contraseña',
                        inputType: 'password',
                        allowBlank: false,
                        listeners: {
                            specialkey: function (field, e) {
                                if (e.getKey() == e.ENTER) {
                                    fielSign(field.up('form'), report, button);
                                }
                            }
                        }
                    }
                ]
            }
        ],
        buttons: [
            {
                text: 'Firmar',
                glyph: 'xf084@FontAwesome',
                itemId: 'signButtonConfirmaciones',
                handler: function (signButton) {
                    fielSign(signButton.up('window').down('#sf1'), report, button);
                }
            }
        ]
    }).show();
};

var orderWindow = function (recordBase) {
    var thisWin = Ext.create('Ext.window.Window', {
        recordBase: recordBase,
        title: 'Orden de Servicio',
        height: 700,
        width: 830,
        modal: true,
        autoScroll: true,
        layout: 'accordion',
        closeAction: 'method-destroy',
        listeners: {
            close: function (window) {
                Ext.getCmp('serviceOrdersGrid').getStore().reload();
            }
        },
        items: [
            {
                xtype: 'panel',
                itemId: 'e1',
                title: '[1] Informacion de Orden de servicio',
                layout: 'fit',
                fillData: function (panel) {
                    var newOrder = Ext.isEmpty(recordBase);
                    var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 1;
                    var haveAccess = login.privilegios.f1;
                    if (newOrder) {
                        if (haveAccess) {
                            panel.getComponent('e1f1').getComponent('fechaSolicitud').setValue(new Date());
                            panel.getComponent('e1f1').getComponent('horaSolicitud').setValue(new Date());
                        } else {
                            panel.getComponent('e1f1').getForm().getFields().each(function (field) {
                                field.setDisabled(true);
                            });
                            if (isAgree) {
                                panel.down('toolbar #nextButton').setText('Siguiente');
                                panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                            } else {
                                panel.down('toolbar #nextButton').setDisabled(true);
                            }
                        }
                    } else {
                        //habilita split panels de usuario en la actual etapa
                        for (var i = 1; i < parseInt(recordBase.data.ID_STATUS); i++) {
                            thisWin.getComponent('e' + (i + 1)).setVisible(true);
                        }

                        thisWin.ordenServicio = recordBase.data;
                        var fechaSolicitud = panel.getComponent('e1f1').getComponent('fechaSolicitud');
                        var horaSolicitud = panel.getComponent('e1f1').getComponent('horaSolicitud');
                        var domicilio = panel.getComponent('e1f1').getComponent('domicilio');
                        var justificacion = panel.getComponent('e1f1').getComponent('justificacion');
                        var tipoOrdenServicio = panel.getComponent('e1f1').getComponent('tipoOrdenServicio');

                        //llena formulario
                        fechaSolicitud.setValue(recordBase.data.FECHA_SOLICITUD);
                        horaSolicitud.setValue(recordBase.data.FECHA_SOLICITUD);
                        domicilio.setValue(recordBase.data.DOMICILIO);
                        justificacion.setValue(recordBase.data.JUSTIFICACION);
                        tipoOrdenServicio.setValue(recordBase.data.TIPO_ORDEN_SERVICIO);

                        //Permisos para modificar fecha
                        if ((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24) {
                            fechaSolicitud.enable();
                            horaSolicitud.disable();
                            domicilio.disable();
                            justificacion.disable();
                            tipoOrdenServicio.disable();
                        } else {
                            fechaSolicitud.disable();
                            horaSolicitud.disable();
                            domicilio.disable();
                            justificacion.disable();
                            tipoOrdenServicio.disable();
                        }

                        if (haveAccess) {
                            if (isAgree) {
                                panel.down('toolbar #nextButton').setText('Siguiente');
                                panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                            } else {
                                //Editar
                            }
                        } else {
                            if (isAgree) {
                                panel.down('toolbar #nextButton').setText('Siguiente');
                                panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                            } else {
                                panel.down('toolbar #nextButton').setDisabled(true);
                            }
                        }
                    }
                },
                listeners: {
                    expand: function (panel, eOpts) {
                        panel.fillData(panel);
                    },
                    beforerender: function (panel, eOpts) {
                        panel.fillData(panel);
                    }
                },
                items: [
                    {
                        xtype: 'form',
                        itemId: 'e1f1',
                        bodyPadding: 15,
                        listeners: {
                            beforerender: function (panel, eOpts) {
                                //                                Ext.data.JsonP.request({
                                //                                    url: 'http://localhost:3000/form',
                                //                                    params: {},
                                //                                    success: function (result) {
                                //                                        panel.loadRecord(Ext.create('Ext.data.Model', result));
                                //                                    },
                                //                                    failure: function (result) {
                                //                                        Ext.Msg.alert('Failed', result.msg);
                                //                                    }
                                //                                });
                            }
                        },
                        items: [
                            {
                                xtype: 'datefield',
                                fieldLabel: 'Fecha',
                                itemId: 'fechaSolicitud',
                                name: 'fechaSolicitud',
                            },
                            {
                                xtype: 'timefield',
                                fieldLabel: 'Hora',
                                itemId: 'horaSolicitud',
                                name: 'horaSolicitud'
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Tipo de Orden',
                                itemId: 'tipoOrdenServicio',
                                name: 'tipoOrdenServicio',
                                width: '100%',
                                displayField: 'name',
                                valueField: 'name',
                                value: 'Operativo',
                                listeners: {
                                    change: function (field, newValue, oldValue, eOpts) {
                                        const almacen = field.up('form').items.getByKey('almacen');
                                        if (newValue === 'Movimiento por almacén') {
                                            almacen.show();
                                            almacen.getStore().load();
                                        } else {
                                            almacen.hide();
                                        }
                                    }
                                },
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name'],
                                    data: [
                                        { name: "Operativo" },
                                        { name: "Movimiento por almacén" },
                                    ]
                                })
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Almacén',
                                itemId: 'almacen',
                                name: 'claveAlmacen',
                                width: '100%',
                                queryMode: 'local',
                                minChars: 0,
                                displayField: 'ETIQUETA',
                                valueField: 'CLAVE_ALMACEN',
                                publishes: 'CLAVE_ALMACEN',
                                anyMatch: true,
                                emptyText: 'Cargando...',
                                hidden: true,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['area', 'idArea', 'idProyecto', 'proyecto'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAllAlmacen',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'subzona',
                                            //                                            totalProperty: 'total',
                                            successProperty: 'success'
                                            //                                            messageProperty: 'message'
                                        },
                                        extraParams: {
                                            idZona: login.credential.ID_ZONA,
                                            query: ''
                                        }
                                    },
                                    listeners: {
                                        load: function (thisStore, records, successful, operation, eOpts) {
                                            if (successful) {
                                                thisWin.down("#domicilio").setEmptyText('Seleccionar...');
                                            }
                                        }
                                    },
                                    autoLoad: false
                                })
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: 'Domicilio',
                                itemId: 'domicilio',
                                name: 'domicilio',
                                width: '100%',
                                queryMode: 'local',
                                minChars: 0,
                                displayField: 'DIRECCION',
                                valueField: 'DIRECCION',
                                publishes: 'DIRECCION',
                                anyMatch: true,
                                emptyText: 'Cargando...',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['area', 'idArea', 'idProyecto', 'proyecto'],
                                    proxy: {
                                        type: 'jsonp',
                                        url: serviceUrl + 'getAddress',
                                        reader: {
                                            type: 'json',
                                            rootProperty: 'direcciones',
                                            //                                            totalProperty: 'total',
                                            successProperty: 'success'
                                            //                                            messageProperty: 'message'
                                        }
                                    },
                                    listeners: {
                                        load: function (thisStore, records, successful, operation, eOpts) {
                                            if (successful) {
                                                thisWin.down("#domicilio").setEmptyText('Seleccionar...');
                                            }
                                        }
                                    },
                                    autoLoad: true
                                })
                            },
                            {
                                xtype: 'textareafield',
                                fieldLabel: 'Justificación',
                                itemId: 'justificacion',
                                name: 'justificacion',
                                width: '100%'
                            }
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e2').setVisible(true);
                            thisWin.getComponent('e2').expand();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {

                                var values = button.up('panel').getComponent('e1f1').getValues();
                                if (values.hasOwnProperty('fechaSolicitud') && Ext.Date.format(thisWin.recordBase.data.FECHA_SOLICITUD, 'd/m/Y') !== values.fechaSolicitud) {
                                    values.idOrdenServicio = thisWin.recordBase.data.ID_ORDEN_SERVICIO;
                                    Ext.data.JsonP.request({
                                        url: serviceUrl + 'updateOrdenServicioDate',
                                        params: values,
                                        success: function (result) {
                                            if (result.success) {
                                                button.next();
                                            } else {
                                                Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                            }
                                        },
                                        failure: function (result) {
                                            Ext.Msg.alert('Error', result.msg);
                                        }
                                    });
                                }
                                button.next();
                            } else {
                                var values = button.up('panel').getComponent('e1f1').getValues();
                                var date = Ext.Date.parse(values.fechaSolicitud + ' ' + values.horaSolicitud, 'd/m/Y g:i A');
                                delete values.fechaSolicitud;
                                delete values.horaSolicitud;
                                values.fechaSolicitud = date.toISOString();
                                values.idAutoridad = login.credential.ID_AUTORIDAD;
                                values.idCredencial = login.credential.ID_CREDENCIAL;
                                Ext.data.JsonP.request({
                                    url: serviceUrl + 'createOrdenServicio',
                                    params: values,
                                    success: function (result) {
                                        if (result.success) {
                                            thisWin.ordenServicio = result.ordenServicio;
                                            button.next();
                                        } else {
                                            Ext.Msg.alert('Error', 'No se pudo crear orden de servicio.');
                                        }
                                    },
                                    failure: function (result) {
                                        Ext.Msg.alert('Error', result.msg);
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e2',
                title: '[2] Servicios',
                layout: 'border',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 2;
                        var haveAccess = login.privilegios.f2;
                        if (newOrder) {
                            if (haveAccess) {
                                panel.getComponent('e2f1').setVisible(true);
                                panel.getComponent('e2f1').getComponent('e2f1s1').getComponent('ID_TIPO_SERVICIO').focus();
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        } else {
                            panel.getComponent('ID_PRESTADOR_SERVICIO').getStore().proxy.setExtraParam('idOrdenServicio', recordBase.data.ID_ORDEN_SERVICIO);
                            if (haveAccess) {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.getComponent('e2f1').setVisible(true);
                                    panel.getComponent('e2f1').getComponent('e2f1s1').getComponent('ID_TIPO_SERVICIO').focus();
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        }
                        panel.getComponent('ID_PRESTADOR_SERVICIO').getStore().reload();
                    }
                },
                items: [
                    {
                        xtype: 'form',
                        itemId: 'e2f1',
                        region: 'north',
                        layout: 'hbox',
                        hidden: true,
                        loadable: true,
                        items: [
                            {
                                xtype: 'fieldset',
                                itemId: 'e2f1s1',
                                defaultType: 'combobox',
                                layout: 'vbox',
                                border: false,
                                bodyPadding: 10,
                                items: [
                                    {
                                        itemId: 'ID_TIPO_SERVICIO',
                                        name: 'ID_TIPO_SERVICIO',
                                        fieldLabel: 'Tipo de Servicio',
                                        valueField: 'ID_TIPO_SERVICIO',
                                        displayField: 'TIPO',
                                        anchor: '-15',
                                        queryMode: 'remote',
                                        editable: false,
                                        reference: 'states',
                                        publishes: 'value',
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['ID_TIPO_SERVICIO', 'TIPO'],
                                            proxy: {
                                                type: 'jsonp',
                                                url: serviceUrl + 'getAllTipoServicio',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'tipoServicio'
                                                },
                                                extraParams: {
                                                    idZona: login.credential.ID_ZONA
                                                }
                                            }
                                        }),
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                //paso de parametros
                                                var subZona = combobox.up('fieldset').getComponent('ID_SUBZONA');
                                                subZona.store.proxy.setExtraParam('idZona', login.credential.ID_ZONA);
                                                subZona.setVisible(true);
                                                subZona.setDisabled(false);
                                                //marca para recarga
                                                subZona.reset();
                                                subZona.reload = true;
                                                subZona.focus();
                                            }
                                        }
                                    },
                                    {
                                        itemId: 'ID_SUBZONA',
                                        name: 'ID_SUBZONA',
                                        fieldLabel: 'SubZona',
                                        valueField: 'ID_SUBZONA',
                                        displayField: 'SUBZONA',
                                        anchor: '-15',
                                        queryMode: 'remote',
                                        disabled: true,
                                        editable: false,
                                        hidden: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['ID_SUBZONA', 'SUBZONA'],
                                            proxy: {
                                                type: 'jsonp',
                                                autoLoad: true,
                                                url: serviceUrl + 'getAllSubZona',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'subZona'
                                                }
                                            }
                                        }),
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                var idServicio = combobox.up('fieldset').getComponent('ID_SERVICIO');
                                                idServicio.store.proxy.setExtraParam('idSubZona', newValue);
                                                idServicio.store.proxy.setExtraParams({
                                                    idZona: login.credential.ID_ZONA,
                                                    idTipoServicio: combobox.up('fieldset').getComponent('ID_TIPO_SERVICIO').getValue(),
                                                    idSubZona: newValue
                                                });
                                                idServicio.setVisible(true);
                                                idServicio.setDisabled(false);
                                                //marca para recarga
                                                idServicio.reset();
                                                idServicio.reload = true;
                                                idServicio.focus();
                                            },
                                            expand: function (field, eOpts) {
                                                if (field.reload) {
                                                    field.getStore().reload();
                                                    field.reload = false;
                                                }
                                            }
                                        }
                                    },
                                    {
                                        itemId: 'ID_SERVICIO',
                                        name: 'ID_SERVICIO',
                                        fieldLabel: 'Servicio',
                                        valueField: 'ID_SERVICIO',
                                        displayField: 'NOMBRE_SERVICIO',
                                        anchor: '-15',
                                        queryMode: 'remote',
                                        disabled: true,
                                        editable: false,
                                        hidden: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['ID_SERVICIO', 'NOMBRE_SERVICIO'],
                                            proxy: {
                                                type: 'jsonp',
                                                autoLoad: true,
                                                url: serviceUrl + 'getAllServicios',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'servicios'
                                                }
                                            }
                                        }),
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                var idPrestadorServicio = combobox.up('fieldset').getComponent('ID_PRESTADOR_SERVICIO');
                                                idPrestadorServicio.store.proxy.setExtraParams({
                                                    idZona: login.credential.ID_ZONA,
                                                    idSubZona: combobox.up('fieldset').getComponent('ID_SUBZONA').getValue(),
                                                    idTipoServicio: combobox.up('fieldset').getComponent('ID_TIPO_SERVICIO').getValue(),
                                                    idServicio: newValue
                                                });
                                                idPrestadorServicio.setVisible(true);
                                                idPrestadorServicio.setDisabled(false);
                                                //marca para recarga
                                                idPrestadorServicio.reset();
                                                idPrestadorServicio.reload = true;
                                                idPrestadorServicio.focus();
                                            },
                                            expand: function (field, eOpts) {
                                                if (field.reload) {
                                                    field.getStore().reload();
                                                    field.reload = false;
                                                }
                                            }
                                        }
                                    },
                                    {
                                        itemId: 'ID_PRESTADOR_SERVICIO',
                                        name: 'ID_PRESTADOR_SERVICIO',
                                        fieldLabel: 'Prestador de Servicio',
                                        valueField: 'ID_PRESTADOR_SERVICIO',
                                        displayField: 'NOMBRE',
                                        anchor: '-15',
                                        queryMode: 'remote',
                                        disabled: true,
                                        editable: false,
                                        hidden: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['ID_PRESTADOR_SERVICIO', 'NOMBRE'],
                                            proxy: {
                                                type: 'jsonp',
                                                autoLoad: true,
                                                url: serviceUrl + 'getAllProvedores',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'provedores'
                                                }
                                            }
                                        }),
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                var idUnidad = combobox.up('fieldset').up('panel').getComponent('e2f1s2').getComponent('ID_UNIDAD');
                                                idUnidad.store.proxy.setExtraParams({
                                                    idTipoServicio: combobox.up('fieldset').getComponent('ID_TIPO_SERVICIO').getValue(),
                                                    idServicio: combobox.up('fieldset').getComponent('ID_SERVICIO').getValue()
                                                });
                                                idUnidad.setVisible(true);
                                                idUnidad.setDisabled(false);
                                                //marca para recarga
                                                idUnidad.reset();
                                                idUnidad.reload = true;
                                                idUnidad.focus();
                                            },
                                            expand: function (field, eOpts) {
                                                if (field.reload) {
                                                    field.getStore().reload();
                                                    field.reload = false;
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                itemId: 'e2f1s2',
                                defaultType: 'combobox',
                                layout: 'vbox',
                                border: false,
                                bodyPadding: 10,
                                items: [
                                    {
                                        itemId: 'ID_UNIDAD',
                                        name: 'ID_UNIDAD',
                                        fieldLabel: 'Unidad',
                                        valueField: 'ID_UNIDAD',
                                        displayField: 'UNIDAD',
                                        anchor: '-15',
                                        queryMode: 'remote',
                                        disabled: true,
                                        editable: false,
                                        hidden: true,
                                        store: Ext.create('Ext.data.Store', {
                                            fields: ['ID_UNIDAD', 'PRECIO_UNITARIO', 'UNIDAD'],
                                            proxy: {
                                                type: 'jsonp',
                                                url: serviceUrl + 'getUnidadYPrecioUnitarioXServicio',
                                                reader: {
                                                    type: 'json',
                                                    rootProperty: 'unidades'
                                                }
                                            }
                                        }),
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                combobox.up('fieldset').getComponent('costoUnitario').setVisible(true);
                                                combobox.up('fieldset').getComponent('total').setVisible(true);
                                                combobox.up('fieldset').getComponent('cantidad').setVisible(true);
                                                combobox.up('fieldset').getComponent('cantidad').setValue(1);
                                                //marca para recarga
                                                combobox.up('fieldset').getComponent('cantidad').reset();
                                                combobox.up('fieldset').getComponent('cantidad').reload = true;
                                                combobox.up('fieldset').getComponent('cantidad').focus();
                                            },
                                            expand: function (field, eOpts) {
                                                if (field.reload) {
                                                    field.getStore().reload();
                                                    field.reload = false;
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'numberfield',
                                        itemId: 'cantidad',
                                        name: 'cantidad',
                                        fieldLabel: 'Cantidad',
                                        hidden: true,
                                        value: 0,
                                        maxValue: 99,
                                        minValue: 0,
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                if (newValue > combobox.maxValue) {
                                                    combobox.setValue(combobox.maxValue);
                                                    combobox.up('form').down('toolbar #addService').setDisabled(true);
                                                } else if (newValue < combobox.minValue) {
                                                    combobox.setValue(combobox.minValue);
                                                    combobox.up('form').down('toolbar #addService').setDisabled(true);
                                                } else {
                                                    var value = combobox.up('fieldset').getComponent('ID_UNIDAD').getSelection();
                                                    var value = Ext.isEmpty(value) ? 0 : value.data.PRECIO_UNITARIO;
                                                    combobox.up('fieldset').getComponent('costoUnitario').setValue(value);
                                                    combobox.up('fieldset').getComponent('total').setValue(value * newValue);
                                                    if (newValue === combobox.minValue) {
                                                        combobox.up('form').down('toolbar #addService').setDisabled(true);
                                                    } else {
                                                        combobox.up('form').down('toolbar #addService').setDisabled(false);
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        itemId: 'costoUnitario',
                                        fieldLabel: 'Costo Unitario',
                                        hidden: true,
                                        renderer: Ext.util.Format.usMoney
                                    },
                                    {
                                        xtype: 'displayfield',
                                        itemId: 'total',
                                        fieldLabel: 'Total',
                                        labelStyle: 'font-weight:bold;',
                                        hidden: true,
                                        renderer: Ext.util.Format.usMoney
                                    }
                                ]
                            }
                        ],
                        serviceAddUpdate: function (button, service) {
                            var values = button.up('form').getValues();
                            var params = new Object();
                            params.idTipoServicio = values.ID_TIPO_SERVICIO;
                            params.idServicio = values.ID_SERVICIO;
                            params.idUnidad = values.ID_UNIDAD;
                            params.idSubZona = values.ID_SUBZONA;
                            params.idPestadorServicio = values.ID_PRESTADOR_SERVICIO;
                            if (service === 'updateServicio') {
                                params.idServicioCotizacion = thisWin.getComponent('e2').getComponent('ID_PRESTADOR_SERVICIO').getSelection()[0].data.ID_SERVICIO_COTIZACION;
                            } else {
                                params.idOrdenServicio = thisWin.ordenServicio.ID_ORDEN_SERVICIO;
                            }
                            params.cantidad = button.up('form').getComponent('e2f1s2').getComponent('cantidad').getValue();
                            params.precioUnitario = button.up('form').getComponent('e2f1s2').getComponent('costoUnitario').getValue();
                            params.cotizacion = button.up('form').getComponent('e2f1s2').getComponent('total').getValue();
                            params.idZona = login.credential.ID_ZONA;
                            Ext.data.JsonP.request({
                                url: serviceUrl + service,
                                params: params,
                                success: function (result) {
                                    if (result.success) {
                                        thisWin.getComponent('e2').getComponent('e2f1').reset();
                                        var gridPrestadorServicio = button.up('form').up('panel').getComponent('ID_PRESTADOR_SERVICIO');
                                        gridPrestadorServicio.store.proxy.setExtraParams({
                                            idOrdenServicio: thisWin.ordenServicio.ID_ORDEN_SERVICIO
                                        });
                                        gridPrestadorServicio.getStore().reload();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo ' + (service === 'updateServicio' ? 'actualizar' : 'crear') + ' orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        buttons: [
                            {
                                text: 'Actualizar Servicio',
                                itemId: 'updateService',
                                glyph: 'xf093@FontAwesome',
                                hidden: true,
                                handler: function (button) {
                                    button.up('form').serviceAddUpdate(button, 'updateServicio');
                                }
                            },
                            {
                                text: 'Añadir Servicio',
                                itemId: 'addService',
                                glyph: 'xf055@FontAwesome',
                                disabled: true,
                                handler: function (button) {
                                    button.up('form').serviceAddUpdate(button, 'addCotizacion');
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        itemId: 'ID_PRESTADOR_SERVICIO',
                        region: 'center',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            fields: ['ID_SERVICIO_COTIZACION', 'NOMBRE_SERVICIO', 'NOMBRE', 'ZONA', 'SUBZONA', 'COTIZACION'],
                            proxy: {
                                type: 'jsonp',
                                url: serviceUrl + 'getAllCotizacionXOrden',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'cotizaciones'
                                }
                            },
                            listeners: {
                                load: function (store, records, successful, operation, eOpts) {
                                    thisWin.getComponent('e2').getComponent('e2f1').down('toolbar #updateService').setVisible(false);
                                }
                            }
                        }),
                        columns: [
                            { text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1 },
                            { text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 2 },
                            { text: 'Prestador', dataIndex: 'NOMBRE', flex: 1 },
                            { text: 'ZONA', dataIndex: 'ZONA', flex: 1 },
                            { text: 'SubZona', dataIndex: 'SUBZONA', flex: 2 },
                            { text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney }
                        ],
                        listeners: {
                            itemclick: function (grid, record, item, index, e, eOpts) {
                                var newOrder = Ext.isEmpty(recordBase);
                                var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 2;
                                var haveAccess = login.privilegios.f2;
                                if (haveAccess && !isAgree) {
                                    var mask = new Ext.LoadMask({
                                        msg: 'Cargando valores...',
                                        target: thisWin.getComponent('e2').getComponent('e2f1')
                                    });
                                    mask.show();
                                    var thisForm = thisWin.getComponent('e2').getComponent('e2f1');
                                    thisForm.getComponent('e2f1s1').getComponent('ID_TIPO_SERVICIO').getStore().proxy.setExtraParam('query', '');
                                    thisForm.getComponent('e2f1s1').getComponent('ID_TIPO_SERVICIO').getStore().reload({
                                        callback: function (records, operation, success) {
                                            if (success) {
                                                thisForm.getComponent('e2f1s1').getComponent('ID_TIPO_SERVICIO').setValue(record.data.ID_TIPO_SERVICIO);
                                                thisForm.getComponent('e2f1s1').getComponent('ID_SUBZONA').getStore().proxy.setExtraParam('query', '');
                                                thisForm.getComponent('e2f1s1').getComponent('ID_SUBZONA').getStore().reload({
                                                    callback: function (records, operation, success) {
                                                        if (success) {
                                                            thisForm.getComponent('e2f1s1').getComponent('ID_SUBZONA').setValue(record.data.ID_SUBZONA);
                                                            thisForm.getComponent('e2f1s1').getComponent('ID_SERVICIO').getStore().proxy.setExtraParam('query', '');
                                                            thisForm.getComponent('e2f1s1').getComponent('ID_SERVICIO').getStore().reload({
                                                                callback: function (records, operation, success) {
                                                                    if (success) {
                                                                        thisForm.getComponent('e2f1s1').getComponent('ID_SERVICIO').setValue(record.data.ID_SERVICIO);
                                                                        thisForm.getComponent('e2f1s1').getComponent('ID_PRESTADOR_SERVICIO').getStore().proxy.setExtraParam('query', '');
                                                                        thisForm.getComponent('e2f1s1').getComponent('ID_PRESTADOR_SERVICIO').getStore().reload({
                                                                            callback: function (records, operation, success) {
                                                                                if (success) {
                                                                                    thisForm.getComponent('e2f1s1').getComponent('ID_PRESTADOR_SERVICIO').setValue(record.data.ID_PRESTADOR_SERVICIO);
                                                                                    thisForm.getComponent('e2f1s2').getComponent('ID_UNIDAD').getStore().proxy.setExtraParam('query', '');
                                                                                    thisForm.getComponent('e2f1s2').getComponent('ID_UNIDAD').getStore().reload({
                                                                                        callback: function (records, operation, success) {
                                                                                            if (success) {
                                                                                                thisForm.getComponent('e2f1s2').getComponent('ID_UNIDAD').setValue(record.data.ID_UNIDAD);
                                                                                                thisForm.getComponent('e2f1s2').getComponent('cantidad').setValue(record.data.CANTIDAD);
                                                                                                mask.destroy();
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                    thisForm.down('toolbar #updateService').setVisible(true);
                                }
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e3').setVisible(true);
                            thisWin.getComponent('e3').expand();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 2, button.next);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e3',
                title: '[3] Confirmación',
                layout: 'border',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 3;
                        var haveAccess = login.privilegios.f3;
                        if (newOrder) {
                            if (haveAccess) {
                                //editar
                                thisWin.getComponent('e3').getComponent('e3f1').setVisible(true);
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        } else {
                            panel.getComponent('serviceOrdersConfirm').getStore().proxy.setExtraParams({
                                idCredencial: recordBase.data.ID_CREDENCIAL,
                                idRol: recordBase.data.ID_ROL,
                                idAutoridad: recordBase.data.ID_AUTORIDAD,
                                idOrdenServicio: recordBase.data.ID_ORDEN_SERVICIO
                            });
                            if (haveAccess) {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    //Edit
                                    thisWin.getComponent('e3').getComponent('e3f1').setVisible(true);
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        }
                        panel.getComponent('serviceOrdersConfirm').getStore().reload();
                    }
                },
                items: [
                    {
                        xtype: 'form',
                        itemId: 'e3f1',
                        bodyPadding: 15,
                        region: 'north',
                        hidden: true,
                        items: [
                            {
                                xtype: 'label',
                                text: 'Firma Digital'
                            },
                            {
                                xtype: 'filefield',
                                itemId: 'cer',
                                fieldLabel: '.cer',
                                accept: '.cer'
                            },
                            {
                                xtype: 'filefield',
                                itemId: 'key',
                                fieldLabel: '.key',
                                accept: '.key'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'password',
                                fieldLabel: 'Contraseña',
                                emptyText: 'contraseña',
                                inputType: 'password',
                                allowBlank: false,
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            fielSign(field.up('form'), 1);
                                        }
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: 'Firmar',
                                glyph: 'xf084@FontAwesome',
                                itemId: 'signButtonConfirmaciones',
                                handler: function (button) {
                                    fielSign(button.up('form'), 1);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        itemId: 'serviceOrdersConfirm',
                        region: 'center',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            fields: ['FIRMA1_USERNAME1'],
                            proxy: {
                                type: 'jsonp',
                                url: serviceUrl + 'getSigns',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'signs'
                                }
                            },
                            listeners: {
                                load: function (store, records, successful, operation, eOpts) {
                                    //configura privilegios
                                    if (!Ext.isEmpty(records) && !Ext.isEmpty(records[0].data.FIRMA1_USERNAME1)) {
                                        //                                        Ext.ComponentQuery.query('toolbar #signButtonConfirmaciones', thisWin.getComponent('e3').getComponent('e3f1'))[0].setDisabled(true);
                                        thisWin.getComponent('e3').getComponent('e3f1').setVisible(false);
                                        thisWin.getComponent('e3').down('toolbar #nextButton').setVisible(true);
                                    } else {
                                        var visible = false;
                                        if (Ext.isEmpty(records) || (login.privilegios.f3.gen && Ext.isEmpty(records[0].data.FIRMA1_USERNAME1))) {
                                            visible = true;
                                        }
                                        thisWin.getComponent('e3').getComponent('e3f1').setVisible(visible);
                                    }
                                }
                            }
                        }),
                        columns: [
                            { text: 'Firma', dataIndex: 'FIRMA1_USERNAME1', flex: 1 }
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Aceptar',
                        glyph: 'xf058@FontAwesome',
                        itemId: 'nextButton',
                        hidden: true,
                        next: function () {
                            thisWin.getComponent('e4').setVisible(true);
                            thisWin.getComponent('e4').expand();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 3, button.next);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e4',
                title: '[4] Aviso de Servicios',
                layout: 'fit',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 4;
                        var haveAccess = login.privilegios.f4;
                        if (newOrder) {
                            if (haveAccess) {
                                //editar
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        } else {
                            panel.getComponent('serviceOrderNotice').getStore().proxy.setExtraParam('idOrdenServicio', recordBase.data.ID_ORDEN_SERVICIO);
                            if (haveAccess) {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    //Edit
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        }
                        panel.getComponent('serviceOrderNotice').getStore().reload();
                    }
                },
                items: [
                    {
                        xtype: 'gridpanel',
                        itemId: 'serviceOrderNotice',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            fields: ['ID_SERVICIO_COTIZACION', 'NOMBRE_SERVICIO', 'NOMBRE', 'COTIZACION', 'VALIDA_DISPONIBILIDAD'],
                            proxy: {
                                type: 'jsonp',
                                url: serviceUrl + 'getAllCotizacionXOrden',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'cotizaciones'
                                }
                            }
                        }),
                        columns: [
                            { text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1 },
                            { text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 3 },
                            { text: 'Prestador', dataIndex: 'NOMBRE', flex: 1 },
                            { text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney },
                            {
                                text: 'Disponibilidad', dataIndex: 'VALIDA_DISPONIBILIDAD', renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                    if (value === 0) {
                                        return "NO";
                                    } else {
                                        return "SI";
                                    }
                                }
                            }
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Generar Reporte',
                        glyph: 'xf15b@FontAwesome',
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=' + thisWin.ordenServicio.ID_ORDEN_SERVICIO + '&userName=' + login.credential.USUARIO_NOMBRE + '|' + login.credential.CARGO + '&eFirma=' + '&mensual=');
                        }
                    },
                    {
                        text: 'Enviar  E-Mail de Validacion',
                        itemId: 'nextButton',
                        glyph: 'xf0e0@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e5').setVisible(true);
                            thisWin.getComponent('e5').expand();
                            //                                    thisWin.getComponent('e5').getComponent('deduccionesGrid').getStore().reload();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                Ext.data.JsonP.request({
                                    url: serviceUrl + 'sendMailConfirmacionProvedor',
                                    params: {
                                        idOrdenServicio: thisWin.ordenServicio.ID_ORDEN_SERVICIO,
                                        idcredencialSolicitante: login.credential.ID_CREDENCIAL
                                    },
                                    success: function (result) {
                                        if (result.success) {
                                            thisWin.getComponent('e5').getComponent('deduccionesGrid').getStore().proxy.setExtraParams({
                                                idOrdenServicio: thisWin.ordenServicio.ID_ORDEN_SERVICIO
                                            });
                                            setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 4, button.next);
                                            //                                                button.up('panel');
                                            //                                                panel.loadRecord(Ext.create('Ext.data.Model', result));
                                        } else {
                                            Ext.Msg.alert('Error', 'No se envió el correo');
                                        }
                                    },
                                    failure: function (result) {
                                        Ext.Msg.alert('Error', result.msg);
                                    }
                                });
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e5',
                title: '[5] Ajustes/ Deducciones',
                layout: 'border',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 5;
                        var haveAccess = login.privilegios.f5;
                        if (newOrder) {
                            if (haveAccess) {
                                //editar
                                thisWin.getComponent('e5').getComponent('e5f1').setVisible(true);
                                thisWin.getComponent('e5').getComponent('e5f1').down('toolbar #guardarAjuste').setVisible(true);
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        } else {
                            panel.getComponent('deduccionesGrid').getStore().proxy.setExtraParam('idOrdenServicio', recordBase.data.ID_ORDEN_SERVICIO);
                            if (haveAccess) {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    //Editar
                                    thisWin.getComponent('e5').getComponent('e5f1').setVisible(true);
                                    thisWin.getComponent('e5').getComponent('e5f1').down('toolbar #guardarAjuste').setVisible(true);
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        }
                        panel.getComponent('deduccionesGrid').getStore().reload();
                    }
                },
                items: [
                    {
                        xtype: 'form',
                        itemId: 'e5f1',
                        hidden: true,
                        disabled: true,
                        bodyPadding: 10,
                        region: 'north',
                        layout: 'vbox',
                        flex: 2,
                        calculate: function () {
                            var values = this.getValues();
                            var total = parseInt(values.deduccionCantidad) * parseInt(values.deduccionTiempo) * parseInt(values.deduccion);
                            this.getComponent('totalSet').getComponent('total').setValue(total);
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                layout: 'hbox',
                                border: false,
                                items: [
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: 'Servicio ejercido',
                                        itemId: 'serviceDate',
                                        name: 'serviceDate',
                                        keyMapEnabled: true,
                                        margin: '0 10 0 0',
                                        labelWidth: 120,
                                        width: 230
                                    },
                                    {
                                        xtype: 'timefield',
                                        fieldLabel: 'Hora',
                                        itemId: 'serviceTime',
                                        name: 'serviceTime',
                                        margin: '0 10 0 20',
                                        labelWidth: 125,
                                        width: 230
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                defaultType: 'numberfield',
                                layout: 'hbox',
                                border: false,
                                items: [
                                    {
                                        itemId: 'deduccionCantidad',
                                        name: 'deduccionCantidad',
                                        fieldLabel: 'Cantidad',
                                        value: 0,
                                        maxValue: 99,
                                        minValue: 0,
                                        flex: 1,
                                        margin: '0 10 0 0',
                                        labelWidth: 120,
                                        width: 230,
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                if (newValue > combobox.maxValue) {
                                                    combobox.setValue(combobox.maxValue)
                                                } else if (newValue < combobox.minValue) {
                                                    combobox.setValue(combobox.minValue)
                                                } else {
                                                    combobox.up('form').calculate();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        itemId: 'deduccionTiempo',
                                        name: 'deduccionTiempo',
                                        fieldLabel: 'Tiempo',
                                        value: 0,
                                        maxValue: 6,
                                        minValue: 0,
                                        flex: 1,
                                        margin: '0 10 0 20',
                                        width: 230,
                                        labelWidth: 125,
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                if (newValue > combobox.maxValue) {
                                                    combobox.setValue(combobox.maxValue)
                                                } else if (newValue < combobox.minValue) {
                                                    combobox.setValue(combobox.minValue)
                                                } else {
                                                    var time = newValue * 30;
                                                    var unit = 'minutos';
                                                    if (time > 60) {
                                                        time /= 60;
                                                        unit = 'horas';
                                                    }
                                                    combobox.setFieldLabel('Tiempo (' + time + ' ' + unit + ')');
                                                    combobox.up('form').calculate();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        itemId: 'deduccion',
                                        name: 'deduccion',
                                        fieldLabel: 'Deducción',
                                        value: 500,
                                        maxValue: 1000,
                                        minValue: 0,
                                        flex: 1,
                                        margin: '0 10 0 20',
                                        labelWidth: 80,
                                        width: 160,
                                        listeners: {
                                            change: function (combobox, newValue, oldValue, eOpts) {
                                                if (newValue > combobox.maxValue) {
                                                    combobox.setValue(combobox.maxValue)
                                                } else if (newValue < combobox.minValue) {
                                                    combobox.setValue(combobox.minValue)
                                                } else {
                                                    combobox.up('form').calculate();
                                                }
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                xtype: 'fieldset',
                                itemId: 'totalSet',
                                defaultType: 'numberfield',
                                layout: 'hbox',
                                border: false,
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'checkboxfield',
                                        itemId: 'cancelacion',
                                        name: 'cancelacion',
                                        fieldLabel: 'Cancelación',
                                        inputValue: '1',
                                        uncheckedValue: '0',
                                        listeners: {
                                            change: function (check, newValue, oldValue, eOpts) {
                                                if (newValue) {
                                                    check.up('fieldset').getComponent('total').setValue(0);
                                                } else {
                                                    check.up('form').calculate();
                                                }
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'displayfield',
                                        itemId: 'total',
                                        fieldLabel: 'Total',
                                        margin: '0 0 0 50',
                                        labelStyle: 'font-weight:bold;',
                                        flex: 2,
                                        value: 0,
                                        renderer: Ext.util.Format.usMoney
                                    }
                                ]
                            },
                            {
                                xtype: 'textareafield',
                                itemId: 'deduccionJustificacion',
                                name: 'deduccionJustificacion',
                                fieldLabel: 'Justificación',
                                grow: true,
                                flex: 2,
                                width: '100%'
                            },
                            {
                                xtype: 'checkboxfield',
                                itemId: 'deduccionCumplimiento',
                                name: 'deduccionCumplimiento',
                                flex: 1,
                                boxLabel: 'SE RECIBE A ENTERA SATIFACCIÓN EL SERVICIO PROPORCIONADO POR EL PROVEEDOR, DE ACUERDO A LO REQUERIDO.',
                                inputValue: '1',
                                uncheckedValue: '0'
                            },
                            {
                                xtype: 'checkboxfield',
                                itemId: 'deduccionIdentificado',
                                name: 'deduccionIdentificado',
                                flex: 1,
                                boxLabel: 'LOS ESTRIBADORES SE PRESENTARON CON GAFETE Y UNIFORME.',
                                inputValue: '1',
                                uncheckedValue: '0'
                            }
                        ],
                        buttons: [
                            {
                                text: 'Guardar Ajuste',
                                itemId: 'guardarAjuste',
                                hidden: true,
                                glyph: 'xf0c7@FontAwesome',
                                handler: function (button) {
                                    var vals = button.up('form').getValues();
                                    vals.idOrdenServicio = thisWin.ordenServicio.ID_ORDEN_SERVICIO;
                                    vals.idServicioCotizacion = button.up('form').up('panel').getComponent('deduccionesGrid').getSelection()[0].data.ID_SERVICIO_COTIZACION;
                                    vals.deduccion = button.up('form').down('displayfield[itemId="total"]').getValue();
                                    var serviceDate = Ext.Date.parse(vals.serviceDate + ' ' + vals.serviceTime, 'd/m/Y g:i A');
                                    delete vals.serviceTime;
                                    vals.serviceDate = serviceDate.toISOString();
                                    Ext.data.JsonP.request({
                                        url: serviceUrl + 'setDeduccionCotizacion',
                                        params: vals,
                                        success: function (result) {
                                            if (result.success) {
                                                thisWin.getComponent('e5').getComponent('e5f1').reset();
                                                button.up('form').up('panel').getComponent('deduccionesGrid').getStore().reload();
                                            } else {
                                                Ext.Msg.alert('Error', 'No se pudo crear orden de servicio.');
                                            }
                                        },
                                        failure: function (result) {
                                            Ext.Msg.alert('Error', result.msg);
                                        }
                                    });
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        itemId: 'deduccionesGrid',
                        region: 'center',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            fields: ['ID_SERVICIO_COTIZACION', 'NOMBRE_SERVICIO', 'NOMBRE', 'COTIZACION', 'DEDUCCION', 'PRECIO_SERVICIO_FINAL'],
                            proxy: {
                                type: 'jsonp',
                                url: serviceUrl + 'getAllCotizacionXOrden',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'cotizaciones'
                                }
                            },
                            listeners: {
                                load: function (store, records, successful, operation, eOpts) {
                                    thisWin.getComponent('e5').getComponent('e5f1').setDisabled(true);
                                }
                            }
                        }),
                        columns: [
                            { text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1 },
                            { text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 3 },
                            { text: 'Prestador', dataIndex: 'NOMBRE', flex: 1 },
                            { text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney },
                            { text: 'Deducción', dataIndex: 'DEDUCCION', flex: 1, renderer: Ext.util.Format.usMoney },
                            { text: 'Precio Final', dataIndex: 'PRECIO_SERVICIO_FINAL', flex: 1, renderer: Ext.util.Format.usMoney }
                        ],
                        listeners: {
                            itemclick: function (grid, record, item, index, e, eOpts) {
                                var deduction = record.data.DEDUCCION / (record.data.DEDUCCION_CANTIDAD * record.data.DEDUCCION_TIEMPO);
                                var serviceDate = record.data.FECHA_SERVICIO;
                                thisForm = thisWin.getComponent('e5').getComponent('e5f1');
                                thisForm.setDisabled(false);
                                thisForm.down('#deduccionCantidad').setValue(record.data.DEDUCCION_CANTIDAD);
                                thisForm.down('#deduccionTiempo').setValue(record.data.DEDUCCION_TIEMPO);
                                thisForm.down('#deduccion').setValue(isNaN(deduction) ? 0 : deduction);
                                thisForm.down('#cancelacion').setValue(record.data.CANCELACION);
                                thisForm.down('#deduccionJustificacion').setValue(record.data.DEDUCCION_JUSTIFICACION);
                                thisForm.down('#deduccionCumplimiento').setValue(record.data.CUMPLIMIENTO);
                                thisForm.down('#deduccionIdentificado').setValue(record.data.IDENTIFICADO);
                                thisForm.down('#serviceDate').setValue(Ext.isEmpty(serviceDate) ? new Date() : new Date(serviceDate));
                                thisForm.down('#serviceTime').setValue(Ext.isEmpty(serviceDate) ? new Date() : new Date(serviceDate));
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e6').setVisible(true);
                            thisWin.getComponent('e6').expand();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 5, button.next, new Date().toISOString());
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e6',
                title: '[6] Confirmacion Prefacturacion',
                layout: 'border',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 6;
                        var haveAccess = login.privilegios.f6;
                        if (newOrder) {
                            if (haveAccess) {
                                //editar
                                thisWin.getComponent('e6').getComponent('e6f1').setVisible(true);
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        } else {
                            panel.getComponent('serviceOrders').getStore().proxy.setExtraParams({
                                idCredencial: recordBase.data.ID_CREDENCIAL,
                                idRol: recordBase.data.ID_ROL,
                                idAutoridad: recordBase.data.ID_AUTORIDAD,
                                idOrdenServicio: recordBase.data.ID_ORDEN_SERVICIO
                            });
                            if (haveAccess) {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    //editar
                                    thisWin.getComponent('e6').getComponent('e6f1').setVisible(true);
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.down('toolbar #nextButton').setDisabled(true);
                                }
                            }
                        }
                        panel.getComponent('serviceOrders').getStore().reload();
                    }
                },
                items: [
                    {
                        xtype: 'form',
                        itemId: 'e6f1',
                        bodyPadding: 15,
                        region: 'north',
                        hidden: true,
                        items: [
                            {
                                xtype: 'label',
                                text: 'Firma Digital'
                            },
                            {
                                xtype: 'filefield',
                                itemId: 'cer',
                                fieldLabel: '.cer',
                                accept: '.cer'
                            },
                            {
                                xtype: 'filefield',
                                itemId: 'key',
                                fieldLabel: '.key',
                                accept: '.key'
                            },
                            {
                                xtype: 'textfield',
                                itemId: 'password',
                                fieldLabel: 'Contraseña',
                                emptyText: 'contraseña',
                                inputType: 'password',
                                allowBlank: false,
                                listeners: {
                                    specialkey: function (field, e) {
                                        if (e.getKey() == e.ENTER) {
                                            fielSign(field.up('form'), 2);
                                        }
                                    }
                                }
                            }
                        ],
                        buttons: [
                            {
                                text: 'Firmar',
                                glyph: 'xf084@FontAwesome',
                                itemId: 'signButtonPrefacturacion',
                                handler: function (button) {
                                    fielSign(button.up('form'), 2);
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'gridpanel',
                        itemId: 'serviceOrders',
                        region: 'center',
                        store: Ext.create('Ext.data.Store', {
                            autoLoad: false,
                            fields: ['FIRMA2_USERNAME1', 'FIRMA2_USERNAME2'],
                            proxy: {
                                type: 'jsonp',
                                url: serviceUrl + 'getSigns',
                                reader: {
                                    type: 'json',
                                    rootProperty: 'signs'
                                }
                            },
                            listeners: {
                                load: function (store, records, successful, operation, eOpts) {
                                    //configura privilegios
                                    if (!Ext.isEmpty(records) && !Ext.isEmpty(records[0].data.FIRMA2_USERNAME1) && !Ext.isEmpty(records[0].data.FIRMA2_USERNAME2)) {
                                        //                                        Ext.ComponentQuery.query('toolbar #signButtonPrefacturacion', thisWin.getComponent('e6').getComponent('e6f1'))[0].setDisabled(true);
                                        thisWin.getComponent('e6').getComponent('e6f1').setVisible(false);
                                        thisWin.getComponent('e6').down('toolbar #nextButton').setVisible(true);
                                    } else {
                                        var visible = false;
                                        if (Ext.isEmpty(records) || (login.privilegios.f6.gen && Ext.isEmpty(records[0].data.FIRMA2_USERNAME1) ||
                                            login.privilegios.f6.rev && Ext.isEmpty(records[0].data.FIRMA2_USERNAME2))) {
                                            visible = true;
                                        }
                                        thisWin.getComponent('e6').getComponent('e6f1').setVisible(visible);
                                    }
                                }
                            }
                        }),
                        columns: [
                            { text: 'Firma1', dataIndex: 'FIRMA2_USERNAME1', flex: 1 },
                            { text: 'Firma2', dataIndex: 'FIRMA2_USERNAME2', flex: 1 }
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        hidden: true,
                        next: function () {
                            thisWin.getComponent('e7').setVisible(true);
                            thisWin.getComponent('e7').expand();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 6, button.next);
                            }
                        }
                    }
                ]
            },
            {
                xtype: 'panel',
                itemId: 'e7',
                title: '[7] Prefactura',
                layout: 'center',
                hidden: true,
                listeners: {
                    expand: function (panel, eOpts) {
                        var newOrder = Ext.isEmpty(recordBase);
                        var isAgree = !newOrder && parseInt(recordBase.data.ID_STATUS) >= 7;
                        var haveAccess = login.privilegios.f7;
                        if (newOrder) {
                            if (haveAccess) {
                                //editar
                                panel.getComponent('nextButton').setText('Generar Orden de Servicio');
                                panel.getComponent('nextButton').setGlyph('xf15b@FontAwesome');
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                }
                            }
                        } else {
                            if (haveAccess) {
                                panel.getComponent('nextButton').setText('Generar Orden de Servicio');
                                panel.getComponent('nextButton').setGlyph('xf15b@FontAwesome');
                                if (isAgree) {
                                } else {
                                    //editar
                                }
                            } else {
                                if (isAgree) {
                                    panel.down('toolbar #nextButton').setText('Siguiente');
                                    panel.down('toolbar #nextButton').setGlyph('xf0a9@FontAwesome');
                                } else {
                                    panel.getComponent('nextButton').setText('Cerrar');
                                    panel.getComponent('nextButton').setGlyph('xf00d@FontAwesome');
                                }
                            }
                        }
                    }
                },
                items: [
                    {
                        text: 'Cancelar',
                        itemId: 'cancelButton',
                        glyph: 'xf05e@FontAwesome',
                        hidden: true,
                        handler: function (thisbutton) {
                            var values = {
                                idOrdenServicio: thisbutton.up('window').recordBase.data.ID_ORDEN_SERVICIO
                            };
                            Ext.data.JsonP.request({
                                url: serviceUrl + 'updateOrdenServicioCancelado',
                                params: values,
                                success: function (result) {
                                    if (result.success) {
                                        thisbutton.next();
                                    } else {
                                        Ext.Msg.alert('Error', 'No se pudo actualizar orden de servicio.');
                                    }
                                },
                                failure: function (result) {
                                    Ext.Msg.alert('Error', result.msg);
                                }
                            });
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                if (!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 0) {
                                    thisbutton.setHidden(!((recordBase.data.ID_ROL === 2 || recordBase.data.ID_ROL === 3) && recordBase.data.CHECK24 < 24));
                                }
                            }
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'nextButton',
                        text: 'Cerrar',
                        glyph: 'xf15b@FontAwesome',
                        region: 'center',
                        next: function () {
                            if (thisWin.getComponent('e7').getComponent('nextButton').getText() === 'Generar Orden de Servicio') {
                                window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=' + thisWin.ordenServicio.ID_ORDEN_SERVICIO + '&userName=' + login.credential.USUARIO_NOMBRE + '|' + login.credential.CARGO + '&eFirma=' + '&mensual=');
                            }
                            thisWin.close();
                        },
                        listeners: {
                            beforerender: function (thisbutton) {
                                var recordBase = thisbutton.up('window').recordBase;
                                thisbutton.setHidden(!Ext.isEmpty(recordBase) && recordBase.data.CANCELADO === 1);
                            }
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente' || button.getText() === 'Cerrar') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 7, button.next);
                            }
                        }
                    }
                ]
            }
        ]

    });
    var setStatusServiceOrder = function (idOrdenServicio, idStatus, callback, extraParams) {
        Ext.data.JsonP.request({
            url: serviceUrl + 'setStatusOrdenServicio',
            params: {
                idOrdenServicio: idOrdenServicio,
                idStatus: idStatus,
                extraParams: extraParams
            },
            success: function (result) {
                if (result.success) {
                    callback();
                } else {
                    Ext.Msg.alert('Error', 'No se pudo actualizar el estado de la orden de servicio');
                }
            },
            failure: function (result) {
                Ext.Msg.alert('Error', result.msg);
            }
        });
    }

    thisWin.show();
};

var initComponent = function () {
    login.show();
};