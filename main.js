
//<editor-fold defaultstate="collapsed" desc="ENC CORE">
//<editor-fold defaultstate="collapsed" desc="INNER">
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCPrimal]---------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCPrimal">
class ENCPrimal {
    constructor() {
    }
}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENC-Error]---------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENC-Error">
class ENCError extends ENCPrimal {
    constructor() {}
    static createError(module, type, errorMessage) {
        var error = new Error();
        error.code = '[' + module + ']-[' + type + ']';
        error.message = '[' + errorMessage + ']';
        return error;
    }

}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENC]---------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENC">
class ENC extends ENCPrimal {
    constructor() {
        super();
    }
    static NULL() {
        return  'null';
    }
    static UNDEFINED() {
        return  'undefined';
    }
    static BOOLEAN() {
        return  'boolean';
    }
    static NUMBER() {
        return  'number';
    }
    static STRING() {
        return 'string';
    }
    static SYMBOL() {
        return 'symbol';
    }
    static FUNCTION() {
        return  'function';
    }
    static ARRAY() {
        return  'array';
    }
    static OBJECT() {
        return  'object';
    }
    static UNSUPPORTED() {
        return  'unsupported';
    }
    static getType(inObject) {
        switch (typeof inObject) {
            case ENC.NULL():
                return ENC.NULL();
            case ENC.UNDEFINED():
                return ENC.UNDEFINED();
            case ENC.BOOLEAN():
                return ENC.BOOLEAN();
            case ENC.NUMBER():
                return ENC.NUMBER();
            case ENC.STRING():
                return ENC.STRING();
            case ENC.SYMBOL():
                return ENC.SYMBOL();
            case ENC.FUNCTION():
                return ENC.FUNCTION();
            case ENC.ARRAY():
                return ENC.ARRAY();
            case ENC.OBJECT():
                if (inObject === null) {
                    return ENC.NULL();
                } else if (inObject === undefined) {
                    return ENC.UNDEFINED();
                } else if (inObject instanceof Function) {
                    return ENC.FUNCTION();
                } else if (Array.isArray(inObject)) {
                    return ENC.ARRAY();
                }
                return ENC.OBJECT();
            default:
                return ENC.UNSUPPORTED();
        }
    }

    static isType(inData, type) {
        if (ENC.getType(inData) === type) {
            return true;
        } else {
            return false;
        }
    }
    static validateType(variableName, inData, type) {
        var currentType = ENC.getType(inData);
        if (currentType === type) {
            return true;
        } else {
            throw ENCError.createError('ENC', 'Validation', 'Want var[' + variableName + '] type:[' + type + '] recive type:[' + currentType + ']]');
        }
    }

    static validateObjectFields(inData, fieldValidations) {
        var response = {
            missing: [],
            typeFail: [],
            extra: []
        };
        var currentRequiredFieldName = null;
        var currentRequiredFieldType = null;
        var currentInputFieldName = null;
        var currentInputFieldType = null;
        var fieldsRequired = new Object();
        for (var i = 0; i < fieldValidations.length; i++) {
            currentRequiredFieldName = fieldValidations[i].requiredFieldName;
            currentRequiredFieldType = fieldValidations[i].requiredFieldType;
            fieldsRequired[currentRequiredFieldName] = true;
            if (!inData.hasOwnProperty(currentRequiredFieldName)) {
                response.missing.push(new FieldMissing(currentRequiredFieldName, currentRequiredFieldType));
            } else {
                currentInputFieldType = ENC.getType(inData[currentRequiredFieldName]);
                if (currentInputFieldType !== currentRequiredFieldType) {
                    response.typeFail.push(new FieldTypeProblem(currentRequiredFieldName, currentRequiredFieldType, currentInputFieldType));
                }
            }
        }
        for (var property in inData) {
            currentInputFieldName = property;
            currentInputFieldType = ENC.getType(inData[currentInputFieldName]);
            if (!fieldsRequired.hasOwnProperty(currentInputFieldName)) {
                response.extra.push(new FieldExtra(currentInputFieldName, currentInputFieldType));
            }
        }
        var flag = false;
        if (response.missing.length === 0) {
            delete response.missing;
        } else {
            flag = true;
        }
        if (response.typeFail.length === 0) {
            delete response.typeFail;
        } else {
            flag = true;
        }
        if (response.extra.length === 0) {
            delete response.extra;
        } else {
            flag = true;
        }
        if (flag) {
            return response;
        } else {
            return null;
        }
    }
    static isStringValidNumber(input) {
        return /^\d+$/.test(input);
    }
}
//</editor-fold>

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[FieldValidation]---------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
////<editor-fold defaultstate="collapsed" desc="FieldValidation">
class FieldValidation {
    constructor(requiredFieldName, requiredFieldType) {
        this.requiredFieldName = requiredFieldName;
        this.requiredFieldType = requiredFieldType;
    }
}

class FieldMissing {
    constructor(requiredFieldName, requiredFieldType) {
        this.requiredFieldName = requiredFieldName;
        this.requiredFieldType = requiredFieldType;
    }
}

class FieldExtra {
    constructor(inputFieldName, inputFieldType) {
        this.inputFieldName = inputFieldName;
        this.inputFieldType = inputFieldType;
    }
}
class FieldTypeProblem {
    constructor(requiredFieldName, requiredFieldType, inputFieldType) {
        this.requiredFieldName = requiredFieldName;
        this.requiredFieldType = requiredFieldType;
        this.inputFieldType = inputFieldType;
    }
}
//</editor-fold>

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCRandomGenerator]------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCRandomGenerator">
class ENCRandomGenerator extends ENCPrimal {
    constructor() {
        super();
    }
    static getNumberBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    static getAlphabetic() {
        var abcRange = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return abcRange.charAt(Math.floor(Math.random() * abcRange.length));
    }
    static getAlphaNumeric() {
        var abcRange = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return abcRange.charAt(Math.floor(Math.random() * abcRange.length));
    }
    static getNumeric() {
        var abcRange = '0123456789';
        return abcRange.charAt(Math.floor(Math.random() * abcRange.length));
    }
    static getRandomKey() {
        var key = '';
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getNumberBetween(1000, 9999);
        return key;
    }
    static getFullRandomKey() {
        var key = '';
        key = key + ENCRandomGenerator.getAlphaNumeric();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphabetic();
        key = key + ENCRandomGenerator.getAlphaNumeric();
        key = key + ENCRandomGenerator.getAlphaNumeric();
        key = key + ENCRandomGenerator.getNumeric();
        key = key + ENCRandomGenerator.getNumeric();
        key = key + ENCRandomGenerator.getNumeric();
        key = key + ENCRandomGenerator.getAlphaNumeric();
        return key;
    }
}
//</editor-fold>

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCripto]----------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCripto">
class ENCripto extends ENCPrimal {
    constructor() {
        super();
    }

    encrypt(text, password) {
        var algorithm = 'aes-256-ctr';
        var cipher = crypto.createCipher(algorithm, password);
        var crypted = cipher.update(text, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    }

    decrypt(text, password) {
        try {
            var algorithm = 'aes-256-ctr';
            var decipher = crypto.createDecipher(algorithm, password);
            var dec = decipher.update(text, 'hex', 'utf8');
            dec += decipher.final('utf8');
            return dec;
        } catch (e) {
            return "";
        }

    }

}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="STRUCTURES">
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCUnit]-----------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCUnit">
class ENCUnit extends ENCPrimal {
    constructor(inUnitData) {
        super();
        this.unitData = inUnitData;
    }
    addData(inUnitData) {
        this.unitData = inUnitData;
    }
    getDataAsString() {
        switch (ENC.getType(this.unitData)) {
            case ENC.NULL():
                return '[E-Null]';
            case ENC.UNDEFINED():
                return '[E-Undefined]';
            case ENC.BOOLEAN():
                if (this.unitData) {
                    return 'true';
                } else {
                    return 'false';
                }
            case ENC.NUMBER():
                return this.unitData.toString();
            case ENC.STRING():
                return this.unitData.toString();
            case ENC.SYMBOL():
                return '[E-Symbol]';
            case ENC.FUNCTION():
                return '[E-Symbol]';
            case ENC.ARRAY():
                return JSON.stringify(this.unitData);
            case ENC.OBJECT():
                return JSON.stringify(this.unitData);
            default:
                return '[E-Unsuported]';
        }
    }
    getDataAsInt() {
        var tempData;
        switch (typeof this.unitData) {
            case 'string':
                tempData = parseInt(this.unitData);
                break;
            case 'number':
                tempData = parseInt(this.unitData.toString());
                break;
            case 'object':
                tempData = NaN;
                break;
            case 'null':
                tempData = 0;
                break;
            default:
                tempData = 0;
                break;
        }
        if (isNaN(tempData)) {
            return 0;
        } else {
            return tempData;
        }
    }
    getDataAsFloat() {
        var tempData;
        switch (typeof this.unitData) {
            case 'string':
                tempData = parseFloat(this.unitData);
                break;
            case 'number':
                tempData = parseFloat(this.unitData.toString());
                break;
            case 'object':
                tempData = Number.NaN;
                break;
            case 'null':
                tempData = 0;
                break;
            default:
                tempData = 0;
                break;
        }
        if (isNaN(tempData)) {
            return 0;
        } else {
            return tempData;
        }
    }
    getDataAsObject() {
        return this.unitData;
    }
}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCTable]----------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCTable">
class ENCTable extends ENCPrimal {
    constructor() {
        super();
        this.columns = new Array();
        this.rows = new Array();
    }
    getRow(rowPos) {
        return this.rows[rowPos];
    }
    getRows() {
        return this.rows;
    }
    getColumn(columnPos) {
        return this.columns[columnPos];
    }
    getColumns() {
        return this.columns;
    }
    getFisrtRow() {
        return this.rows[0];
    }
    hasRows() {
        return this.rows.length > 0;
    }

}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//</editor-fold>

//<editor-fold defaultstate="collapsed" desc="MANAGERS">
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCManagerNest]----------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCManagerNest">
class ENCManagerNest extends ENCPrimal {
    constructor() {
        super();
        this.nestExecution = new Date();
    }
    nestRute() {
        return  __dirname + "/" + 'Nest/';
    }
    currentExecutionRute() {
        return  'Nest/Execution-' +
                (this.nestExecution.getFullYear()) + '-' +
                (this.nestExecution.getMonth() + 1) + '-' +
                (this.nestExecution.getDate()) + '-' +
                (this.nestExecution.getHours()) + '-' +
                (this.nestExecution.getMinutes()) + '-' +
                (this.nestExecution.getSeconds()) + '-' +
                (this.nestExecution.getMilliseconds()) + '/';
    }
    logsRute() {
        return this.currentExecutionRute() + 'Logs/';
    }
    init(inputObject) {
        return new Promise(function (resolve, reject) {
            resolve(inputObject);
            return;
        });
    }
}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCManagerCommunication]-------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCManagerCommunication">
class ENCManagerCommunication extends ENCPrimal {
    constructor() {
        super();
        this.currentMsg = new ENCUnit(null);
        log4js.configure({
            appenders: {
                trace_appender: {type: 'console'},
                debug_appender: {type: 'dateFile', filename: mn.logsRute() + 'L1_debug_appender.log', pattern: '.yyyy-MM-dd-hh', compress: true},
                info_appender: {type: 'dateFile', filename: mn.logsRute() + 'L2_info_appender.log', pattern: '.yyyy-MM-dd-hh', compress: true},
                warn_appender: {type: 'dateFile', filename: mn.logsRute() + 'L3_warn_appender.log', pattern: '.yyyy-MM-dd-hh', compress: true},
                error_appender: {type: 'dateFile', filename: mn.logsRute() + 'L4_error_appender.log', pattern: '.yyyy-MM-dd-hh', compress: true},
                fatal_appender: {type: 'dateFile', filename: mn.logsRute() + 'L5_fatal_appender.log', pattern: '.yyyy-MM-dd-hh', compress: true}
            },
            categories: {
                default: {appenders: ['trace_appender'], level: 'trace'},
                TCC: {appenders: ['trace_appender'], level: 'trace'},
                DCC: {appenders: ['trace_appender', 'debug_appender'], level: 'debug'},
                ICC: {appenders: ['trace_appender', 'debug_appender', 'info_appender'], level: 'info'},
                WCC: {appenders: ['trace_appender', 'debug_appender', 'info_appender', 'warn_appender'], level: 'warn'},
                ECC: {appenders: ['trace_appender', 'debug_appender', 'info_appender', 'warn_appender', "error_appender"], level: 'error'},
                FCC: {appenders: ['trace_appender', 'debug_appender', 'info_appender', 'warn_appender', "error_appender", "fatal_appender"], level: 'fatal'}
            }
        });
        this.loggerTrace = log4js.getLogger("TCC");
        this.loggerDebug = log4js.getLogger("DCC");
        this.loggerInfo = log4js.getLogger("ICC");
        this.loggerWarn = log4js.getLogger("WCC");
        this.loggerError = log4js.getLogger("ECC");
        this.loggerFatal = log4js.getLogger("FCC");
    }

    trace(msg) {
        this.currentMsg.addData(msg);
        this.loggerTrace.trace(this.currentMsg.getDataAsString());
    }
    debug(msg) {
        this.currentMsg.addData(msg);
        this.loggerDebug.debug(this.currentMsg.getDataAsString());
    }
    info(msg) {
        this.currentMsg.addData(msg);
        this.loggerInfo.info(this.currentMsg.getDataAsString());
    }
    warn(msg) {
        this.currentMsg.addData(msg);
        this.loggerWarn.warn(this.currentMsg.getDataAsString());
    }
    error(msg) {
        this.currentMsg.addData(msg);
        this.loggerError.error(this.currentMsg.getDataAsString());
    }
    fatal(msg) {
        this.currentMsg.addData(msg);
        this.loggerFatal.fatal(this.currentMsg.getDataAsString());
    }

    mail(msg) {
        this.currentMsg.addData(msg);
        this.loggerFatal.fatal(this.currentMsg.getDataAsString());
    }

}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCManagerMysql]---------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCManagerMysql">
class ENCManagerMysql extends ENCPrimal {
    constructor(inManagerCommunication) {
        super();
    }
    selectPromise(input) {
        return new Promise(function (resolve, reject) {

            try {
                ENC.validateType('requestID', input.requestID, ENC.NUMBER());
                ENC.validateType('connectionParameters', input.connectionParameters, ENC.OBJECT());
                ENC.validateType('query', input.query, ENC.STRING());
            } catch (err) {
                reject(err);
                return;
            }

            mc.info('RID:[' + input.requestID + ']-[SELECT]-[START]');
            mc.debug('RID:[' + input.requestID + ']-[SELECT]-[QUERY]:[' + input.query + ']');
            var con = mysql.createConnection(input.connectionParameters);
            con.connect(function (err) {
                if (err) {
                    reject(err);
                    mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                    return;
                }
                con.query(input.query, function (err, result, fields) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                        return;
                    }
                    input.queryResult = new ENCTable();
                    input.queryResult.columns = fields;
                    input.queryResult.rows = result;
                    resolve(input);
                    con.end();
                    mc.info('RID:[' + input.requestID + ']-[SELECT]-[END]:[OK]');
                });
            });
        });
    }

    freeDMLPromise(input) {
        return new Promise(function (resolve, reject) {
            try {
                ENC.validateType('requestID', input.requestID, ENC.NUMBER());
                ENC.validateType('connectionParameters', input.connectionParameters, ENC.OBJECT());
                ENC.validateType('looked', input.looked, ENC.NUMBER());
                ENC.validateType('dml', input.dml, ENC.STRING());
            } catch (err) {
                reject(err);
                return;
            }

            if (input.looked === 1) {
                mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[START]');
                mc.debug('RID:[' + input.requestID + ']-[FREE-DML]-[DML]:[' + input.dml + ']');
                var con = mysql.createConnection(input.connectionParameters);
                con.connect(function (err) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                        return;
                    }
                    con.query(input.dml, function (err, result) {
                        if (err) {
                            reject(err);
                            mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                            return;
                        }
                        input.resultDML = result;
                        resolve(input);
                        con.end();
                        mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[OK]');
                    });
                });
            } else {
                mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[LOOKED]-[END]:[OK]');
                resolve(input);
            }
        });
    }
}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCManagerSQLServer]---------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCManagerSQLServer">
class ENCManagerSQLServer extends ENCPrimal {
    constructor(inManagerCommunication) {
        super();
    }
    selectPromise(input) {
        return new Promise(function (resolve, reject) {

            try {
                ENC.validateType('requestID', input.requestID, ENC.NUMBER());
                ENC.validateType('connectionParameters', input.connectionParameters, ENC.OBJECT());
                ENC.validateType('query', input.query, ENC.STRING());
            } catch (err) {
                reject(err);
                return;
            }

            mc.info('RID:[' + input.requestID + ']-[SELECT]-[START]');
            mc.debug('RID:[' + input.requestID + ']-[SELECT]-[QUERY]:[' + input.query + ']');

            sql.connect(input.connectionParameters, function (err) {
                if (err) {
                    reject(err);
                    mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                    return;
                }

                var request = new sql.Request();
                request.query(input.query, function (err, recordset) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                        return;
                    }
                    input.queryResult = new ENCTable();
                    input.queryResult.columns = recordset.recordset.columns;
                    input.queryResult.rows = recordset.recordset;
                    resolve(input);
                    //con.end();
                    sql.close();
                    mc.info('RID:[' + input.requestID + ']-[SELECT]-[END]:[OK]');
                });
            });



        });
    }

    freeDMLPromise(input) {
        return new Promise(function (resolve, reject) {
            try {
                ENC.validateType('requestID', input.requestID, ENC.NUMBER());
                ENC.validateType('connectionParameters', input.connectionParameters, ENC.OBJECT());
                ENC.validateType('looked', input.looked, ENC.NUMBER());
                ENC.validateType('dml', input.dml, ENC.STRING());
            } catch (err) {
                reject(err);
                return;
            }

            if (input.looked === 1) {

                mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[START]');
                mc.debug('RID:[' + input.requestID + ']-[FREE-DML]-[DML]:[' + input.dml + ']');

                sql.connect(input.connectionParameters, function (err) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                        return;
                    }

                    var request = new sql.Request();
                    request.query(input.dml, function (err, result) {
                        if (err) {
                            reject(err);
                            mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                            return;
                        }
                        input.resultDML =result ;
                        resolve(input);
                        sql.close();
                        mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[OK]');
                    });
                });



            } else {
                mc.info('RID:[' + input.requestID + ']-[FREE-DML]-[LOOKED]-[END]:[OK]');
                resolve(input);
            }
        });
    }
}
//</editor-fold>

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[ENCManagerMail]---------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//<editor-fold defaultstate="collapsed" desc="ENCManagerMail">
class ENCManagerMail extends ENCPrimal {
    constructor(inManagerCommunication) {
        super();
    }
    sendMail(input) {
        return new Promise(function (resolve, reject) {
            mc.debug('Inicia envio de mail');
            try {
                ENC.validateType('mailParameters', input.mailParameters, ENC.OBJECT());
                ENC.validateType('from', input.from, ENC.STRING()); // sender address
                ENC.validateType('to', input.to, ENC.STRING()); // list of receivers
                ENC.validateType('subject', input.subject, ENC.STRING()); // Subject line
                ENC.validateType('text', input.text, ENC.STRING()); // plain text body
                ENC.validateType('html', input.html, ENC.STRING()); // html body

            } catch (err) {
                reject(err);
                return;
            }
            mc.debug('Parametros de envio de Email validados.');
            var mailOptions = {
                from: input.from, // sender address
                to: input.to, // list of receivers
                subject: input.subject, // Subject line
                text: input.text, // plain text body
                html: input.html// html body
            };
            var transporter = nodemailer.createTransport(input.mailParameters);
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject(error);
                    return;
                }
                input.mailSend = info;
                resolve(input);
                mc.debug('Mail enviado Exitosamente al correo:[' + input.to + ']');
            });
        });
    }
}
//</editor-fold>
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//</editor-fold>
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="COMMON FUNCTIONS">
var inputValidation = function (response, request, fieldValidation) {
    ENC.validateType('response', response, ENC.OBJECT());
    ENC.validateObjectFields('request', request, ENC.OBJECT());
    ENC.validateObjectFields('fieldValidation', request, ENC.ARRAY());
    var inputValidation = ENC.validateObjectFields(request, fieldValidation);
    if (inputValidation !== null) {
        response.inputValidation = inputValidation;
        mc.debug(response.inputValidation);
        throw new Error("Input parameter problem.");
    } else {
        return response;
    }
};
var replaceAll = function (str, find, replace) {
    var temp = str;
    var index = temp.indexOf(find);
    while (index !== -1) {
        temp = temp.replace(find, replace);
        index = temp.indexOf(find);
    }
    return temp;
};
//</editor-fold>

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//----------------------------[WEB SERVICES]------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

//<editor-fold defaultstate="collapsed" desc="DECLARATION">
var sql = require('mssql');
var mysql = require('mysql');
var log4js = require('log4js');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
//app.use(express.static(__dirname + '/public'))//for file satatic service express;
app.use(express.static('Images'));//for file satatic service express;
app.use(express.static('Nest'));//for file satatic service express;

//var validator = require("email-validator");
var mn = new ENCManagerNest();
var mc = new ENCManagerCommunication();
var mms = new ENCManagerMysql();
var msql = new ENCManagerSQLServer();
var mm = new ENCManagerMail();
var mcph = new ENCripto();
var server;

var SQLServerConnectionParameters = {
    user: 'sa',
    password: 'Lufiri01011',
    server: '10.15.17.158',
    database: 'SOA_db'
};
////var connectionParameters1 = {
////    host: 'localhost',
////    user: 'enc_db_i',
////    password: 'lufiri01011',
////    secure: false,
////    database: 'enclave_database_infraestructure'
////};
//var connectionParameters1 = {
//    host: 'site.enclave.com.mx',
//    user: 'radar_user',
//    password: 'Enclavesesta',
//    secure: false,
//    database: 'radar_enc'
//};
//var mailParameters1 = {
//    host: 'smtp.gmail.com',
//    port: 465,
//    //secure: false, // secure:true for port 465, secure:false for port 587
//    auth: {
//        user: 'raddar.contacto@gmail.com',
//        pass: 'Ttt01011'
//    }
//};
//var mailParameters2 = {
//    host: 'a2plcpnl0014.prod.iad2.secureserver.net',
//    port: 465,
//    //secure: false, // secure:true for port 465, secure:false for port 587
//    auth: {
//        user: 'oscar.avila@enclave.com.mx',
//        pass: 'Mylene010111'
//    }
//};


//</editor-fold>





//<editor-fold defaultstate="collapsed" desc="defaultSelect">
app.post('/defaultSelect', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/defaultSelect]');
                return dp;
            })
            .then(function (dp) {
                inputValidation(response, req.body, [
                    new FieldValidation('query', ENC.STRING())
                ]);
                dp.query = req.body.query;
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                response = dp.queryResult;
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/defaultSelect]');

                res.json(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/defaultSelect]');
                response.error = err.message;
                res.json(response);
            });
});
//</editor-fold>





app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function () {
    mc.info('[BACKEND]-[WEBSERVICES] init on port:[' + app.get('port') + ']');
});






