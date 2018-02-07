/**
 * FielUtil-1.4.js
 * 
 * Archivo que define la clase PKI.SAT.FielUtil que contiene las funciones de
 * validacion de FIEL (Firma Electronica Avanzada) y el firmado de una cadena
 * por medio de esta.
 * 
 * Autor: SAT (Azertia-SMDA3, Softtek-SDMA4)
 * Colaboradores: eercortes, jpnavarrete, aosiel
 * 
 * Compatible con todos los navegadores, excepto:
 *                  * Internet Explorer 6,7,8,9
 *                  * Safari (IOS)
 * 
 *
 * Version: 1.0     21/10/2014  aosiel      Version Inicial
 *                                          Se crea metodos 3.-validaFiel() y  4.-firmaCadena().
 * Version: 1.1     27/10/2014  aosiel      Se anadio metodo X.-obtenMensajeError()
 * Version: 1.2     09/12/2014  aosiel      Se anadio los metodos 1.-leeCertificado(),
 *                                        obtenRfc(), obtenNumSerie(), obtenDateInicial(), 
 *                                        obtenDateFinal() y isVigente()
 * Version: 1.3     15/08/2016  aosiel      Se crea metodo 2.-validaKey(). 
 *                                          Setean a null variables despues de utilizar
 *                                          Recibimos el input tipo password para contrasena
 *                                          Se borra la llaveprivada y contrasena al firmar (no se envien con submit)
 * Version: 1.4     07/12/2016  aosiel    Se crea metodos 5.-validaFielyFirmaCadena(), 6.-verificaFirma() y 0.-validaNavegador()
 *                                        Se eliminaron acentos en el archivo (compatible con encoding ISO-8859-1 y UTF-8)
 *                                        Se actualizo el algoritmo de firmado a sha256 (antes sha1)
 *                                        Se modifico leeCertificado() por 1.-validaCertificado()
 *                                        Se modificaron el orden del parametro input_certificado siendo el primero.
 *                                        Se crea PKI.SAT.Certificado, que encapsula los metodos obtenRfc(), obtenNumSerie(), etc.
 *                                        Se simplifica codigo y elimina duplicidad.
 *                                        Se agrega error que valida la compatibilidad del navegador en todos los metodos.
 */

/**
 * Se define el "objeto" PKI.SAT.FielUtil
 */
if (typeof PKI === 'undefined' || !PKI)
    PKI = {};
if (typeof PKI.SAT === 'undefined' || !PKI.SAT)
    PKI.SAT = {};

PKI.SAT.FielUtil = new function() {

    ///////////////////////// METODOS PUBLICOS /////////////////////////////////

    /**
     * 0.-Valida si el navegador es compatible (soporta lectura de inputs tipo file)
     * 
     * @returns true si el navegador es compatible
     */
    this.validaNavegador = function() {
        var file_Input = document.createElement("INPUT");
        file_Input.setAttribute("type", "file");

        if (typeof (file_Input.files) === 'undefined') {
            return false;
        }

        return true;
    };

    /**
     * 1.-Metodo que valida y lee el Certificado de manera individual (antes leeCertificado()).
     * 
     * @param file_Certificado       El elemento input del tipo "file" del certificado.
     * @param funcion_callback       funcion callback de la forma: function(error_code, certificado)
     * @returns en el callback:
     *      certificado     Certificado X509 con los valores leidos del archivo .cer
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *      
     *  @since 1.4
     */
    this.validaCertificado = function(file_Certificado, funcion_callback) {

        if (!_validaEntradasCertificado(file_Certificado, funcion_callback)) {
            return;
        }

        var readerCertificado = new FileReader();

        readerCertificado.onload = function(e) {

            var certificadoX509 = _leeCertificadoX509FromDER(readerCertificado.result);

            var modulusCertificado = certificadoX509.subjectPublicKeyRSA.n;
            if (typeof (modulusCertificado) === 'undefined') {
                funcion_callback(202); //Error (usuario): El archivo no es una Certificado
                return;
            }

            funcion_callback(0, certificadoX509); //Exito

        };//fin reader.onload

        readerCertificado.readAsArrayBuffer(file_Certificado.files[0]);

    };



    /**
     * 2.-Metodo que valida la KEY (llave privada y contrasena) 
     * introducida por el usuario.
     * 
     * @param file_PrivateKey       El elemento input del tipo "file" de la llave privada.
     * @param input_contrasena      El elemento input del tipo "password" de la contrasena de la llave privada.
     * @param funcion_callback              funcion callback de la forma: function(error_code)
     * @returns en el callback:
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *      
     *  @since 1.3
     */
    this.validaKey = function(file_PrivateKey, input_contrasena, funcion_callback) {

        if (!_validaEntradasFirma(file_PrivateKey, input_contrasena, '...', funcion_callback)) {
            return;
        }

        ////////////////////////////////////////
        var readerPrivateKey = new FileReader();

        readerPrivateKey.onload = function(e) {

            var rsakey = _leeKeyRSAFromDER(readerPrivateKey.result, input_contrasena, funcion_callback);
            if (rsakey === null) {
                return;
            }

            funcion_callback(0); //Exito

        };//fin reader.onload

        readerPrivateKey.readAsArrayBuffer(file_PrivateKey.files[0]);
        ///////////////////////////////////////

    };

    /**
     * 3.-Metodo que valida la FIEL (Certificado, llave privada y contrasena) 
     * introducida por el usuario.
     * 
     * @param file_PrivateKey        El elemento input del tipo "file" de la llave privada.
     * @param input_contrasena      El elemento input del tipo "password" de la contrasena de la llave privada.
     * @param file_Certificado       El elemento input del tipo "file" del certificado.
     * @param funcion_callback              funcion callback de la forma: function(error_code, certificado)
     * @returns en el callback:
     *      certificado     Certificado X509 con los valores leidos del archivo .cer
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *      
     *  @since 1.0
     */
    this.validaFiel = function(file_Certificado, file_PrivateKey, input_contrasena, funcion_callback) {

        if (!_validaEntradasCertificado(file_Certificado, funcion_callback)) {
            return;
        }
        if (!_validaEntradasFirma(file_PrivateKey, input_contrasena, '...', funcion_callback)) {
            return;
        }

        var readerCertificado = new FileReader();
        readerCertificado.onload = function(e) {

            var certificadoX509 = _leeCertificadoX509FromDER(readerCertificado.result);

            var modulusCertificado = certificadoX509.subjectPublicKeyRSA.n;
            if (typeof (modulusCertificado) === 'undefined') {
                funcion_callback(202); //Error (usuario): El archivo no es una Certificado
                return;
            }

            ////////////////////////////////////////
            var readerPrivateKey = new FileReader();
            readerPrivateKey.onload = function(e) {

                var rsakey = _leeKeyRSAFromDER(readerPrivateKey.result, input_contrasena, funcion_callback);
                if (rsakey === null) {
                    return;
                }

                var modulusPrivada = rsakey.n;
                rsakey = null;//no se ocupa mas

                if (!modulusCertificado.equals(modulusPrivada)) {
                    funcion_callback(203);//Error (usuario): El certificado no corresponde con la llave privada
                    return;
                }

                funcion_callback(0, certificadoX509); //Exito

            };//fin reader.onload

            readerPrivateKey.readAsArrayBuffer(file_PrivateKey.files[0]);
            ///////////////////////////////////////

        };//fin reader.onload

        readerCertificado.readAsArrayBuffer(file_Certificado.files[0]);


    };



    /**
     * 4.-Metodo que firma una cadena a partir de la Llave privada de la FIEL.
     * 
     * @param file_PrivateKey        El elemento input del tipo "file" de la llave privada.
     * @param input_contrasena      El elemento input del tipo "password" de la contrasena de la llave privada.
     * @param cadena_original       String con la cadena a firmar
     * @param funcion_callback              funcion callback de la forma: function(error_code, firma)
     * @returns en el callback:
     *      firma           Firma de la cadena.
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *                          
     *  @since 1.0
     */
    this.firmaCadena = function(file_PrivateKey, input_contrasena, cadena_original, funcion_callback) {

        if (!_validaEntradasFirma(file_PrivateKey, input_contrasena, cadena_original, funcion_callback)) {
            return;
        }

        var readerPrivateKey = new FileReader();

        readerPrivateKey.onload = function(e) {

            var rsakey = _leeKeyRSAFromDER(readerPrivateKey.result, input_contrasena, funcion_callback);
            if (rsakey === null) {
                return;
            }

            var resultado = _firmaCadenasOriginales(rsakey, cadena_original, null, funcion_callback);
            rsakey = null;
            if (resultado === null) {
                return;
            }
            
            //error, firma(s), cadena(s)
            funcion_callback(0, resultado[0], resultado[1]); //Exito

        };//fin reader.onload

        readerPrivateKey.readAsArrayBuffer(file_PrivateKey.files[0]);

    };


    /**
     * 5.-Metodo que valida la FIEL (Certificado, llave privada y contrasena) y Firma Cadenas
     * introducida por el usuario en un paso.
     * 
     * @param file_Certificado      El elemento input del tipo "file" del certificado.
     * @param file_PrivateKey       El elemento input del tipo "file" de la llave privada.
     * @param input_contrasena      El elemento input del tipo "password" de la contrasena de la llave privada.
     * @param cadena_original       Cadena Original o Array de Cadenas Originales a firmar
     * @param funcion_callback              funcion callback de la forma: function(error_code, certificado)
     * @returns en el callback:
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *      certificado     Certificado X509 con los valores leidos del archivo .cer
     *      firma           Firma o Array de las Firmas generadas
     *      
     *  @since 1.4
     */
    this.validaFielyFirmaCadena = function(
            file_Certificado, file_PrivateKey, input_contrasena, cadena_original, funcion_callback) {

        if (!_validaEntradasCertificado(file_Certificado, funcion_callback)) {
            return;
        }

        if (!_validaEntradasFirma(file_PrivateKey, input_contrasena, cadena_original, funcion_callback)) {
            return;
        }

        var readerCertificado = new FileReader();

        readerCertificado.onload = function(e) {

            var certificadoX509 = _leeCertificadoX509FromDER(readerCertificado.result);

            var modulusCertificado = certificadoX509.subjectPublicKeyRSA.n;
            if (typeof (modulusCertificado) === 'undefined') {
                funcion_callback(202); //Error (usuario): El archivo no es una Certificado
                return;
            }

            ////////////////////////////////////////
            var readerPrivateKey = new FileReader();

            readerPrivateKey.onload = function(e) {

                var rsakey = _leeKeyRSAFromDER(readerPrivateKey.result, input_contrasena, funcion_callback);
                if (rsakey === null) {
                    return;
                }

                var modulusPrivada = rsakey.n;
                if (!modulusCertificado.equals(modulusPrivada)) {
                    funcion_callback(203);//Error (usuario): El certificado no corresponde con la llave privada
                    return;
                }

                var resultado = _firmaCadenasOriginales(rsakey, cadena_original, certificadoX509, funcion_callback);
                rsakey = null;
                if (resultado === null) {
                    return;
                }

                funcion_callback(0, certificadoX509, resultado[0], resultado[1]); //Exito

            };//fin reader.onload

            readerPrivateKey.readAsArrayBuffer(file_PrivateKey.files[0]);
            ///////////////////////////////////////

        };//fin reader.onload

        readerCertificado.readAsArrayBuffer(file_Certificado.files[0]);


    };


    /**
     * 6.-Metodo que verifica la Firma de la Cadena Original
     * 
     * @param file_Certificado       El elemento input del tipo "file" del certificado.
     * @param cadena_original       Cadena Original o Array de Cadenas Originales a verificar
     * @param firma                 Firma o Array de firmas a verificar
     * @param funcion_callback       funcion callback de la forma: function(error_code, certificado)
     * @returns en el callback:
     *      error_code      Codigo de error. Para obtener el mensaje de error utilizar
     *                          el metodo obtenMensajeError()
     *      verificacion    true/false, o Array de true/false de las verificaciones de la firma
     *                          o Array de las firmas respectivamente.
     *      
     *  @since 1.4
     */
    this.verificaFirma = function(file_Certificado, cadena_original, firma, funcion_callback) {

        if (!_validaEntradasCertificado(file_Certificado, funcion_callback)) {
            return;
        }

        if (!_validaEntradasVerificaFirma(cadena_original, firma, funcion_callback)) {
            return;
        }

        var readerCertificado = new FileReader();

        readerCertificado.onload = function(e) {

            var certificadoX509 = _leeCertificadoX509FromDER(readerCertificado.result);

            var modulusCertificado = certificadoX509.subjectPublicKeyRSA.n;
            if (typeof (modulusCertificado) === 'undefined') {
                funcion_callback(202); //Error (usuario): El archivo no es una Certificado
                return;
            }

            var verificacion = _verificaFirmas(certificadoX509, cadena_original, firma, funcion_callback);

            funcion_callback(0, verificacion); //Exito

        };//fin reader.onload

        readerCertificado.readAsArrayBuffer(file_Certificado.files[0]);

    };



    /**
     * X.-Metodo que obtiene el mensaje de error a partir de su codigo.
     * Detecta automaticamente el charset de la pagina html que lo esta invocando.
     * 
     * Charset soportados: ISO-8859-1 y UTF-8
     * 
     *  
     * @param codigo_error      Codigo del error
     * @returns                 Mensaje de error en espanol sin acentos
     * 
     * @since 1.1
     */
    this.obtenMensajeError = function(codigo_error) {

        if (typeof (codigo_error) !== 'number') {
            return 'No se ha pasado un codigo de error valido';
        }

        switch (codigo_error) {
            ////Errores de programacion
            case 101:
                return 'No se ha pasado un parametro "input" del tipo "file" para el certificado';
            case 102:
                return 'No se ha pasado un parametro "input" del tipo "file" para la llave Privada';
            case 103:
                return 'No se ha pasado un parametro "input" del tipo "password" para contrasena';
            case 104:
                return  'No se ha pasado un parametro para la cadena (o cadenas) a firmar';
            case 105:
                return  'No se ha pasado un parametro "input" del tipo "file"';

                //Errores del usuario
            case 201:
                return  'Seleccione un certificado';
            case 202:
                return  'El certificado no es un archivo valido';
            case 203:
                return  'El certificado no corresponde con la llave privada';

            case 301:
                return  'Selecione una llave privada';
            case 302:
                return  'La llave privada no es un archivo valido';

            case 401:
                return  'Escriba la contrasena';
            case 402:
                return  'La contrasena no es valida';

            case 501:
                return  'Introduza la cadena a firmar';
            case 502:
                return  'Introduza al menos una cadena en el arreglo a firmar';
            case 503:
                return  'Una de las cadenas a firmar no es cadena';
            case 504:
                return  'Una de las cadenas a firmar es vacia';
            case 505:
                return  'Introduzca una cadena o arreglo de cadenas a firmar';

                //TODO: Agregar mas casos
            case 601:
                return  'Una de las entradas de verificacion de firma no es correcta';


            case 901:
                return  'La biblioteca de firmado no es soportada por el navegador actual';

            default :
                return  'Ocurrio una condicion no valida';
        }

    };


    ///////////////////////// METODOS PRIVADOS /////////////////////////////////

    function _leeCertificadoX509FromDER(result) {

        //Convierte a un arreglo de enteros sin signo
        var bytes = new Uint8Array(result);

        var binary = "";
        for (var i = 0; i < bytes.byteLength; i++) {
            //Convierte un numero Unicode a su correspondiente caracter
            binary += String.fromCharCode(bytes[i]);
        }

        //Se convierte binario a hex
        var hex = rstrtohex(binary);

        //Convierte el certificado DER (en hexadecimal) y la convierte a PEM
        var pemString = KJUR.asn1.ASN1Util.getPEMStringFromHex(hex, 'CERTIFICATE');

        var certificadoX509 = new X509();
        certificadoX509.readCertPEM(pemString);

        return certificadoX509;
    }


    function _leeKeyRSAFromDER(result, input_contrasena, funcion_callback) {
        //Convierte a un arreglo de enteros sin signo
        var bytes = new Uint8Array(result);

        var binary = "";
        for (var i = 0; i < bytes.byteLength; i++) {
            //Convierte un numero Unicode a su correspondiente caracter
            binary += String.fromCharCode(bytes[i]);
        }

        //Se convierte binario a hex
        var hex = rstrtohex(binary);

        //Convierte la llave privada DER (en hexadecimal) y la convierte a PEM
        var pemString = KJUR.asn1.ASN1Util.getPEMStringFromHex(hex, 'ENCRYPTED PRIVATE KEY');

        try {
            //Desencripta la llave privada en PKCS#8 y obtiene la llave RSA PKCS#1
            return KEYUTIL.getKey(pemString, input_contrasena.value, "PKCS8PRV");

        } catch (e) {
//                console.log('exception: ' + e);
            if (e.indexOf('malformed format: SEQUENCE(0).items != 2') !== -1) {
                funcion_callback(302); //Error (usuario): El archivo no es una llave privada
            } else if (e === 'malformed plain PKCS8 private key(code:001)') {
                funcion_callback(402); //Error (usuario): La contrasena de la llave privada es incorrecta
            } else {
                funcion_callback(302); //Error desconocido
            }
            return null;

        } finally {
            //borrar variables temporales
            input_contrasena.value = null; //Puede ejecutar una firma despues
            bytes = null;
            hex = null;
            pemString = null;
        }
    }

    function _firmaCadenasOriginales(rsakey, cadena_original, certificadoX509, funcion_callback) {

        try {
            if (typeof (cadena_original) === 'function') {
                var cadena_original_string = cadena_original(certificadoX509);
                if (!_validaCadenaOriginal(cadena_original_string, funcion_callback)) {
                    return null;
                }
                cadena_original = cadena_original_string;
            }

            var array_firmasB64 = [];
            if (cadena_original instanceof Array) {
                for (var i = 0; i < cadena_original.length; i++) {
                    var hSig = rsakey.signString(cadena_original[i], 'sha256');
                    array_firmasB64.push(hex2b64(hSig));
                }
            } else {//string
                var hSig = rsakey.signString(cadena_original, 'sha256');
                array_firmasB64 = hex2b64(hSig);
            }
            return [array_firmasB64, cadena_original];

        } catch (e) {
            funcion_callback(999); //Error desconocido
            return null;
        } finally {
            rsakey = null;
        }

    }


    function _validaEntradasVerificaFirma(cadena_original, firma, funcion_callback) {

        //TODO: Validar ambas
        if ((typeof (cadena_original) === 'string' && typeof (firma) === 'string')
                || (cadena_original instanceof Array && firma instanceof Array)
                || (typeof (cadena_original) === 'function' && typeof (cadena_original) === 'function')) {

            //TODO: Personalizar errores
            return (_validaCadenaOriginal(cadena_original, funcion_callback)
                    && _validaCadenaOriginal(firma, funcion_callback));
        } else {
            funcion_callback(601);
            return false;
        }
    }

    function _verificaFirmas(certificadoX509, cadena_original, firma, funcion_callback) {

        try {
            var verificaciones = [];

            if (cadena_original instanceof Array) {
                for (var i = 0; i < cadena_original.length; i++) {
                    var isValid = certificadoX509.subjectPublicKeyRSA.verifyString(cadena_original[i], b64tohex(firma[i]));
                    verificaciones.push(isValid);
                }
            } else {//string
                var isValid = certificadoX509.subjectPublicKeyRSA.verifyString(cadena_original, b64tohex(firma));
                verificaciones = isValid;
            }
            return verificaciones;

        } catch (e) {
            funcion_callback(999); //Error desconocido
            return null;
        } finally {
            certificadoX509 = null;
        }

    }

    /**
     * Metodo interno para validar las entradas del usuario
     * 
     * @param file_Certificado
     * @param  funcion_callback
     * @returns 
     * 
     * @since 1.0
     */
    function _validaEntradasCertificado(file_Certificado, funcion_callback) {

        ////1-Validando errores de programacion
        if (typeof (funcion_callback) !== 'function') {
            throw "Se requiere una funcion callback como parametro"; //No se puede enviar por callback
        }

        if (typeof (file_Certificado) === 'undefined' || file_Certificado.type !== 'file') {
            funcion_callback(101);//Error (programacion): No se ha pasado un input del tipo file para Certificado
            return false;
        }


        ////2-Validando errores del usuario
        if (typeof (file_Certificado.files) === 'undefined') {
            funcion_callback(901); //Error (usuario): La biblioteca de firmado no es soportada por el navegador actual
            return false;
        }

        if (file_Certificado.files.length === 0) {
            funcion_callback(201); //Error (usuario): No se ha seleccionado un archivo de Certificado
            return false;
        }

        //Exito
        return true;
    }
    ;

    /**
     * Metodo interno para validar las entradas del usuario
     * 
     * @param file_PrivateKey
     * @param input_contrasena
     * @param cadena_original
     * @param  funcion_callback
     * @returns {Boolean}
     * 
     * @since 1.0
     */
    function _validaEntradasFirma(file_PrivateKey, input_contrasena, cadena_original, funcion_callback) {

        ////1-Validando errores de programacion
        if (typeof (funcion_callback) !== 'function') {
            throw "Se requiere una funcion callback como parametro";
        }

        if (typeof (file_PrivateKey) === 'undefined' || file_PrivateKey.type !== 'file') {
            funcion_callback(102);//No se ha pasado un input del tipo file para llave Privada
            return false;
        }

        if (typeof (input_contrasena) === 'undefined' || input_contrasena.type !== 'password') {
            funcion_callback(103);//Error (programacion): No se ha pasado un input del tipo password para contrasena
            return false;
        }

        ////2-Validando errores del usuario
        if (typeof (file_PrivateKey.files) === 'undefined') {
            funcion_callback(901); //Error (usuario): La biblioteca de firmado no es soportada por el navegador actual
            return false;
        }

        if (file_PrivateKey.files.length === 0) {
            funcion_callback(301); //Error (usuario): No se ha seleccionado un archivo de llave privada
            return false;
        }

        if (input_contrasena.value === '') {
            funcion_callback(401);//Error (usuario): La contrasena es vacia
            return false;
        }

        return _validaCadenaOriginal(cadena_original, funcion_callback);

//        //Exito
//        return true;
    }
    ;


    function _validaCadenaOriginal(cadena_original, funcion_callback) {

        if (typeof (cadena_original) === 'undefined') {
            funcion_callback(104);//Error (programacion): No se ha pasado un parametro para la cadena (o cadenas) a firmar
            return false;
        }

        if (typeof (cadena_original) === 'string') {//Si la cadena_firmar es una cadena
            if (cadena_original === '') {
                funcion_callback(501);//Error (usuario): La cadena a firmar es vacia
                return false;
            }
        } else if (cadena_original instanceof Array) {//Si la cadena_firmar es un arreglo de cadenas
            if (cadena_original.length === 0) {
                funcion_callback(502);//Error (usuario): El arreglo de cadenas a firmar es vacia
                return false;
            }
            for (var i = 0; i < cadena_original.length; i++) {
                if (typeof (cadena_original[i]) !== 'string') {
                    funcion_callback(503);//Error (usuario): Una de las cadenas a firmar no es cadena
                    return false;
                }
                if (cadena_original[i] === '') {
                    funcion_callback(504);//Error (usuario): Una de las cadenas a firmar es vacia
                    return false;
                }
            }
        } else if (typeof (cadena_original) === 'function') {
            //TODO: Validar argumentos
            //alert('cadena_original.arguments' + cadena_original.arguments);
        } else {
            funcion_callback(505);//Error (usuario): Introduzca una cadena o arreglo de cadenas a firmar
            return false;
        }

        //Exito
        return true;

    }
    ;



};//Fin objeto PKI.SAT.FielUtil


/**
 * 
 * @param {type} certificadoX509
 * @returns {undefined}
 */
PKI.SAT.Certificado = function(certificadoX509) {

    var rfc = '';
    var numeroSerie = '';
    var fechaInicio = '';
    var fechaFin = '';
    var vigente = false;
    var razonSocial = '';
    var tipoCertificado = '';

    this.getRFC = function() {
        return rfc;
    };

    this.getNumeroSerie = function() {
        return numeroSerie;
    };

    this.getFechaInicio = function() {
        return fechaInicio;
    };

    this.getFechaFin = function() {
        return fechaFin;
    };

    this.isVigente = function() {
        return vigente;
    };

    this.getRazonSocial = function() {
        return razonSocial;
    };

    this.getTipoCertificado = function() {
        return tipoCertificado;
    };


    try {
        //RFC
        var _sujetoDN = certificadoX509.getSubjectString();
        var _rfcDN = _sujetoDN.match(/\/undefined=[A-Z,\u00D1,\u00F1,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?[\s]{0,1}\//);
        if (_rfcDN.length === 1) {//Solo encuentra 1
            var _rfc = _rfcDN[0].match(/[A-Z,\u00D1,\u00F1,&]{3,4}[0-9]{2}[0-1][0-9][0-3][0-9][A-Z,0-9]?[A-Z,0-9]?[0-9,A-Z]?/);
            if (_rfc.length > 0) {
                rfc = _rfc[0];
            }
        }

        //Numero Serie
        var _numSerieHex = certificadoX509.getSerialNumberHex();
        var _n = 1;
        var _cadenaFinal = "";
        while (_n < _numSerieHex.length) {
            var _caracter = _numSerieHex.charAt(_n);
            _cadenaFinal = _cadenaFinal + _caracter;
            _n = _n + 2;
        }
        numeroSerie = _cadenaFinal;


        //Fecha inicial
        var _fechaInicio = certificadoX509.getNotBefore();
        var _anioIni = parseInt(_fechaInicio.substring(0, 2)) + 2000;
        var _mesIni = parseInt(_fechaInicio.substring(2, 4)) - 1;
        var _diaIni = parseInt(_fechaInicio.substring(4, 6));
        fechaInicio = new Date(_anioIni, _mesIni, _diaIni);


        //Fecha final
        var _fechaFin = certificadoX509.getNotAfter();
        var _anioFin = parseInt(_fechaFin.substring(0, 2)) + 2000;
        var _mesFin = parseInt(_fechaFin.substring(2, 4)) - 1;
        var _diaFin = parseInt(_fechaFin.substring(4, 6));
        fechaFin = new Date(_anioFin, _mesFin, _diaFin, 23, 59, 59);


        //Es vigente (depende del reloj del equipo)
        var _fechaActual = new Date();
        if (_fechaActual >= fechaInicio && _fechaActual <= fechaFin) {
            vigente = true;
        }


        //Razon Social
        var _subjectValues = certificadoX509.getSubjectString().split('/');
        for (var i = 0; i < _subjectValues.length; i++) {
            if (_subjectValues[i].indexOf('CN') === 0) {
                razonSocial = _subjectValues[i].split('=')[1];
                break;
            }
        }


        //tipoCertificado
        for (var i = 0; i < _subjectValues.length; i++) {
            if (_subjectValues[i].indexOf('OU') === 0) {
                tipoCertificado = 'SELLO';
                break;
            }
        }
        if (tipoCertificado !== 'SELLO') {
            tipoCertificado = 'FIEL';
        }

    } catch (e) {
        rfc = '';
        numeroSerie = '';
        fechaInicio = '';
        fechaFin = '';
        vigente = '';
        razonSocial = '';
        tipoCertificado = '';
    }

};