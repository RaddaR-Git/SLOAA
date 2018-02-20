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
                                Ext.Msg.alert('Failed', result.msg);
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
var createViewport = function () {
    Ext.onReady(function () {
        Ext.create('Ext.container.Viewport', {
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
                                            xtype: 'combobox',
                                            itemId: 'ID_STATUS',
                                            name: 'ID_STATUS',
                                            fieldLabel: 'Estado de Orden',
                                            valueField: 'ID_STATUS',
                                            displayField: 'NOMBRE_STATUS',
                                            margin: '0 0 5 10'
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
                                                                filters.push({property: key, value: value, operator: '/='});
                                                                break;
                                                            case 'ID_STATUS':
                                                                filters.push({property: key, value: value, operator: '='});
                                                                break;
                                                            default:
                                                                dateFilter[key] = value;
                                                                break;
                                                        }
                                                    }
                                                });
                                                if (!Ext.isEmpty(dateFilter)) {
                                                    filters.push({property: 'FECHA_SOLICITUD', filterFn: function (item) {
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
                                    launchWindow(record);
                                }
                            },
                            store: Ext.create('Ext.data.Store', {
                                autoLoad: true,
                                fields: [
                                    {name: 'ID_ORDEN_SERVICIO', type: 'int'},
                                    {name: 'FECHA_SOLICITUD', type: 'date'},
                                    {name: 'DOMICILIO', type: 'string'},
                                    {name: 'NOMBRE', type: 'string'},
                                    {name: 'CARGO', type: 'string'},
                                    {name: 'NOMBRE_AUTORIDAD', type: 'string'},
                                    {name: 'NIVEL', type: 'string'},
                                    {name: 'SERVICIO', type: 'string'},
                                    {name: 'NOMBRE_STATUS', type: 'string'}
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
                                        idAutoridad: login.credential.idAutoridad
                                    }
                                },
                                listeners: {
                                    load: function (store, records, successful, operation, eOpts) {
                                        var map = new Array();
                                        var data = new Array();
                                        var record;
                                        records.forEach(function (item) {
                                            if (!map.includes(item.data.ID_STATUS)) {
                                                record = new Object();
                                                record.ID_STATUS = item.data.ID_STATUS;
                                                record.NOMBRE_STATUS = item.data.NOMBRE_STATUS;
                                                map.push(record.ID_STATUS);
                                                data.push(record);
                                            }
                                        });
                                        Ext.getCmp('serviceOrdersFilter').getComponent('ID_STATUS').setStore(Ext.create('Ext.data.Store', {
                                            fields: ['ID_STATUS', 'NOMBRE_STATUS'],
                                            data: data
                                        }));
                                    }},
                                sorters: []
                            }),
                            columns: [
                                {text: 'ID', dataIndex: 'ID_ORDEN_SERVICIO', flex: 1, filter: 'number'},
                                {text: 'Fecha', dataIndex: 'FECHA_SOLICITUD', xtype: 'datecolumn', flex: 2, format: 'd/m/Y g:i A', filter: 'date'},
                                {text: 'Domicilio', dataIndex: 'DOMICILIO', flex: 4, filter: 'string'},
                                {text: 'Nombre', dataIndex: 'NOMBRE', flex: 2, filter: 'string'},
                                {text: 'Cargo', dataIndex: 'CARGO', flex: 2, filter: 'string'},
                                {text: 'Autoridad', dataIndex: 'NOMBRE_AUTORIDAD', flex: 2, filter: 'string'},
                                {text: 'Nivel', dataIndex: 'NIVEL', flex: 1, filter: 'string'},
                                {text: 'Servicio', dataIndex: 'SERVICIO', flex: 2, filter: 'string'},
                                {text: 'Estado', dataIndex: 'NOMBRE_STATUS', flex: 2, filter: 'string'},
                                {
                                    xtype: 'actioncolumn',
                                    width: 50,
                                    items: [
                                        {
                                            iconCls: 'pictos pictos-info',
                                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                                launchWindow(record);
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
                                                launchWindow();
                                            }
                                        },
                                        {
                                            text: 'Generar Reporte',
                                            glyph: 'xf15b@FontAwesome',
                                            handler: function (button) {
                                                window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=&mensual=1');
                                            }
                                        },
                                        {
                                            text: 'Actualizar',
                                            glyph: 'xf021@FontAwesome',
                                            handler: function (button) {
                                                Ext.getCmp('serviceOrdersGrid').getStore().reload();
                                            }
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
var launchWindow = function (recordBase) {
    var thisWin = Ext.create('Ext.window.Window', {
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
                        //llena formulario
                        thisWin.ordenServicio = recordBase.data;
                        panel.getComponent('e1f1').getComponent('fechaSolicitud').setValue(recordBase.data.FECHA_SOLICITUD);
                        panel.getComponent('e1f1').getComponent('horaSolicitud').setValue(recordBase.data.FECHA_SOLICITUD);
                        panel.getComponent('e1f1').getComponent('domicilio').setValue(recordBase.data.DOMICILIO);
                        panel.getComponent('e1f1').getComponent('justificacion').setValue(recordBase.data.JUSTIFICACION);
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
                                name: 'horaSolicitud',
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Domicilio',
                                itemId: 'domicilio',
                                name: 'domicilio',
                                width: '100%'
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
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e2').setVisible(true);
                            thisWin.getComponent('e2').expand();
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
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
                                        Ext.Msg.alert('Failed', result.msg);
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
                                    Ext.Msg.alert('Failed', result.msg);
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
                            {text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1},
                            {text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 2},
                            {text: 'Prestador', dataIndex: 'NOMBRE', flex: 1},
                            {text: 'ZONA', dataIndex: 'ZONA', flex: 1},
                            {text: 'SubZona', dataIndex: 'SUBZONA', flex: 2},
                            {text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney}
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
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e3').setVisible(true);
                            thisWin.getComponent('e3').expand();
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
                title: '[3] Confirmaciones',
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
                            fields: ['FIRMA1_USERNAME1', 'FIRMA1_USERNAME2'],
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
                                    if (!Ext.isEmpty(records) && !Ext.isEmpty(records[0].data.FIRMA1_USERNAME1) && !Ext.isEmpty(records[0].data.FIRMA1_USERNAME2)) {
//                                        Ext.ComponentQuery.query('toolbar #signButtonConfirmaciones', thisWin.getComponent('e3').getComponent('e3f1'))[0].setDisabled(true);
                                        thisWin.getComponent('e3').getComponent('e3f1').setVisible(false);
                                        thisWin.getComponent('e3').down('toolbar #nextButton').setVisible(true);
                                    } else {
                                        var visible = false;
                                        if (Ext.isEmpty(records) || (login.privilegios.f3.gen && Ext.isEmpty(records[0].data.FIRMA1_USERNAME1) ||
                                                login.privilegios.f3.rev && Ext.isEmpty(records[0].data.FIRMA1_USERNAME2))) {
                                            visible = true;
                                        }
                                        thisWin.getComponent('e3').getComponent('e3f1').setVisible(visible);
                                    }
                                }
                            }
                        }),
                        columns: [
                            {text: 'Firma1', dataIndex: 'FIRMA1_USERNAME1', flex: 1},
                            {text: 'Firma2', dataIndex: 'FIRMA1_USERNAME2', flex: 1}
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Aceptar',
                        glyph: 'xf058@FontAwesome',
                        itemId: 'nextButton',
                        hidden: true,
                        next: function () {
                            thisWin.getComponent('e4').setVisible(true);
                            thisWin.getComponent('e4').expand();
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
                            {text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1},
                            {text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 3},
                            {text: 'Prestador', dataIndex: 'NOMBRE', flex: 1},
                            {text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney},
                            {text: 'Disponibilidad', dataIndex: 'VALIDA_DISPONIBILIDAD', renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                                    if (value === 0) {
                                        return "NO";
                                    } else {
                                        return "SI";
                                    }
                                }}
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Generar Reporte',
                        glyph: 'xf15b@FontAwesome',
                        handler: function (button) {
                            window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=' + thisWin.ordenServicio.ID_ORDEN_SERVICIO + '&mensual=1');
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
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                Ext.data.JsonP.request({
                                    url: serviceUrl + 'sendMailConfirmacionProvedor',
                                    params: {
                                        idOrdenServicio: thisWin.ordenServicio.ID_ORDEN_SERVICIO
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
                                        Ext.Msg.alert('Failed', result.msg);
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
                        flex: 1,
                        calculate: function () {
                            var values = this.getValues();
                            var total = parseInt(values.deduccionCantidad) * parseInt(values.deduccionTiempo) * parseInt(values.deduccion);
                            this.getComponent('totalSet').getComponent('total').setValue(total);
                        },
                        items: [
                            {
                                xtype: 'fieldset',
                                defaultType: 'numberfield',
                                layout: 'hbox',
                                border: false,
                                items: [
                                    {
                                        itemId: 'deduccionCantidad',
                                        reference: 'hola',
                                        name: 'deduccionCantidad',
                                        fieldLabel: 'Cantidad',
                                        value: 0,
                                        maxValue: 99,
                                        minValue: 0,
                                        flex: 1,
                                        margin: '0 10 0 0',
                                        width: 200,
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
                                        margin: '0 10 0 0',
                                        width: 200,
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
                                        margin: '0 10 0 0',
                                        width: 200,
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
                                    var values = button.up('form').getValues();
                                    values.idOrdenServicio = thisWin.ordenServicio.ID_ORDEN_SERVICIO;
                                    values.idServicioCotizacion = button.up('form').up('panel').getComponent('deduccionesGrid').getSelection()[0].data.ID_SERVICIO_COTIZACION;
                                    Ext.data.JsonP.request({
                                        url: serviceUrl + 'setDeduccionCotizacion',
                                        params: values,
                                        success: function (result) {
                                            if (result.success) {
                                                thisWin.getComponent('e5').getComponent('e5f1').reset();
                                                button.up('form').up('panel').getComponent('deduccionesGrid').getStore().reload();
                                            } else {
                                                Ext.Msg.alert('Error', 'No se pudo crear orden de servicio.');
                                            }
                                        },
                                        failure: function (result) {
                                            Ext.Msg.alert('Failed', result.msg);
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
                            {text: 'Cotización', dataIndex: 'ID_SERVICIO_COTIZACION', flex: 1},
                            {text: 'Servicio', dataIndex: 'NOMBRE_SERVICIO', flex: 3},
                            {text: 'Prestador', dataIndex: 'NOMBRE', flex: 1},
                            {text: 'Cotización', dataIndex: 'COTIZACION', flex: 1, renderer: Ext.util.Format.usMoney},
                            {text: 'Deducción', dataIndex: 'DEDUCCION', flex: 1, renderer: Ext.util.Format.usMoney},
                            {text: 'Precio Final', dataIndex: 'PRECIO_SERVICIO_FINAL', flex: 1, renderer: Ext.util.Format.usMoney}
                        ],
                        listeners: {
                            itemclick: function (grid, record, item, index, e, eOpts) {
                                var thisForm = thisWin.getComponent('e5').getComponent('e5f1');
                                thisForm.setDisabled(false);
//                                thisForm.down('#deduccionCantidad').setValue(record.data.CANTIDAD);
//                                thisForm.down('#deduccionTiempo').setValue(-1);
//                                thisForm.down('#deduccion').setValue(record.data.DEDUCCION);
//                                thisForm.down('#deduccionJustificacion').setValue(record.data.DEDUCCION_JUSTIFICACION);
                            }
                        }
                    }
                ],
                buttons: [
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        next: function () {
                            thisWin.getComponent('e6').setVisible(true);
                            thisWin.getComponent('e6').expand();
                        },
                        handler: function (button) {
                            if (button.getText() === 'Siguiente') {
                                button.next();
                            } else {
                                setStatusServiceOrder(thisWin.ordenServicio.ID_ORDEN_SERVICIO, 5, button.next);
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
                            {text: 'Firma1', dataIndex: 'FIRMA2_USERNAME1', flex: 1},
                            {text: 'Firma2', dataIndex: 'FIRMA2_USERNAME2', flex: 1}
                        ]
                    }
                ],
                buttons: [
                    {
                        text: 'Aceptar',
                        itemId: 'nextButton',
                        glyph: 'xf058@FontAwesome',
                        hidden: true,
                        next: function () {
                            thisWin.getComponent('e7').setVisible(true);
                            thisWin.getComponent('e7').expand();
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
                        xtype: 'button',
                        itemId: 'nextButton',
                        text: 'Cerrar',
                        glyph: 'xf15b@FontAwesome',
                        region: 'center',
                        next: function () {
                            if (thisWin.getComponent('e7').getComponent('nextButton').getText() === 'Generar Orden de Servicio') {
                                window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=' + thisWin.ordenServicio.ID_ORDEN_SERVICIO + '&mensual=');
                            }
                            thisWin.close();
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
    var setStatusServiceOrder = function (idOrdenServicio, idStatus, callback) {
        Ext.data.JsonP.request({
            url: serviceUrl + 'setStatusOrdenServicio',
            params: {
                idOrdenServicio: idOrdenServicio,
                idStatus: idStatus
            },
            success: function (result) {
                if (result.success) {
                    callback();
                } else {
                    Ext.Msg.alert('Error', 'No se pudo actualizar el estado de la orden de servicio');
                }
            },
            failure: function (result) {
                Ext.Msg.alert('Failed', result.msg);
            }
        });
    }

    thisWin.show();
};
var initComponent = function () {
    login.show();
};
