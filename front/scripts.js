/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */




var launchWindow = function () {


    Ext.create('Ext.window.Window', {
        title: 'Hello',
        height: 400,
        width: 600,
        modal: true,
        autoScroll: true,
        layout: 'accordion',
        items: [
        {
            xtype: 'panel',
            height: 193,
            title: '[1] Informacion de Orden de servicio',
            items:[
                {
                    xtype: 'datefield',
                    fieldLabel: 'Fecha'
                },
                {
                    xtype: 'timefield',
                    fieldLabel: 'Hora'
                }
            ]
            
        },
        {
            xtype: 'panel',
            layout: 'border',
            title: '[2] Servicios',
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    height: 150,
                    margin: '',
                    title: '',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Campo 1'
                        },
                        {
                            xtype: 'button',
                            text: 'Añadir Servicio'
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    region: 'center',
                    title: '',
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'string',
                            text: 'String'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'number',
                            text: 'Number'
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'date',
                            text: 'Date'
                        },
                        {
                            xtype: 'booleancolumn',
                            dataIndex: 'bool',
                            text: 'Boolean'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            width: 100,
            title: '[3] Confirmaciones',
            items: [
                {
                    xtype: 'panel',
                    margin: '',
                    title: '',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '',
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Firma Generador'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.cer'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.key'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Firmar'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '',
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Firma Generador Jefe'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.key'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.cer'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Firmar'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            title: '[4] Aviso de Servicios',
            items: [
                {
                    xtype: 'gridpanel',
                    title: '',
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'string',
                            text: 'String'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'number',
                            text: 'Number'
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'date',
                            text: 'Date'
                        },
                        {
                            xtype: 'booleancolumn',
                            dataIndex: 'bool',
                            text: 'Boolean'
                        }
                    ],
                    dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'top',
                            items: [
                                {
                                    xtype: 'button',
                                    text: 'Aenviar  E-Mail de Validacion'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            layout: 'border',
            title: '[5] Ajustes/ Deducciones',
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    height: 150,
                    margin: '',
                    title: '',
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Campo1'
                        },
                        {
                            xtype: 'button',
                            text: 'Guardar Ajuste'
                        }
                    ]
                },
                {
                    xtype: 'gridpanel',
                    region: 'center',
                    title: '',
                    columns: [
                        {
                            xtype: 'gridcolumn',
                            dataIndex: 'string',
                            text: 'String'
                        },
                        {
                            xtype: 'numbercolumn',
                            dataIndex: 'number',
                            text: 'Number'
                        },
                        {
                            xtype: 'datecolumn',
                            dataIndex: 'date',
                            text: 'Date'
                        },
                        {
                            xtype: 'booleancolumn',
                            dataIndex: 'bool',
                            text: 'Boolean'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'panel',
            width: 100,
            title: '[6] Confirmacion Prefacturacion',
            items: [
                {
                    xtype: 'panel',
                    margin: '',
                    title: '',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '',
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Firma Generador'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.cer'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.key'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Firmar'
                                }
                            ]
                        },
                        {
                            xtype: 'fieldset',
                            title: '',
                            items: [
                                {
                                    xtype: 'label',
                                    text: 'Firma Generador Jefe'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.key'
                                },
                                {
                                    xtype: 'filefield',
                                    fieldLabel: '.cer'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Firmar'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]

    }).show();

};






var initComponent = function () {
    Ext.onReady(function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: 'border',
                    //title: 'Ordenes de Servicio',
                    colspan: 3,
                    items: [
                        {
                            xtype: 'panel',
                            region: 'north',
                            title: 'Busqueda de Ordenes de Servicio',
                            height: 300,
                            collapsed: true,
                            collapsible: true
                        },
                        {
                            xtype: 'gridpanel',
                            region: 'center',
                            title: 'Ordenes de Servicio',
                            height: 500,
                            collapsed: false,
                            collapsible: true,
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'string',
                                    text: 'String'
                                },
                                {
                                    xtype: 'numbercolumn',
                                    dataIndex: 'number',
                                    text: 'Number'
                                },
                                {
                                    xtype: 'datecolumn',
                                    dataIndex: 'date',
                                    text: 'Date'
                                },
                                {
                                    xtype: 'booleancolumn',
                                    dataIndex: 'bool',
                                    text: 'Boolean'
                                }
                            ],
                            dockedItems: [
                                {
                                    xtype: 'toolbar',
                                    dock: 'top',
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Nueva Orden de Servicio',
                                            handler: function () {
                                                launchWindow();

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
initComponent();