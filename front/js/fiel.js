var fielSign = function (form, firmaStep, button) {

    var signMask = new Ext.LoadMask({
        msg: 'Firmando Orden...',
        target: form
    });
    signMask.show();

    var fileCertificado = form.getComponent('cer').fileInputEl.dom;
    var fileLlavePrivada = form.getComponent('key').fileInputEl.dom;
    var contrasena = form.getComponent('password').inputEl.dom;
    var compatibilidad = PKI.SAT.FielUtil.validaNavegador();
    if (compatibilidad === true) {
        PKI.SAT.FielUtil.validaFielyFirmaCadena(
                fileCertificado,
                fileLlavePrivada,
                contrasena,
                function (certificado) {
                    var cert = new PKI.SAT.Certificado(certificado);
                    var serialNumber = cert.getNumeroSerie().replace(/ /g, "");
                    var rfc = cert.getRFC().replace(/ /g, "");
                    return '||' + serialNumber + '|UTF-8|' + rfc + '||';
                },
                function (error_code, certificado, firma, cadena_original) {//funcion callback
                    signMask.destroy();
                    if (error_code === 0) {
                        var cert = new PKI.SAT.Certificado(certificado);
                        var certificadoVigente = cert.isVigente();
                        if (certificadoVigente) {
                            if (firmaStep === 3) {
                                form.up('window').close();
                                window.open(serviceUrl + 'getReport?idAutoridad=' + login.credential.ID_AUTORIDAD + '&idOrden=' + '&userName=' + login.credential.USUARIO_NOMBRE + '|' + login.credential.CARGO + '&eFirma=' + firma + '&mensual=1');
                            } else if (firmaStep === 4) {
                                var vals = button.up('window').down('form').getValues();
                                form.up('window').close();
                                button.up('window').close();
                                window.open(serviceUrl + 'getFactura?idAutoridad=' + login.credential.ID_AUTORIDAD + '&factura=' + vals.bill + '&noIdPedido=' + vals.noIdPedido + '&noIdRecepcion=' + vals.noIdRecepcion + '&firma=' + firma + '&firmaNombre=' + login.credential.USUARIO_NOMBRE);
                            } else if (firmaStep === 5) {
                                form.up('window').close();
                                window.open(serviceUrl + 'getConsolidado?firma=' + firma + '&firmaNombre=' + login.credential.USUARIO_NOMBRE);
                            } else if (firmaStep === 6) {
                                var vals = button.up('window').down('form').getValues();
                                form.up('window').close()
                                button.up('window').close();
                                window.open(serviceUrl + 'getAcuseAlta?firma=' + firma + '&firmaNombre=' + vals.user + '&idCredencial=' + button.idCredencial);
                            } else {
                                var validateMask = new Ext.LoadMask({
                                    msg: 'Validando Firma...',
                                    target: form
                                });
                                validateMask.show();
                                var serviceOrdersConfirm = form.up('panel').getComponent(firmaStep === 1 ? 'serviceOrdersConfirm' : 'serviceOrders');
                                var url = '';
                                var params = new Object();

                                if (Ext.isEmpty(serviceOrdersConfirm.getStore().getData().items) || Ext.isEmpty(serviceOrdersConfirm.getStore().getData().items[0].data['FIRMA' + firmaStep + '_USERNAME1'])) {
                                    url += 'firma' + firmaStep + 'OrdenServicioGenerador';
                                    params = {
                                        idOrdenServicio: form.up('window').ordenServicio.ID_ORDEN_SERVICIO,
                                    }
                                    params['firma' + firmaStep + 'UserId1'] = firma;
                                    params['firma' + firmaStep + 'UserName1'] = login.credential.USUARIO_NOMBRE + '|' + login.credential.CARGO;
                                } else {
                                    url += 'firma' + firmaStep + 'OrdenServicioSupervisor';
                                    params = {
                                        idOrdenServicio: form.up('window').ordenServicio.ID_ORDEN_SERVICIO,
                                    }
                                    params['firma' + firmaStep + 'UserId2'] = firma;
                                    params['firma' + firmaStep + 'UserName2'] = login.credential.USUARIO_NOMBRE + '|' + login.credential.CARGO;
                                }


                                Ext.data.JsonP.request({
                                    url: serviceUrl + url,
                                    params: params,
                                    success: function (result) {
                                        validateMask.destroy();
                                        if (result.success) {
                                            serviceOrdersConfirm.getStore().proxy.setExtraParams({
                                                idOrdenServicio: form.up('window').ordenServicio.ID_ORDEN_SERVICIO,
                                                idCredencial: login.credential.ID_CREDENCIAL,
                                                idRol: login.credential.idRol,
                                                idAutoridad: login.credential.idAutoridad
                                            });
                                            serviceOrdersConfirm.getStore().reload();
                                            if (firmaStep === 1) {
                                                form.up('window').getComponent('e4').getComponent('serviceOrderNotice').getStore().proxy.setExtraParams({
                                                    idOrdenServicio: form.up('window').ordenServicio.ID_ORDEN_SERVICIO
                                                });
                                            }
                                        } else {
                                            Ext.Msg.alert('Error', 'La firma no coincide.');
                                        }
                                    },
                                    failure: function (result) {
                                        validateMask.destroy();
                                        Ext.Msg.alert('Failed', result.msg);
                                    }
                                });
                            }
                        } else {
                            Ext.Msg.alert('Error', 'El certificado no es vigente');
                        }
                    } else {
                        Ext.Msg.alert('Error', 'Ocurrió un error al firmar la cadena: \n' + PKI.SAT.FielUtil.obtenMensajeError(error_code));
                    }
                }
        );
    } else if (compatibilidad === false) {
        Ext.Msg.alert('Error', 'Navegador NO es compatible para realizar firmado');
    } else {
        Ext.Msg.alert('Error', 'Ocurrió un error al validar el navegador: \n' + PKI.SAT.FielUtil.obtenMensajeError(compatibilidad));
    }
};