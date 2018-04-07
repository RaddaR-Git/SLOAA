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
            try {
                sql.close();
            } catch (e) {
            }
            sql.connect(input.connectionParameters, function (err) {
                if (err) {
                    reject(err);
                    mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                    try {
                        sql.close();
                    } catch (e) {
                    }
                    return;
                }

                var request = new sql.Request();
                request.query(input.query, function (err, recordset) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[SELECT]-[END]:[FAIL]:[' + err.message + ']');
                        try {
                            sql.close();
                        } catch (e) {
                        }
                        return;
                    }
                    input.queryResult = new ENCTable();
                    input.queryResult.columns = recordset.recordset.columns;
                    input.queryResult.rows = recordset.recordset;
                    resolve(input);
                    //con.end();
                    try {
                        sql.close();
                    } catch (e) {
                    }
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
                try {
                    sql.close();
                } catch (e) {
                }
                sql.connect(input.connectionParameters, function (err) {
                    if (err) {
                        reject(err);
                        mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                        try {
                            sql.close();
                        } catch (e) {
                        }
                        return;
                    }

                    var request = new sql.Request();
                    request.query(input.dml, function (err, result) {
                        if (err) {
                            reject(err);
                            mc.error('RID:[' + input.requestID + ']-[FREE-DML]-[END]:[FAIL]:[' + err.message + ']');
                            try {
                                sql.close();
                            } catch (e) {
                            }
                            return;
                        }
                        input.resultDML = result;
                        resolve(input);
                        try {
                            sql.close();
                        } catch (e) {
                        }
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
                mc.debug('Mail enviado Exitosamente al correo:[' + input.to + ']');
                resolve(input);
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
    ENC.validateType('request', request, ENC.OBJECT());
    ENC.validateType('fieldValidation', request, ENC.OBJECT());
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
var path = require('path')
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
app.use(express.static(__dirname + '/front')); //for file satatic service express;
app.use(express.static('Images')); //for file satatic service express;
app.use(express.static('Nest')); //for file satatic service express;

app.set("view engine", "jade"); //for JADE
app.set("views", path.join(__dirname, "myHtmlTemplates")); //for JADE

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
    server: '192.168.56.102',
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
var mailParameters1 = {
    host: 'smtp.gmail.com',
    port: 465,
    //secure: false, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'raddar.contacto@gmail.com',
        pass: 'Ttt01011'
    }
};
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



//<editor-fold defaultstate="collapsed" desc="login">
app.get('/login', function (req, res) {
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

                inputValidation(response, req.query, [
                    new FieldValidation('user', ENC.STRING()),
                    new FieldValidation('password', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.user = req.query.user;
                dp.password = req.query.password;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT [CRED].[ID_CREDENCIAL]\n" +
                        "      ,[CRED].[NOMBRE]\n" +
                        "      ,[CRED].[CARGO]\n" +
                        "      ,[CRED].[USUARIO_NOMBRE]\n" +
                        "      ,[CRED].[ID_AUTORIDAD]\n" +
                        "	  ,[AUTH].[NOMBRE_AUTORIDAD]\n" +
                        "	  ,[AUTH].[ID_ZONA]\n" +
                        "         ,[CRED].[ID_ROL]\n" +
                        "	  ,[ROL].[NOMBRE_ROL]\n" +
                        "	  ,[ROL].[PRIVILEGIOS]\n" +
                        "      ,[CRED].[ID_CREDENCIAL_SUPERIOR]\n" +
                        "  FROM [dbo].[SLOAA_TR_CREDENCIAL] [CRED]\n" +
                        "  LEFT JOIN  [dbo].[SLOAA_TC_AUTORIDAD] [AUTH] ON [CRED].[ID_AUTORIDAD]=[AUTH].[ID_AUTORIDAD]\n" +
                        "  LEFT JOIN  [dbo].[SLOAA_TS_ROL] [ROL] ON [CRED].[ID_ROL]=[ROL].[ID_ROL]\n" +
                        "  \n" +
                        "  WHERE \n" +
                        "	            [CRED].[USUARIO_NOMBRE]='" + dp.user + "'\n" +
                        "		AND [CRED].[USUARIO_PASSWORD]='" + dp.password + "'";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    if (dp.queryResult.rows.length > 0) {
                        response.credential = dp.queryResult.rows[0];
                        response.success = true;
                    } else {
                        response.success = false;
                    }
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/defaultSelect]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/defaultSelect]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllOrdenServicio">
app.get('/getAllOrdenServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idCredencial', ENC.STRING()),
                    new FieldValidation('idRol', ENC.STRING()),
                    new FieldValidation('idAutoridad', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idCredencial = req.query.idCredencial;
                dp.idRol = req.query.idRol;
                dp.idAutoridad = req.query.idAutoridad;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT  \n" +
                        "	    [ORD].[ID_ORDEN_SERVICIO]\n" +
                        "      ,[ORD].[NUM_ORDEN]\n" +
                        "      ,[ORD].[FECHA_SOLICITUD]\n" +
                        "      ,[ORD].[DOMICILIO]\n" +
                        "      ,[ORD].[FIRMA1_USER1]\n" +
                        "      ,[ORD].[FIRMA1_USER2]\n" +
                        "      ,[ORD].[FIRMA2_USER1]\n" +
                        "      ,[ORD].[FIRMA2_USER2]\n" +
                        "      ,[ORD].[ID_STATUS]\n" +
                        "      ,[ORD].[METAINFO_FECHA_CREACION]\n" +
                        "      ,[ORD].[METAINFO_IP]\n" +
                        "      ,[ORD].[METAINFO_MAC_ADRR]\n" +
                        "      ,[ORD].[LLAVE_SISTEMA]\n" +
                        "      ,[ORD].[CIERRE_TOTAL]\n" +
                        "      ,[ORD].[JUSTIFICACION]\n" +
                        "	  \n" +
                        "	   ,[CRED].[ID_CREDENCIAL]\n" +
                        "      ,[CRED].[NOMBRE]\n" +
                        "      ,[CRED].[CARGO]\n" +
                        "      ,[CRED].[TELEFONO]\n" +
                        "      ,[CRED].[EXT]\n" +
                        "      ,[CRED].[EMAIL]\n" +
                        "      ,[CRED].[PTT]\n" +
                        "      ,[CRED].[MOVIL]\n" +
                        "      ,[CRED].[USUARIO_NOMBRE]\n" +
                        "      ,[CRED].[ID_ROL]\n" +
                        "      ,[CRED].[ID_CREDENCIAL_SUPERIOR]\n" +
                        "\n" +
                        "	   ,[AUTH].[ID_AUTORIDAD]\n" +
                        "      ,[AUTH].[NOMBRE_AUTORIDAD]\n" +
                        "      ,[AUTH].[ESTADO]\n" +
                        "      ,[AUTH].[NIVEL]\n" +
                        "      ,[AUTH].[SERVICIO]\n" +
                        "      ,[AUTH].[ID_ZONA] \n" +
                        "       " +
                        "      ,[STATUS].[NOMBRE_STATUS]\n" +
                        "  FROM \n" +
                        "  [SLOAA_TR_ORDEN_SERVICIO] [ORD]\n" +
                        " LEFT JOIN [SLOAA_TR_CREDENCIAL] [CRED] ON  [CRED].[ID_CREDENCIAL]=[ORD].[ID_CREDENCIAL]\n" +
                        " LEFT JOIN [SLOAA_TC_AUTORIDAD] [AUTH] ON  [AUTH].[ID_AUTORIDAD]=[CRED].[ID_AUTORIDAD]\n" +
                        " LEFT JOIN [dbo].[SLOAA_TC_STATUS] [STATUS] ON  [ORD].[ID_STATUS]=[STATUS].[ID_STATUS]\n" +
                        "  WHERE\n" +
                        "  1=1\n ";
                if (dp.idRol === "1") {
                }

                if (dp.idRol === "2") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idCredencial + "\n ";
                        dp.query = dp.query + "   AND  [ORD].[ID_CREDENCIAL]=" + dp.idCredencial + "\n ";
                    }
                }

                if (dp.idRol === "3") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idCredencial + "\n ";
                        dp.query = dp.query + "   AND  ([CRED].[ID_CREDENCIAL]=" + dp.idCredencial + "   OR  [CRED].[ID_CREDENCIAL_SUPERIOR]=" + dp.idCredencial + "    )\n ";
                    }
                }

                if (dp.idRol === "4") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [ORD].[ID_STATUS]=7\n ";
                    }
                }

                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.ordenesServicio = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getOrdenServicio">
app.get('/getOrdenServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idCredencial', ENC.STRING()),
                    new FieldValidation('idRol', ENC.STRING()),
                    new FieldValidation('idAutoridad', ENC.STRING()),
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idCredencial = req.query.idCredencial;
                dp.idRol = req.query.idRol;
                dp.idAutoridad = req.query.idAutoridad;
                dp.idOrdenServicio = req.query.idOrdenServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT  \n" +
                        "	    [ORD].[ID_ORDEN_SERVICIO]\n" +
                        "      ,[ORD].[NUM_ORDEN]\n" +
                        "      ,[ORD].[FECHA_SOLICITUD]\n" +
                        "      ,[ORD].[DOMICILIO]\n" +
                        "      ,[ORD].[FIRMA1_USER1]\n" +
                        "      ,[ORD].[FIRMA1_USER2]\n" +
                        "      ,[ORD].[FIRMA2_USER1]\n" +
                        "      ,[ORD].[FIRMA2_USER2]\n" +
                        "      ,[ORD].[ID_STATUS]\n" +
                        "      ,[ORD].[METAINFO_FECHA_CREACION]\n" +
                        "      ,[ORD].[METAINFO_IP]\n" +
                        "      ,[ORD].[METAINFO_MAC_ADRR]\n" +
                        "      ,[ORD].[LLAVE_SISTEMA]\n" +
                        "      ,[ORD].[CIERRE_TOTAL]\n" +
                        "      ,[ORD].[JUSTIFICACION]\n" +
                        "	  \n" +
                        "	   ,[CRED].[ID_CREDENCIAL]\n" +
                        "      ,[CRED].[NOMBRE]\n" +
                        "      ,[CRED].[CARGO]\n" +
                        "      ,[CRED].[TELEFONO]\n" +
                        "      ,[CRED].[EXT]\n" +
                        "      ,[CRED].[EMAIL]\n" +
                        "      ,[CRED].[PTT]\n" +
                        "      ,[CRED].[MOVIL]\n" +
                        "      ,[CRED].[USUARIO_NOMBRE]\n" +
                        "      ,[CRED].[USUARIO_PASSWORD]\n" +
                        "      ,[CRED].[ID_ROL]\n" +
                        "      ,[CRED].[ID_CREDENCIAL_SUPERIOR]\n" +
                        "\n" +
                        "	   ,[AUTH].[ID_AUTORIDAD]\n" +
                        "      ,[AUTH].[NOMBRE_AUTORIDAD]\n" +
                        "      ,[AUTH].[ESTADO]\n" +
                        "      ,[AUTH].[NIVEL]\n" +
                        "      ,[AUTH].[SERVICIO]\n" +
                        "      ,[AUTH].[ID_ZONA] \n" +
                        "       " +
                        "  FROM \n" +
                        "  [SLOAA_TR_ORDEN_SERVICIO] [ORD]\n" +
                        " LEFT JOIN [SLOAA_TR_CREDENCIAL] [CRED] ON  [CRED].[ID_CREDENCIAL]=[ORD].[ID_CREDENCIAL]\n" +
                        " LEFT JOIN [SLOAA_TC_AUTORIDAD] [AUTH] ON  [AUTH].[ID_AUTORIDAD]=[CRED].[ID_AUTORIDAD]\n" +
                        "  WHERE\n" +
                        "  1=1 AND [ORD].[ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio
                if (dp.idRol === "1") {
                }

                if (dp.idRol === "2") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idCredencial + "\n ";
                        dp.query = dp.query + "   AND  [ORD].[ID_CREDENCIAL]=" + dp.idCredencial + "\n ";
                    }
                }

                if (dp.idRol === "3") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idCredencial + "\n ";
                        dp.query = dp.query + "   AND  ([CRED].[ID_CREDENCIAL]=" + dp.idCredencial + "   OR  [CRED].[ID_CREDENCIAL_SUPERIOR]=" + dp.idCredencial + "    )\n ";
                    }
                }

                if (dp.idRol === "4") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [ORD].[ID_STATUS]=7\n ";
                    }
                }

                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.ordenServicio = dp.queryResult.rows[0]
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getSigns">
app.get('/getSigns', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idCredencial', ENC.STRING()),
                    new FieldValidation('idRol', ENC.STRING()),
                    new FieldValidation('idAutoridad', ENC.STRING()),
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idCredencial = req.query.idCredencial;
                dp.idRol = req.query.idRol;
                dp.idAutoridad = req.query.idAutoridad;
                dp.idOrdenServicio = req.query.idOrdenServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT  \n" +
                        "[ORD].[FIRMA1_USERNAME1],[ORD].[FIRMA1_USERNAME2],[ORD].[FIRMA2_USERNAME1],[ORD].[FIRMA2_USERNAME2]" +
                        "  FROM \n" +
                        "  [SLOAA_TR_ORDEN_SERVICIO] [ORD]\n" +
                        " LEFT JOIN [SLOAA_TR_CREDENCIAL] [CRED] ON  [CRED].[ID_CREDENCIAL]=[ORD].[ID_CREDENCIAL]\n" +
                        " LEFT JOIN [SLOAA_TC_AUTORIDAD] [AUTH] ON  [AUTH].[ID_AUTORIDAD]=[CRED].[ID_AUTORIDAD]\n" +
                        "  WHERE\n" +
                        "  1=1 AND [ORD].[ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio
                if (dp.idRol === "1") {
                }

                if (dp.idRol === "2") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idAutoridad + "\n ";
                        dp.query = dp.query + "   AND  [ORD].[ID_CREDENCIAL]=" + dp.idCredencial + "\n ";
                    }
                }

                if (dp.idRol === "3") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [AUTH].[ID_AUTORIDAD]=" + dp.idAutoridad + "\n ";
                        dp.query = dp.query + "   AND  ([CRED].[ID_CREDENCIAL]=" + dp.idCredencial + "   OR  [CRED].[ID_CREDENCIAL_SUPERIOR]=" + dp.idCredencial + "    )\n ";
                    }
                }

                if (dp.idRol === "4") {
                    if (dp.idCredencial !== "") {
                        dp.query = dp.query + "   AND  [ORD].[ID_STATUS]=7\n ";
                    }
                }

                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.signs = dp.queryResult.rows[0]
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="createOrdenServicio">
app.get('/createOrdenServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/createOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idAutoridad', ENC.STRING()),
                    new FieldValidation('fechaSolicitud', ENC.STRING()),
                    new FieldValidation('idCredencial', ENC.STRING()),
                    new FieldValidation('domicilio', ENC.STRING()),
                    new FieldValidation('justificacion', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idAutoridad = req.query.idAutoridad;
                dp.fechaSolicitud = req.query.fechaSolicitud;
                dp.idCredencial = req.query.idCredencial;
                dp.domicilio = req.query.domicilio;
                dp.justificacion = req.query.justificacion;
                dp.headers = req.headers;
                dp.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                dp.metaFechaGeneracion = new Date().toISOString();
                dp.anio = new Date().getFullYear()
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="OBTIENE INFORMACION DE LA AUTORIDAD">
            .then(function (dp) {
                dp.query = "SELECT [ID_AUTORIDAD]\n" +
                        "      ,[NOMBRE_AUTORIDAD]\n" +
                        "      ,[ESTADO]\n" +
                        "      ,[NIVEL]\n" +
                        "      ,[SERVICIO]\n" +
                        "      ,[ID_ZONA]\n" +
                        "  FROM [SOA_db].[dbo].[SLOAA_TC_AUTORIDAD]\n" +
                        "  WHERE  [ID_AUTORIDAD]=" + dp.idAutoridad + "";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    currentRow = dp.queryResult.rows[0];
                    if (currentRow !== null) {
                        dp.newOrden = currentRow.NEW_ORDEN;
                        dp.nombreAutoridad = currentRow.NOMBRE_AUTORIDAD;
                        dp.estado = currentRow.ESTADO;
                        dp.nivel = currentRow.NIVEL;
                        dp.servicio = currentRow.SERVICIO;
                        dp.zona = currentRow.ZONA;
                        dp.looked = 1;
                    } else {
                        response.success = false;
                        throw "Problemas con la consulta para Obtener Orden";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo obtener nueva numero de Orden";
                }
                return dp;
            })
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="OBTIENE CONSECUTIVO">
            .then(function (dp) {
                dp.query = "SELECT\n" +
                        "	CASE\n" +
                        "	WHEN  MAX([ORD].[NUM_ORDEN]) IS NULL THEN 1\n" +
                        "	ELSE MAX([ORD].[NUM_ORDEN])+1\n" +
                        "	END  NEW_ORDEN\n" +
                        "      \n" +
                        "  FROM [dbo].[SLOAA_TR_ORDEN_SERVICIO] [ORD]\n" +
                        "  LEFT JOIN [dbo].[SLOAA_TR_CREDENCIAL] [CRED] ON [ORD].[ID_CREDENCIAL]=[CRED].[ID_CREDENCIAL]\n" +
                        "  WHERE\n" +
                        "  1=1\n" +
                        "	AND YEAR([ORD].[METAINFO_FECHA_CREACION])= YEAR(GetDate()) \n" +
                        "	AND [CRED].[ID_AUTORIDAD]=" + dp.idAutoridad + "";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    currentRow = dp.queryResult.rows[0];
                    if (currentRow !== null) {
                        dp.newOrden = currentRow.NEW_ORDEN;
                        dp.looked = 1;
                    } else {
                        response.success = false;
                        throw "Problemas con la consulta para Obtener Orden";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo obtener nueva numero de Orden";
                }
                return dp;
            })
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="INSERTA">
            .then(function (dp) {

                dp.key = "TNRS-" + dp.estado + "-" + dp.servicio + "-" + dp.anio + "-" + dp.newOrden;
                dp.key = dp.key.replace(/\|/g, "");
                dp.key = dp.key.replace(/\s+/g, ' ');
                dp.dml = "INSERT INTO [dbo].[SLOAA_TR_ORDEN_SERVICIO]\n" +
                        "  (\n" +
                        "		\n" +
                        "       [ORD].[NUM_ORDEN]\n" +
                        "      ,[ORD].[FECHA_SOLICITUD]\n" +
                        "      ,[ORD].[ID_CREDENCIAL]\n" +
                        "      ,[ORD].[DOMICILIO]\n" +
                        "      ,[ORD].[ID_STATUS]\n" +
                        "      ,[ORD].[METAINFO_FECHA_CREACION]\n" +
                        "      ,[ORD].[METAINFO_IP]\n" +
                        "      ,[ORD].[METAINFO_MAC_ADRR]\n" +
                        "      ,[ORD].[LLAVE_SISTEMA]\n" +
                        "      ,[ORD].[JUSTIFICACION]\n" +
                        "	  )\n" +
                        "	  VALUES\n" +
                        "	  (\n" +
                        "	    " + dp.newOrden + ",\n" +
                        "		'" + dp.fechaSolicitud + "',\n" +
                        "		" + dp.idCredencial + ",\n" +
                        "		'" + dp.domicilio + "',\n" +
                        "		1,\n" +
                        "		'" + dp.metaFechaGeneracion + "',\n" +
                        "		'" + dp.ip + "',\n" +
                        "		' ????????',\n" +
                        "		'" + dp.key + "',\n" +
                        "		'" + dp.justificacion + "'\n" +
                        "	  )";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.metaFechaGeneracion = dp.metaFechaGeneracion;
                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo crear laOrden de Servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo crear laOrden de Servicio";
                }
                return dp;
            })
            //</editor-fold>

            //<editor-fold defaultstate="collapsed" desc="RESCATA LO INSERTADO">
            .then(function (dp) {
                dp.query = "SELECT \n" +
                        "       [ID_ORDEN_SERVICIO]\n" +
                        "      ,[NUM_ORDEN]\n" +
                        "      ,[FECHA_SOLICITUD]\n" +
                        "      ,[ID_CREDENCIAL]\n" +
                        "      ,[DOMICILIO]\n" +
                        "      ,[FIRMA1_USER1]\n" +
                        "      ,[FIRMA1_USER2]\n" +
                        "      ,[FIRMA2_USER1]\n" +
                        "      ,[FIRMA2_USER2]\n" +
                        "      ,[ID_STATUS]\n" +
                        "      ,[METAINFO_FECHA_CREACION]\n" +
                        "      ,[METAINFO_IP]\n" +
                        "      ,[METAINFO_MAC_ADRR]\n" +
                        "      ,[LLAVE_SISTEMA]\n" +
                        "  FROM [SOA_db].[dbo].[SLOAA_TR_ORDEN_SERVICIO]\n" +
                        "  WHERE [METAINFO_FECHA_CREACION]='" + response.metaFechaGeneracion + "'";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult !== null && dp.queryResult.rows !== null) {
                    response.ordenServicio = dp.queryResult.rows[0];
                } else {
                    throw "Problema para recuperar la orden de Servicio";
                }
                return dp;
            })
            //</editor-fold>

            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/createOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/createOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="addServicio">
app.get('/addCotizacion', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/addCotizacion]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('idTipoServicio', ENC.STRING()),
                    new FieldValidation('idServicio', ENC.STRING()),
                    new FieldValidation('idUnidad', ENC.STRING()),
                    new FieldValidation('precioUnitario', ENC.STRING()),
                    new FieldValidation('cantidad', ENC.STRING()),
                    new FieldValidation('cotizacion', ENC.STRING()),
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('idSubZona', ENC.STRING()),
                    new FieldValidation('idPestadorServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())

                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.idTipoServicio = req.query.idTipoServicio;
                dp.idServicio = req.query.idServicio;
                dp.idUnidad = req.query.idUnidad;
                dp.precioUnitario = req.query.precioUnitario;
                dp.cantidad = req.query.cantidad;
                dp.cotizacion = req.query.cotizacion;
                dp.deduccion = 0;
                dp.deduccionJustificacion = "";
                dp.precioServicioFinal = 0;
                dp.validaDisponibilidad = 0;
                dp.idZona = req.query.idZona;
                dp.idSubZona = req.query.idSubZona;
                dp.idPestadorServicio = req.query.idPestadorServicio;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="INSERTA">
            .then(function (dp) {

                dp.dml = " INSERT INTO [dbo].[SLOAA_TR_SERVICIO_COTIZACION]\n" +
                        "           (\n" +
                        "            [ID_ORDEN_SERVICIO]\n" +
                        "           ,[ID_TIPO_SERVICIO]\n" +
                        "           ,[ID_SERVICIO]\n" +
                        "           ,[ID_UNIDAD]\n" +
                        "		   \n" +
                        "		   \n" +
                        "           ,[PRECIO_UNITARIO]\n" +
                        "           ,[CANTIDAD]\n" +
                        "           ,[COTIZACION]\n" +
                        "		   \n" +
                        "           ,[DEDUCCION_CANTIDAD]\n" +
                        "           ,[DEDUCCION_TIEMPO]\n" +
                        "           ,[CANCELACION]\n" +
                        "           ,[DEDUCCION]\n" +
                        "           ,[DEDUCCION_JUSTIFICACION]\n" +
                        "           ,[PRECIO_SERVICIO_FINAL]\n" +
                        "           ,[VALIDA_DISPONIBILIDAD]\n" +
                        "           ,[ID_ZONA]\n" +
                        "           ,[ID_SUBZONA]\n" +
                        "           ,[ID_PRESTADOR_SERVICIO]\n" +
                        "		   )\n" +
                        "     VALUES\n" +
                        "           (\n" +
                        "		   " + dp.idOrdenServicio + " \n" +
                        "		   , " + dp.idTipoServicio + " \n" +
                        "		   , " + dp.idServicio + " \n" +
                        "		   , " + dp.idUnidad + " \n" +
                        "		   \n" +
                        "		   , " + dp.precioUnitario + " \n" +
                        "		   , " + dp.cantidad + " \n" +
                        "		   , " + dp.cotizacion + " \n" +
                        "		   \n" +
                        "		   \n" +
                        "		   \n" +
                        "		   , 0 \n" +
                        "		   , 0 \n" +
                        "		   , 0 \n" +
                        "		   , " + dp.deduccion + " \n" +
                        "		   , '" + dp.deduccionJustificacion + "' \n" +
                        "		   , " + dp.precioServicioFinal + " \n" +
                        "		   , " + dp.validaDisponibilidad + " \n" +
                        "		   , " + dp.idZona + "\n" +
                        "		   , " + dp.idSubZona + "\n" +
                        "		   , " + dp.idPestadorServicio + "\n" +
                        "		   )";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/addCotizacion]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/addCotizacion]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="updateServicio">
app.get('/updateServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/updateServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idServicioCotizacion', ENC.STRING()),
                    new FieldValidation('idTipoServicio', ENC.STRING()),
                    new FieldValidation('idServicio', ENC.STRING()),
                    new FieldValidation('idUnidad', ENC.STRING()),
                    new FieldValidation('precioUnitario', ENC.STRING()),
                    new FieldValidation('cantidad', ENC.STRING()),
                    new FieldValidation('cotizacion', ENC.STRING()),
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('idSubZona', ENC.STRING()),
                    new FieldValidation('idPestadorServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idServicioCotizacion = req.query.idServicioCotizacion;
                dp.idTipoServicio = req.query.idTipoServicio;
                dp.idServicio = req.query.idServicio;
                dp.idUnidad = req.query.idUnidad;
                dp.precioUnitario = req.query.precioUnitario;
                dp.cantidad = req.query.cantidad;
                dp.cotizacion = req.query.cotizacion;
                dp.precioServicioFinal = 0;
                dp.validaDisponibilidad = 0;
                dp.idZona = req.query.idZona;
                dp.idSubZona = req.query.idSubZona;
                dp.idPestadorServicio = req.query.idPestadorServicio;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_SERVICIO_COTIZACION] SET\n" +
                        "            [ID_TIPO_SERVICIO]=" + dp.idTipoServicio + "\n" +
                        "           ,[ID_SERVICIO]=" + dp.idServicio + "\n" +
                        "           ,[ID_UNIDAD]=" + dp.idUnidad + "\n" +
                        "		   \n" +
                        "		   \n" +
                        "           ,[PRECIO_UNITARIO]=" + dp.precioUnitario + "\n" +
                        "           ,[CANTIDAD]=" + dp.cantidad + "\n" +
                        "           ,[COTIZACION]=" + dp.cotizacion + "\n" +
                        "		   \n" +
                        "           ,[PRECIO_SERVICIO_FINAL]=" + dp.precioServicioFinal + "\n" +
                        "           ,[VALIDA_DISPONIBILIDAD]=" + dp.validaDisponibilidad + "\n" +
                        "           ,[ID_ZONA]=" + dp.idZona + "\n" +
                        "           ,[ID_SUBZONA]=" + dp.idSubZona + "\n" +
                        "           ,[ID_PRESTADOR_SERVICIO]=" + dp.idPestadorServicio + "\n" +
                        "WHERE [ID_SERVICIO_COTIZACION]=" + dp.idServicioCotizacion + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/updateServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/updateServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllServicioFromOrden">
app.get('/getAllCotizacionXOrden', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllCotizacionXOrden]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT COT.ID_SERVICIO_COTIZACION, COT.ID_ORDEN_SERVICIO, COT.ID_TIPO_SERVICIO, COT.ID_SERVICIO, COT.ID_UNIDAD, COT.ID_ZONA, COT.ID_SUBZONA, COT.ID_PRESTADOR_SERVICIO, COT.PRECIO_UNITARIO, COT.CANTIDAD, COT.COTIZACION, COT.DEDUCCION, COT.DEDUCCION_JUSTIFICACION, COT.PRECIO_SERVICIO_FINAL, COT.VALIDA_DISPONIBILIDAD, SERV.NOMBRE_SERVICIO, TIPO.TIPO, PRES.NOMBRE, SUBZ.SUBZONA, ZONA.ZONA FROM SLOAA_TR_SERVICIO_COTIZACION COT INNER JOIN SLOAA_TR_PRECIO_UNITARIO UNIT ON COT.ID_TIPO_SERVICIO = UNIT.ID_TIPO_SERVICIO AND COT.ID_SERVICIO = UNIT.ID_SERVICIO AND COT.ID_UNIDAD = UNIT.ID_UNIDAD INNER JOIN SLOAA_TC_SERVICIO SERV ON SERV.ID_SERVICIO = UNIT.ID_SERVICIO AND SERV.ID_SERVICIO = UNIT.ID_SERVICIO INNER JOIN SLOAA_TC_TIPO_SERVICIO TIPO ON TIPO.ID_TIPO_SERVICIO = SERV.ID_TIPO_SERVICIO INNER JOIN SLOAA_TC_PRESTADOR_SERVICIOS_X_SERVICIO PRESERV ON PRESERV.ID_PRESTADOR_SERVICIO = COT.ID_PRESTADOR_SERVICIO AND PRESERV.ID_TIPO_SERVICIO = COT.ID_TIPO_SERVICIO AND PRESERV.ID_SERVICIO = COT.ID_SERVICIO INNER JOIN SLOAA_TC_PRESTADOR_SERVICIOS PRES ON PRES.ID_PRESTADOR_SERVICIO = PRESERV.ID_PRESTADOR_SERVICIO AND PRES.ID_ZONA = PRESERV.ID_ZONA AND PRES.ID_SUBZONA = PRESERV.ID_SUBZONA INNER JOIN SLOAA_TC_SUBZONA SUBZ ON SUBZ.ID_ZONA = PRES.ID_ZONA AND SUBZ.ID_SUBZONA = PRES.ID_SUBZONA INNER JOIN SLOAA_TC_ZONA ZONA ON ZONA.ID_ZONA = SUBZ.ID_ZONA \n\
                        WHERE ID_ORDEN_SERVICIO =" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.cotizaciones = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllCotizacionXOrden]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllCotizacionXOrden]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="setDeduccionCotizacion">
app.get('/setDeduccionCotizacion', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/setDeduccionCotizacion]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('idServicioCotizacion', ENC.STRING()),
                    new FieldValidation('deduccionCantidad', ENC.STRING()),
                    new FieldValidation('deduccionTiempo', ENC.STRING()),
                    new FieldValidation('cancelacion', ENC.STRING()),
                    new FieldValidation('deduccion', ENC.STRING()),
                    new FieldValidation('deduccionJustificacion', ENC.STRING()),
                    new FieldValidation('deduccionCumplimiento', ENC.STRING()),
                    new FieldValidation('deduccionIdentificado', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.idServicioCotizacion = req.query.idServicioCotizacion;
                dp.deduccionCantidad = req.query.deduccionCantidad;
                dp.deduccionTiempo = req.query.deduccionTiempo;
                dp.cancelacion = req.query.cancelacion;
                dp.deduccion = req.query.deduccion;
                dp.deduccionJustificacion = req.query.deduccionJustificacion;
                dp.deduccionCumplimiento = req.query.deduccionCumplimiento;
                dp.deduccionIdentificado = req.query.deduccionIdentificado;
                dp.looked = 1;
                return dp;
            })
            .then(function (dp) {
                dp.dml = " UPDATE [dbo].[SLOAA_TR_SERVICIO_COTIZACION] SET   [DEDUCCION_CANTIDAD]=" + dp.deduccionCantidad + " ,[DEDUCCION_TIEMPO]=" + dp.deduccionTiempo + " ,[CANCELACION]=" + dp.cancelacion + "       ,[DEDUCCION]=" + dp.deduccion + ",[DEDUCCION_JUSTIFICACION]='" + dp.deduccionJustificacion + "',[PRECIO_SERVICIO_FINAL]= [COTIZACION]-" + dp.deduccion + ", [CUMPLIMIENTO]=" + dp.deduccionCumplimiento + ", [IDENTIFICADO]=" + dp.deduccionIdentificado + "   \n" +
                        " WHERE \n" +
                        " 1=1\n" +
                        " AND [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "\n" +
                        " AND [ID_SERVICIO_COTIZACION]=" + dp.idServicioCotizacion + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {
                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo aplicar la deduccion";
                    }
                } else {
                    response.success = false;
                    throw " No se pudo aplicar la deduccion";
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/setDeduccionCotizacion]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/setDeduccionCotizacion]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="removeCotizacion">
app.get('/removeCotizacion', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/removeCotizacion]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('idServicioCotizacion', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.idServicioCotizacion = req.query.idServicioCotizacion;
                dp.looked = 1;
                return dp;
            })
            .then(function (dp) {
                dp.dml = " DELETE FROM [dbo].[SLOAA_TR_SERVICIO_COTIZACION] \n" +
                        " WHERE \n" +
                        " 1=1\n" +
                        " AND [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "\n" +
                        " AND [ID_SERVICIO_COTIZACION]=" + dp.idServicioCotizacion + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {
                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo eliminar la cotizacion";
                    }
                } else {
                    response.success = false;
                    throw " No se pudo eliminar la cotizacion";
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/removeCotizacion]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/removeCotizacion]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllSubZona">
app.get('/getAllSubZona', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllSubZona]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('query', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING()),
                ]);
                dp.idZona = req.query.idZona;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT [ID_SUBZONA],[SUBZONA] FROM [SLOAA_TC_SUBZONA] WHERE 1=1 " +
                        "AND [ID_ZONA]=" + dp.idZona;
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.subZona = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllSubZona]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllSubZona]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllTipoServicio">
app.get('/getAllTipoServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllTipoServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('query', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idZona = req.query.idZona;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT \n" +
                        " DISTINCT([SEL].[ID_TIPO_SERVICIO]),\n" +
                        "		  [SEL].[TIPO]\n" +
                        " FROM  (\n" +
                        "		SELECT [PSXS].[ID_PRESTADOR_SERVICIO]\n" +
                        "			  ,[PSXS].[ID_ZONA]\n" +
                        "			  ,[PSXS].[ID_SUBZONA]\n" +
                        "			  ,[PSXS].[ID_TIPO_SERVICIO]\n" +
                        "			  ,[TS].[TIPO]\n" +
                        "			  ,[PSXS].[ID_SERVICIO]\n" +
                        "		  FROM [SLOAA_TC_PRESTADOR_SERVICIOS_X_SERVICIO] [PSXS]\n" +
                        "		  LEFT JOIN [SLOAA_TC_TIPO_SERVICIO] [TS] ON [PSXS].[ID_TIPO_SERVICIO]=[TS].[ID_TIPO_SERVICIO]\n" +
                        "		  WHERE \n" +
                        "		  1=1\n" +
                        "		  AND [PSXS].[ID_ZONA]=" + dp.idZona + "\n" +
                        "  )[SEL] ";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.tipoServicio = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllTipoServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllTipoServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllServicios">
app.get('/getAllServicios', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllServicios]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('idSubZona', ENC.STRING()),
                    new FieldValidation('idTipoServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('query', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idZona = req.query.idZona;
                dp.idSubZona = req.query.idSubZona;
                dp.idTipoServicio = req.query.idTipoServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT \n" +
                        " DISTINCT([SEL].[ID_SERVICIO]),\n" +
                        "		  [SEL].[NOMBRE_SERVICIO]\n" +
                        " FROM  (\n" +
                        "		SELECT [PSXS].[ID_PRESTADOR_SERVICIO]\n" +
                        "			  ,[PSXS].[ID_ZONA]\n" +
                        "			  ,[PSXS].[ID_SUBZONA]\n" +
                        "			  ,[PSXS].[ID_TIPO_SERVICIO]\n" +
                        "			  ,[PSXS].[ID_SERVICIO]\n" +
                        "			  ,[SERV].[NOMBRE_SERVICIO]\n" +
                        "		  FROM [SLOAA_TC_PRESTADOR_SERVICIOS_X_SERVICIO] [PSXS]\n" +
                        "		  LEFT JOIN [SLOAA_TC_SERVICIO] [SERV] ON [PSXS].[ID_SERVICIO]=[SERV].[ID_SERVICIO]\n" +
                        "		  WHERE \n" +
                        "		  1=1\n" +
                        "		  AND [PSXS].[ID_ZONA]=" + dp.idZona + "\n" +
                        "		  AND [PSXS].[ID_SUBZONA]=" + dp.idSubZona + "\n" +
                        "		  AND [PSXS].[ID_TIPO_SERVICIO]=" + dp.idTipoServicio + "\n" +
                        "  )[SEL]";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.servicios = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllServicios]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllServicios]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getAllProvedores">
app.get('/getAllProvedores', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getAllProvedores]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idZona', ENC.STRING()),
                    new FieldValidation('idSubZona', ENC.STRING()),
                    new FieldValidation('idTipoServicio', ENC.STRING()),
                    new FieldValidation('idServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('query', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idZona = req.query.idZona;
                dp.idSubZona = req.query.idSubZona;
                dp.idTipoServicio = req.query.idTipoServicio;
                dp.idServicio = req.query.idServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT \n" +
                        " DISTINCT([SEL].[ID_PRESTADOR_SERVICIO]),\n" +
                        "		  [SEL].[NOMBRE]\n" +
                        " FROM  (\n" +
                        "		SELECT [PSXS].[ID_PRESTADOR_SERVICIO]\n" +
                        "			  ,[PSXS].[ID_ZONA]\n" +
                        "			  ,[PSXS].[ID_SUBZONA]\n" +
                        "			  ,[PSXS].[ID_TIPO_SERVICIO]\n" +
                        "			  ,[PSXS].[ID_SERVICIO]\n" +
                        "			  ,[PS].[NOMBRE]\n" +
                        "			  ,[PS].[CORREO_ELECTRONICO]\n" +
                        "		  FROM [SLOAA_TC_PRESTADOR_SERVICIOS_X_SERVICIO] [PSXS]\n" +
                        "		  LEFT JOIN [SLOAA_TC_PRESTADOR_SERVICIOS] [PS] ON [PSXS].[ID_PRESTADOR_SERVICIO]=[PS].[ID_PRESTADOR_SERVICIO]\n" +
                        "		  WHERE \n" +
                        "		  1=1\n" +
                        "		  AND [PSXS].[ID_ZONA]=" + dp.idZona + "\n" +
                        "		  AND [PSXS].[ID_SUBZONA]=" + dp.idSubZona + "\n" +
                        "		  AND [PSXS].[ID_TIPO_SERVICIO]=" + dp.idTipoServicio + "\n" +
                        "		  AND [PSXS].[ID_SERVICIO]=" + dp.idServicio + "\n" +
                        "  )[SEL]";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.provedores = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getAllProvedores]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getAllProvedores]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getUnidadYPrecioUnitarioXServicio">
app.get('/getUnidadYPrecioUnitarioXServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getUnidadYPrecioUnitarioXServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idTipoServicio', ENC.STRING()),
                    new FieldValidation('idServicio', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('query', ENC.STRING()),
                    new FieldValidation('page', ENC.STRING()),
                    new FieldValidation('start', ENC.STRING()),
                    new FieldValidation('limit', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idTipoServicio = req.query.idTipoServicio;
                dp.idServicio = req.query.idServicio;
                return dp;
            })
            .then(function (dp) {
                dp.query = "SELECT [QRY].*,\n" +
                        "	  [UNI].[UNIDAD]\n" +
                        "	   FROM\n" +
                        "(\n" +
                        "  SELECT \n" +
                        "      DISTINCT([PU].[ID_UNIDAD]),\n" +
                        "	  [PU].[PRECIO_UNITARIO]\n" +
                        "  FROM [dbo].[SLOAA_TR_PRECIO_UNITARIO] [PU]\n" +
                        "  WHERE 1=1 \n" +
                        "  AND [PU].[ID_TIPO_SERVICIO]=" + dp.idTipoServicio + "\n" +
                        "  AND  [PU].[ID_SERVICIO]=" + dp.idServicio + "\n" +
                        ")[QRY]\n" +
                        "LEFT JOIN [dbo].[SLOAA_TC_UNIDAD] [UNI] ON [QRY].[ID_UNIDAD]=[UNI].[ID_UNIDAD]";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    response.unidades = dp.queryResult.rows;
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getUnidadYPrecioUnitarioXServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getUnidadYPrecioUnitarioXServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="firma1OrdenServicioGenerador">
app.get('/firma1OrdenServicioGenerador', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/firma1OrdenServicioGenerador]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('firma1UserId1', ENC.STRING()),
                    new FieldValidation('firma1UserName1', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.firma1UserId1 = req.query.firma1UserId1;
                dp.firma1UserName1 = req.query.firma1UserName1;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [FIRMA1_USER1]='" + dp.firma1UserId1 + "'\n" +
                        "            ,[FIRMA1_USERNAME1]='" + dp.firma1UserName1 + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/firma1OrdenServicioGenerador]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/firma1OrdenServicioGenerador]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>
//<editor-fold defaultstate="collapsed" desc="firma1OrdenServicioSupervisor">
app.get('/firma1OrdenServicioSupervisor', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/firma1OrdenServicioSupervisor]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('firma1UserId2', ENC.STRING()),
                    new FieldValidation('firma1UserName2', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.firma1UserId2 = req.query.firma1UserId2;
                dp.firma1UserName2 = req.query.firma1UserName2;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [FIRMA1_USER2]='" + dp.firma1UserId2 + "'\n" +
                        "            ,[FIRMA1_USERNAME2]='" + dp.firma1UserName2 + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/firma1OrdenServicioSupervisor]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/firma1OrdenServicioSupervisor]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>
//<editor-fold defaultstate="collapsed" desc="firma2OrdenServicioGenerador">
app.get('/firma2OrdenServicioGenerador', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/firma2OrdenServicioGenerador]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('firma2UserId1', ENC.STRING()),
                    new FieldValidation('firma2UserName1', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.firma2UserId1 = req.query.firma2UserId1;
                dp.firma2UserName1 = req.query.firma2UserName1;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [FIRMA2_USER1]='" + dp.firma2UserId1 + "'\n" +
                        "            ,[FIRMA2_USERNAME1]='" + dp.firma2UserName1 + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/firma2OrdenServicioGenerador]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/firma2OrdenServicioGenerador]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>
//<editor-fold defaultstate="collapsed" desc="firma2OrdenServicioSupervisor">
app.get('/firma2OrdenServicioSupervisor', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/firma2OrdenServicioSupervisor]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('firma2UserId2', ENC.STRING()),
                    new FieldValidation('firma2UserName2', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.firma2UserId2 = req.query.firma2UserId2;
                dp.firma2UserName2 = req.query.firma2UserName2;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [FIRMA2_USER2]='" + dp.firma2UserId2 + "'\n" +
                        "            ,[FIRMA2_USERNAME2]='" + dp.firma2UserName2 + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/firma2OrdenServicioSupervisor]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/firma2OrdenServicioSupervisor]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="closeOrdenServicio">
app.get('/closeOrdenServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/closeOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.looked = 1;
                return dp;
            })


            //<editor-fold defaultstate="collapsed" desc="OBTIENE MONTO TOTAL">
            .then(function (dp) {
                dp.query = "  SELECT\n" +
                        "	SUM([COTIZACION]-[DEDUCCION]) TOTAL\n" +
                        "  FROM [dbo].[SLOAA_TR_SERVICIO_COTIZACION] [COT]\n" +
                        "  WHERE 1=1 \n" +
                        "  AND [COT].[ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "" +
                        "  AND [COT].[CANCELACION]=0";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    currentRow = dp.queryResult.rows[0];
                    if (currentRow !== null) {
                        dp.total = currentRow.TOTAL;
                        dp.looked = 1;
                    } else {
                        response.success = false;
                        throw "Problemas con la consulta para obtener monto Total";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo obtener nueva numero  monto Total";
                }
                return dp;
            })
            //</editor-fold>


            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [CIERRE_TOTAL]='" + dp.total + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/closeOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/closeOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="setStatusOrdenServicio">
app.get('/setStatusOrdenServicio', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/setStatusOrdenServicio]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('idStatus', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.idStatus = req.query.idStatus;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {

                dp.dml = " UPDATE [dbo].[SLOAA_TR_ORDEN_SERVICIO] SET\n" +
                        "            [ID_STATUS]='" + dp.idStatus + "'\n" +
                        "WHERE [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/setStatusOrdenServicio]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/setStatusOrdenServicio]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="serviceConfirm">
app.get('/serviceConfirm', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/serviceConfirm]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [

                    new FieldValidation('services', ENC.STRING())

                ]);
                dp.services = req.query.services;
                dp.looked = 1;
                return dp;
            })

            //<editor-fold defaultstate="collapsed" desc="UPDATE">
            .then(function (dp) {


                dp.dml = " UPDATE [SLOAA_TR_SERVICIO_COTIZACION] SET\n" +
                        "            [VALIDA_DISPONIBILIDAD]=1 \n" +
                        "WHERE 1=1 \n";
                //+ " AND [ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + " \n"
                //+ " AND [ID_SERVICIO_COTIZACION]=" + dp.idServicioCotizacion + " \n"
                //+ " AND [ID_TIPO_SERVICIO]=" + dp.idTipoServicio + " \n";
                //dp.dml =dp.dml+ " AND [ID_SERVICIO]=" + dp.idServicio + " \n";


                dp.dml = dp.dml + " AND [ID_SERVICIO_COTIZACION] IN (" + dp.services + ") \n";
                return dp;
            })
            .then(msql.freeDMLPromise)

            .then(function (dp) {
                if (dp.resultDML !== null) {
                    if (dp.resultDML.rowsAffected.length > 0) {

                        response.success = true;
                    } else {
                        response.success = false;
                        throw "No se pudo añadir el servicio";
                    }
                } else {
                    response.success = false;
                    throw "No se pudo añadir el servicio";
                }
                return dp;
            })
            //</editor-fold>



            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/serviceConfirm]');
                res.render("confirmacion", {
                    title: 'Confirmacion'
                });
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/serviceConfirm]');
                res.render("error", {
                    error: err.message,
                    title: 'Confirmacion'
                });
            });
});
//</editor-fold>

var ip = '10.15.17.158';
var port = '3000';
//<editor-fold defaultstate="collapsed" desc="sendMailConfirmacionProvedor">
app.get('/sendMailConfirmacionProvedor', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/sendMailConfirmacionProvedor]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idOrdenServicio', ENC.STRING()),
                    new FieldValidation('idcredencialSolicitante', ENC.STRING()),
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                dp.idOrdenServicio = req.query.idOrdenServicio;
                dp.idcredencialSolicitante = req.query.idcredencialSolicitante;
                dp.provedorServicioList = {};
                dp.mailProvedores = "";
                dp.mailPromisses = [];
                prom1 = function (inputObject) {
                    return new Promise(function (resolve, reject) {
                        console.log("1" + inputObject);
                        resolve(inputObject);
                        return;
                    });
                };
                prom2 = function (inputObject) {
                    console.log("2" + inputObject);
                    return new Promise(function (resolve, reject) {
                        resolve(inputObject);
                        return;
                    });
                };
                prom3 = function (inputObject) {
                    console.log("3" + inputObject);
                    return new Promise(function (resolve, reject) {
                        resolve(inputObject);
                        return;
                    });
                };
                proms = [prom1, prom2, prom3];
                Promise.all(proms);
                return dp;
            })


            //<editor-fold defaultstate="collapsed" desc="FORMATEA OBJETOS MAIL">
            .then(function (dp) {
                dp.query = "SELECT\n" +
                        "\n" +
                        "          [COT].[ID_SERVICIO_COTIZACION]\n" +
                        "	  \n" +
                        "	  ,[OS].[ID_ORDEN_SERVICIO]\n" +
                        "	  ,[OS].[DOMICILIO]\n" +
                        "	  ,[OS].[LLAVE_SISTEMA]\n" +
                        "	  ,[OS].[FECHA_SOLICITUD]\n" +
                        "\n" +
                        "	  \n" +
                        "      ,[TS].[ID_TIPO_SERVICIO]\n" +
                        "	  ,[TS].[TIPO]\n" +
                        "\n" +
                        "      ,[SERV].[ID_SERVICIO]\n" +
                        "	  ,[SERV].[NOMBRE_SERVICIO]\n" +
                        "\n" +
                        "\n" +
                        "      ,[ZON].[ID_ZONA]\n" +
                        "	  ,[ZON].[ZONA]\n" +
                        "\n" +
                        "      ,[SZON].[ID_SUBZONA]\n" +
                        "	  ,[SZON].[SUBZONA]\n" +
                        "\n" +
                        "         ,[PS].[ID_PRESTADOR_SERVICIO]\n" +
                        "	  ,[PS].[NOMBRE]\n" +
                        "	  ,[PS].[CORREO_ELECTRONICO]\n" +
                        "\n" +
                        "	  ,[UNI].[ID_UNIDAD]\n" +
                        "	  ,[UNI].[UNIDAD]\n" +
                        "	 \n" +
                        "	  ,[COT].[CANTIDAD]\n" +
                        "	  ,[COT].[COTIZACION]\n" +
                        "	 \n" +
                        "	  ,[PSM].[EMAIL] MAILSENDER \n" +
                        "	  ,[PSM].[RESPONSE] \n" +
                        "	 \n" +
                        "	  ,[CRED].[ID_CREDENCIAL]\n" +
                        "	  ,[CRED].[USUARIO_NOMBRE]\n" +
                        "	 \n" +
                        "	  ,[AUTH].[ID_AUTORIDAD]\n" +
                        "	  ,[AUTH].[NOMBRE_AUTORIDAD]\n" +
                        "\n" +
                        "  FROM [SLOAA_TR_SERVICIO_COTIZACION] [COT]\n" +
                        "  \n" +
                        "  \n" +
                        "	  LEFT JOIN  [SLOAA_TC_PRESTADOR_SERVICIOS] [PS] ON \n" +
                        "	  [PS].[ID_PRESTADOR_SERVICIO]=[COT].[ID_PRESTADOR_SERVICIO]  AND [PS].[ID_ZONA]=[COT].[ID_ZONA] AND [PS].[ID_SUBZONA]=[COT].[ID_SUBZONA]\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TR_ORDEN_SERVICIO] [OS] ON \n" +
                        "	  [COT].[ID_ORDEN_SERVICIO]=[OS].[ID_ORDEN_SERVICIO]\n" +
                        "\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TR_CREDENCIAL] [CRED] ON \n" +
                        "     	  [OS].[ID_CREDENCIAL]=[CRED].[ID_CREDENCIAL]\n" +
                        "\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TC_AUTORIDAD] [AUTH] ON \n" +
                        "	  [CRED].[ID_AUTORIDAD]=[AUTH].[ID_AUTORIDAD]\n" +
                        "\n" +
                        "\n" +
                        "	  LEFT JOIN [SLOAA_TC_TIPO_SERVICIO]  [TS] ON \n" +
                        "	  [COT].[ID_TIPO_SERVICIO]=[TS].[ID_TIPO_SERVICIO]\n" +
                        "\n" +
                        "	   LEFT JOIN [SLOAA_TC_SERVICIO]  [SERV] ON \n" +
                        "	  [COT].[ID_TIPO_SERVICIO]=[SERV].[ID_TIPO_SERVICIO] AND [COT].[ID_SERVICIO]=[SERV].[ID_SERVICIO]\n" +
                        "\n" +
                        "\n" +
                        "	   LEFT JOIN  [SLOAA_TC_ZONA] [ZON] ON \n" +
                        "	  [COT].[ID_ZONA]=[ZON].[ID_ZONA]\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TC_SUBZONA] [SZON] ON \n" +
                        "	  [COT].[ID_ZONA]=[SZON].[ID_ZONA] AND [COT].[ID_SUBZONA]=[SZON].[ID_SUBZONA]\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TC_UNIDAD] [UNI] ON \n" +
                        "	  [COT].[ID_UNIDAD]=[UNI].[ID_UNIDAD]\n" +
                        "\n" +
                        "	  LEFT JOIN  [SLOAA_TR_PRESTADOR_SERVICIOS_MAILS] [PSM] ON  \n" +
                        "	  [PSM].[ID_ZONA]=[PS].[ID_ZONA] AND [PSM].[ID_SUBZONA]=[PS].[ID_SUBZONA] AND [PSM].[ID_PRESTADOR_SERVICIO]=[PS].[ID_PRESTADOR_SERVICIO] \n" +
                        "\n" +
                        "  WHERE  1=1\n" +
                        "  \n" +
                        "  AND [COT].[ID_ORDEN_SERVICIO]=" + dp.idOrdenServicio + "";
                "  AND [COT].[VALIDA_DISPONIBILIDAD]=0";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                if (dp.queryResult.rows !== null) {
                    rows = dp.queryResult.rows;
                    for (var i = 0; i < rows.length; i++) {
                        currentRow = rows[i];
                        currentZona = currentRow.ID_ZONA;
                        currentSubzona = currentRow.ID_SUBZONA;
                        currentProvedorServicio = currentRow.ID_PRESTADOR_SERVICIO;
                        currentProvedorServicioList = dp.provedorServicioList;
                        currentProvedorServicioObject = currentProvedorServicioList[currentZona + "-" + currentSubzona + "-" + currentProvedorServicio];
                        if (typeof currentProvedorServicioObject === "undefined") {
                            currentProvedorServicioObject = {
                                idCotizaciones: "",
                                currentLlaveSistema: currentRow.LLAVE_SISTEMA,
                                domicilio: currentRow.DOMICILIO,
                                idServicioCotizacion: currentRow.ID_SERVICIO_COTIZACION,
                                idOrdenServicio: currentRow.ID_ORDEN_SERVICIO,
                                idTipoServicio: currentRow.ID_TIPO_SERVICIO,
                                idServicio: currentRow.ID_SERVICIO,
                                email: currentRow.CORREO_ELECTRONICO,
                                usuarioNombre: currentRow.USUARIO_NOMBRE,
                                fechaSolicitud: currentRow.FECHA_SOLICITUD,
                                nombreAutoridad: currentRow.NOMBRE_AUTORIDAD,
                                cotizado: 0,
                                emailSenders: {},
                                servicios: {}
                            };
                            currentProvedorServicioList[currentZona + "-" + currentSubzona + "-" + currentProvedorServicio] = currentProvedorServicioObject;
                        }



                        currentServicio = currentProvedorServicioObject.servicios[currentRow.ID_SERVICIO_COTIZACION];
                        if (typeof currentServicio === "undefined") {
                            currentServicio = {
                                idServicioCotizacion: currentRow.ID_SERVICIO_COTIZACION,
                                idOrdenServicio: currentRow.ID_ORDEN_SERVICIO,
                                domicilio: currentRow.DOMICILIO,
                                llaveSistema: currentRow.LLAVE_SISTEMA,
                                idTipoServicio: currentRow.ID_TIPO_SERVICIO,
                                tipo: currentRow.TIPO,
                                idServicio: currentRow.ID_SERVICIO,
                                nombreServicio: currentRow.NOMBRE_SERVICIO,
                                idZona: currentRow.ID_ZONA,
                                zona: currentRow.ZONA,
                                idSubzona: currentRow.ID_SUBZONA,
                                subzona: currentRow.SUBZONA,
                                idPrestadorServicio: currentRow.ID_PRESTADOR_SERVICIO,
                                nombre: currentRow.NOMBRE,
                                correoElectronico: currentRow.CORREO_ELECTRONICO,
                                idUnidad: currentRow.ID_UNIDAD,
                                unidad: currentRow.UNIDAD,
                                cantidad: currentRow.CANTIDAD,
                                cotizacion: currentRow.COTIZACION
                            };
                            currentProvedorServicioObject.cotizado = currentProvedorServicioObject.cotizado + currentRow.COTIZACION;
                            currentProvedorServicioObject.servicios[currentRow.ID_SERVICIO_COTIZACION] = currentServicio;
                            if (currentProvedorServicioObject.idCotizaciones.length === 0) {
                                currentProvedorServicioObject.idCotizaciones = currentProvedorServicioObject.idCotizaciones + currentRow.ID_SERVICIO_COTIZACION + "";
                            } else {
                                currentProvedorServicioObject.idCotizaciones = currentProvedorServicioObject.idCotizaciones + "," + currentRow.ID_SERVICIO_COTIZACION;
                            }
                        }


                        currentMailSender = currentProvedorServicioObject.emailSenders[currentRow.MAILSENDER];
                        if (typeof currentMailSender === "undefined") {
                            currentMailSender = {
                                emailSender: currentRow.MAILSENDER,
                                responseM: currentRow.RESPONSE
                            };
                            currentProvedorServicioObject.emailSenders[currentRow.MAILSENDER] = currentMailSender;
                        }



                    }
                    response.success = true;
                } else {
                    response.success = false;
                }
                return dp;
            })
            //</editor-fold>
            .then(function (dp) {
                for (var key in dp.provedorServicioList) {
                    currentProvedorServicioObject = dp.provedorServicioList[key];
//                    currentMailObject.idCotizaciones;
//                    currentMailObject.currentMail;
//                    currentMailObject.servicios;

                    data = "";
                    data = data + "<p><img src='https://tramitesdigitales.sat.gob.mx/SIPRED.Monitor.Externo/images/logoH_col.svg' height='200' width='200'/></p> ";
                    //data = data + "<p><a href='http://"+ip+":"+port+"/serviceConfirm?services=" + currentMailObject.idCotizaciones + "&idOrdenServicio="+currentMailObject.idOrdenServicio+"&idServicioCotizacion="+currentMailObject.idServicioCotizacion+"&idTipoServicio="+currentMailObject.idTipoServicio+"&idServicio="+currentMailObject.idServicio+"'    >Verifica tu disponibilidad</a></p>";
                    data = data + "<div align='center' ></div>";
                    data = data + "<br>&nbsp";
                    data = data + "<br>&nbsp";
                    data = data + "<br>&nbsp";
                    data = data + "<br>&nbsp";
                    data = data + "<table cellspacing=1 border=1 bgcolor='gray' color='white' width=100%>";
                    data = data + "  <tr><td> Orden de servicio [" + currentProvedorServicioObject.currentLlaveSistema + "] </td></tr>";
                    data = data + "  <tr><td> Domicilio [" + currentProvedorServicioObject.domicilio + "] </td></tr>";
                    data = data + "</table>";
                    data = data + "<table cellspacing=1 border=1 bgcolor='#b5b5b5' width=100%>";
                    data = data + "  <tr>";
                    data = data + "      <td>Tipo de Servicio</td>";
                    data = data + "      <td>Servicio</td>";
                    data = data + "      <td>Unidades</td>";
                    data = data + "      <td>Cantidad</td>";
                    data = data + "      <td>Cotizacion</td>";
                    data = data + "  </tr>";
                    for (var serviceKey in currentProvedorServicioObject.servicios) {
                        currentServiceObject = currentProvedorServicioObject.servicios[serviceKey];
                        data = data + "  <tr>";
                        data = data + "      <td>" + currentServiceObject.tipo + "</td>";
                        data = data + "      <td>" + currentServiceObject.nombreServicio + "</td>";
                        data = data + "      <td>" + currentServiceObject.unidad + "</td>";
                        data = data + "      <td>" + currentServiceObject.cantidad + "</td>";
                        data = data + "      <td>" + currentServiceObject.cotizacion + "</td>";
                        data = data + "  </tr>";
                    }
                    data = data + "</table>";
                    for (var emailSenderKey in currentProvedorServicioObject.emailSenders) {
                        currentMailSender = currentProvedorServicioObject.emailSenders[emailSenderKey];
                        mailto = new String(currentMailSender.emailSender);
                        mc.debug("Envio  a correo tipo:[Validador] [" + currentMailSender.emailSender + "] verificacion :[" + currentMailSender.responseM + "]");
                        if (currentMailSender.responseM === 1) {
                            responseF = "<br>&nbsp<br>&nbsp<br>&nbsp<table><tr><td><a href='http://" + ip + ":" + port + "/serviceConfirm?services=" + currentProvedorServicioObject.idCotizaciones + "'    >Verifica tu disponibilidad haciendo click [AQUI]</a></td></tr></table>";
                            mc.info(data + responseF);
                            dpp = {};
                            dpp.mailParameters = mailParameters1;
                            dpp.from = 'contacto@enclave.com.mx';
                            dpp.to = mailto + "";
                            dpp.subject = 'Confirma Disponibilidad [Valida]';
                            dpp.text = ' ';
                            dpp.html = data + responseF;
                            mailManater = new ENCManagerMail();
                            mailManater.sendMail(dpp);
                        } else {
                            mc.info(data);
                            dpp = {};
                            dpp.mailParameters = mailParameters1;
                            dpp.from = 'contacto@enclave.com.mx';
                            dpp.to = mailto + "";
                            dpp.subject = 'Enterado Disponibilidad';
                            dpp.text = ' ';
                            dpp.html = data;
                            mailManater = new ENCManagerMail();
                            mailManater.sendMail(dpp);
                        }
                    }
                }

                return dp;
            })

            .then(function (dp) {
                dp.query = "SELECT \n" +
                        "[CRED].[ID_CREDENCIAL] ID_CREDENCIAL,\n" +
                        "[CRED].[EMAIL] EMAIL,\n" +
                        "[CRED].[ID_CREDENCIAL_SUPERIOR] ID_CREDENCIAL_SUPERIOR,\n" +
                        "[CRED_SUP].[EMAIL] EMAIL_SUPERIOR\n" +
                        "FROM\n" +
                        "[SLOAA_TR_CREDENCIAL] [CRED]\n" +
                        "LEFT JOIN  [SLOAA_TR_CREDENCIAL] [CRED_SUP] ON [CRED].[ID_CREDENCIAL_SUPERIOR]=[CRED_SUP].[ID_CREDENCIAL]\n" +
                        "WHERE\n" +
                        "[CRED].[ID_CREDENCIAL]=" + dp.idcredencialSolicitante + " ";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                dp.emailSolicitante = null;
                dp.emailSolicitanteSuperior = null;
                if (dp.queryResult.rows !== null) {
                    rows = dp.queryResult.rows;
                    for (var i = 0; i < rows.length; i++) {
                        currentRow = rows[i];
                        dp.emailSolicitante = currentRow.EMAIL;
                        dp.emailSolicitanteSuperior = currentRow.EMAIL_SUPERIOR;
                    }
                }
                return dp;
            })
            .then(function (dp) {
                for (var key in dp.provedorServicioList) {
                    currentProvedorServicioObject = dp.provedorServicioList[key];
                    data2 = "";
                    data2 = data2 + "<div align='center' ></div>";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<table cellspacing=1 width=100%>";
                    data2 = data2 + "<tr>";
                    data2 = data2 + "<td width=30%>";
                    data2 = data2 + "<img src='https://tramitesdigitales.sat.gob.mx/SIPRED.Monitor.Externo/images/logoH_col.svg' height='200' width='200'/>"
                    data2 = data2 + "</td>";
                    data2 = data2 + "<td width=40%>";
                    data2 = data2 + "SERVICIO DE ADMINISTRACIÓN TRIBUTARIA<BR> ADMINISTRACIÓN GENERAL DE RECURSOS Y SERVICIOS<BR> ADMINISTRACIÓN CENTRAL DE DESTINO DE BIENES<BR>";
                    data2 = data2 + "</td>";
                    data2 = data2 + "<td width=30%>";
                    data2 = data2 + "</td>";
                    data2 = data2 + "</tr>";
                    data2 = data2 + "</table>";
                    data2 = data2 + "<table cellspacing=1 width=100%>";
                    data2 = data2 + "<tr>";
                    data2 = data2 + "<td width=100%>";
                    data2 = data2 + "SERVICIO LOGISTICO PARA LA OPERACIÓN DE LAS AUTORIDADES ADUANERAS, FISCALES Y ADMINISTRATIVAS 2018";
                    data2 = data2 + "</td>";
                    data2 = data2 + "</tr>";
                    data2 = data2 + "</table>";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<br>&nbsp";
                    data2 = data2 + "<div align='center'>";
                    data2 = data2 + "<table cellspacing=1 border=1 bgcolor='gray' color='white' width=500>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td>";
                    data2 = data2 + "SOLICITUD DE SERVICIO No.";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td>";
                    data2 = data2 + currentProvedorServicioObject.currentLlaveSistema;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td bgcolor='#666666' width=50%>";
                    data2 = data2 + "Nombre de la Unidad Administrativa que solicita el servicio:";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td bgcolor='#BBBBBB' width=50%>";
                    data2 = data2 + currentProvedorServicioObject.nombreAutoridad;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td bgcolor='#666666' width=50%>";
                    data2 = data2 + "Domicilio:";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td bgcolor='#BBBBBB' width=50%>";
                    data2 = data2 + currentProvedorServicioObject.domicilio;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td bgcolor='#666666' width=50%>";
                    data2 = data2 + "Fecha y Hora:";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td bgcolor='#BBBBBB' width=50%>";
                    data2 = data2 + currentProvedorServicioObject.fechaSolicitud;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td bgcolor='#666666' width=50%>";
                    data2 = data2 + "Precio del Servicio:";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td bgcolor='#BBBBBB' width=50%>";
                    data2 = data2 + currentProvedorServicioObject.cotizado;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "  <tr>";
                    data2 = data2 + "  <td bgcolor='#666666' width=50%>";
                    data2 = data2 + "Persona designada para solicitar los servicios:";
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  <td bgcolor='#BBBBBB' width=50%>";
                    data2 = data2 + currentProvedorServicioObject.usuarioNombre;
                    data2 = data2 + "  </td>";
                    data2 = data2 + "  </tr>";
                    data2 = data2 + "</table>";
                    data2 = data2 + "</div>";
                    if (dp.emailSolicitante !== null) {
                        mc.debug("Envio a correo tipo:[SAT] [" + dp.emailSolicitante + "] Solicitante");
                        mailto = "";
                        mailto = dp.emailSolicitante;
                        mc.info(data2);
                        dpp = {};
                        dpp.mailParameters = mailParameters1;
                        dpp.from = 'contacto@enclave.com.mx';
                        dpp.to = mailto;
                        dpp.subject = 'Email SAT';
                        dpp.text = ' ';
                        dpp.html = data2;
                        mailManater = new ENCManagerMail();
                        mailManater.sendMail(dpp);
                    }
                    if (dp.emailSolicitanteSuperior !== null) {
                        mc.debug("Envio  a correo tipo:[SAT] [" + dp.emailSolicitante + "] Solicitante Superior");
                        mailto = "";
                        mailto = dp.emailSolicitante;
                        mc.info(data2);
                        dpp = {};
                        dpp.mailParameters = mailParameters1;
                        dpp.from = 'contacto@enclave.com.mx';
                        dpp.to = mailto;
                        dpp.subject = 'Email SAT';
                        dpp.text = ' ';
                        dpp.html = data2;
                        mailManater = new ENCManagerMail();
                        mailManater.sendMail(dpp);
                    }


                }
                return dp;
            })
            .then(function (dp) {
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/sendMailConfirmacionProvedor]');
                console.log(dp);
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/sendMailConfirmacionProvedor]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>


//<editor-fold defaultstate="collapsed" desc="getReport">
app.get('/getReport', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getReport]');
                return dp;
            })
            .then(function (dp) {

                inputValidation(response, req.query, [
                    new FieldValidation('idAutoridad', ENC.STRING()),
                    new FieldValidation('idOrden', ENC.STRING()),
                    new FieldValidation('mensual', ENC.STRING()),
                    new FieldValidation('userName', ENC.STRING()),
                    new FieldValidation('eFirma', ENC.STRING())
                ]);
                dp.idAutoridad = req.query.idAutoridad;
                dp.idOrden = req.query.idOrden;
                dp.mensual = req.query.mensual;
                dp.mailList = {};
                dp.userName = req.query.userName;
                dp.eFirma = req.query.eFirma;
                return dp;
            })
            .then(function (dp) {
                var now = new Date();
                var month = now.getMonth() + 1;
                var year = now.getFullYear();
                var fMonth = month - 1;
                var fYear = year;
                if (fMonth === 0) {
                    fMonth = 12;
                    fYear = fYear - 1;
                }

                dp.fMonth = fMonth;
                dp.fYear = fYear;
                dp.query = "SELECT \n" +
                        "	  [TS].[TIPO]\n" +
                        "	, [SERV].*\n" +
                        "	, [ORD].* \n" +
                        "	, [UNI].* \n" +
                        "	, [SS].* \n" +
                        "	, [CRED].* \n" +
                        "	, [AUTH].* \n" +
                        //"       , "
                        "FROM [SLOAA_TR_SERVICIO_COTIZACION] [SERV]\n" +
                        "LEFT JOIN [SLOAA_TR_ORDEN_SERVICIO] [ORD] ON  [SERV].[ID_ORDEN_SERVICIO]=[ORD].[ID_ORDEN_SERVICIO]\n" +
                        "LEFT JOIN [SLOAA_TC_UNIDAD] [UNI] ON  [SERV].[ID_UNIDAD]=[UNI].[ID_UNIDAD]\n" +
                        "LEFT JOIN [SLOAA_TC_TIPO_SERVICIO] [TS] ON  [SERV].[ID_TIPO_SERVICIO]=[TS].[ID_TIPO_SERVICIO]\n" +
                        "LEFT JOIN [SLOAA_TC_SERVICIO] [SS] ON  [SERV].[ID_SERVICIO]=[SS].[ID_SERVICIO] and [SERV].[ID_TIPO_SERVICIO]=[SS].[ID_TIPO_SERVICIO]\n" +
                        "LEFT JOIN [SLOAA_TR_CREDENCIAL] [CRED] ON  [CRED].[ID_CREDENCIAL]=[ORD].[ID_CREDENCIAL]\n" +
                        "LEFT JOIN [SLOAA_TC_AUTORIDAD] [AUTH] ON  [AUTH].[ID_AUTORIDAD]=[CRED].[ID_AUTORIDAD]\n" +
                        "\n" +
                        "WHERE \n" +
                        "1=1\n";
                if (dp.mensual !== "") {
                    dp.query = dp.query + " AND [SERV].[CANCELACION]=0  \n";
                    dp.query = dp.query + " AND [ORD].[ID_STATUS]=7 \n";
                    //dp.query = dp.query + " AND MONTH([ORD].[FECHA_SOLICITUD])=MONTH(GetDate()) \n";
                    //dp.query = dp.query + " AND YEAR([ORD].[FECHA_SOLICITUD])=YEAR(GetDate()) \n";
                    dp.query = dp.query + " AND MONTH([ORD].[FECHA_SOLICITUD])=" + fMonth + " \n";
                    dp.query = dp.query + " AND YEAR([ORD].[FECHA_SOLICITUD])=" + fYear + " \n";
                    dp.tipoReporte = "MENSUAL";
                } else {
                    dp.tipoReporte = "";
                }

                if (dp.idAutoridad !== "") {
                    dp.query = dp.query + " AND [AUTH].[ID_AUTORIDAD]=" + dp.idAutoridad + " \n";
                }
                if (dp.idOrden !== "") {
                    dp.query = dp.query + " AND [ORD].[ID_ORDEN_SERVICIO]=" + dp.idOrden + " \n";
                }


                dp.query = dp.query + "\n" +
                        "ORDER BY\n" +
                        "[ORD].[FECHA_SOLICITUD],\n" +
                        "[ORD].[ID_ORDEN_SERVICIO],\n" +
                        "[SERV].[ID_SERVICIO]";
                return dp;
            })
            .then(msql.selectPromise)
            .then(function (dp) {
                //response = dp.queryResult;
                if (dp.queryResult.rows !== null) {
                    dp.servicios = dp.queryResult.rows;
                    dp.success = true;
                } else {
                    throw new Error("Error de parametros");
                }
                return dp;
            })
            .then(function (dp) {

                dp.ordenes = {};
                for (var currentKey in dp.servicios) {
                    currentRow = dp.servicios[currentKey];
                    currentOrden = dp.ordenes[currentRow.LLAVE_SISTEMA];
                    dp.nombreAutoridad = currentRow.NOMBRE_AUTORIDAD;
                    dp.llaveOrdenMensual = "MX-SAT-TN-" + currentRow.SERVICIO + "-" + dp.fYear + "-" + dp.fMonth;
                    dp.llaveOrdenMensual = dp.llaveOrdenMensual.replace(/\|/g, "");
                    dp.llaveOrdenMensual = dp.llaveOrdenMensual.replace(/\s+/g, ' ');
                    if (typeof currentOrden === "undefined") {

                        var textoFirmaRevisor = '';
                        var textoFirmaGenerador = '';
                        var firmaGenerador = '';
                        var firmaRevisor = '';
                        var firmaGeneradorNombre = '';
                        var firmaRevisorNombre = '';
                        if (currentRow.FIRMA1_USER1 !== null && currentRow.FIRMA1_USER1 !== '') {
                            firmaGenerador = currentRow.FIRMA1_USER1;
                            firmaGeneradorNombre = currentRow.FIRMA1_USERNAME1;
                            textoFirmaGenerador = "Firma inicial Generador ";
                        }
                        if (currentRow.FIRMA1_USER2 !== null && currentRow.FIRMA1_USER2 !== '') {
                            firmaRevisor = currentRow.FIRMA1_USER2;
                            firmaRevisorNombre = currentRow.FIRMA1_USERNAME2;
                            textoFirmaRevisor = "Firma inicial Revisor ";
                        }
                        if (currentRow.FIRMA2_USER1 !== null && currentRow.FIRMA2_USER1 !== '') {
                            firmaGenerador = currentRow.FIRMA2_USER1;
                            firmaGeneradorNombre = currentRow.FIRMA2_USERNAME1;
                            textoFirmaGenerador = "Firma final Generador ";
                        }
                        if (currentRow.FIRMA2_USER2 !== null && currentRow.FIRMA2_USER2 !== '') {
                            firmaRevisor = currentRow.FIRMA2_USER2;
                            firmaRevisorNombre = currentRow.FIRMA2_USERNAME2;
                            textoFirmaRevisor = "Firma final Revisor ";
                        }


                        currentOrden = {
                            llaveSistema: currentRow.LLAVE_SISTEMA,
                            idOrdenServicio: currentRow.ID_ORDEN_SERVICIO,
                            fechaSolicitud: currentRow.FECHA_SOLICITUD.toISOString().replace("T", " ").replace("Z", " "),
                            domicilio: currentRow.DOMICILIO,
                            firmaGenerador: firmaGenerador,
                            firmaRevisor: firmaRevisor,
                            firmaGeneradorNombre: firmaGeneradorNombre,
                            firmaRevisorNombre: firmaRevisorNombre,
                            textoFirmaGenerador: textoFirmaGenerador,
                            textoFirmaRevisor: textoFirmaRevisor,
                            cotizacion: 0,
                            deducciones: 0,
                            total: 0,
                            cumplimiento: "[   ]",
                            identificado: "[   ]",
                            servicios: [],
                            deduccionJustificacionAll: "",
                            deduccionJustificacionAllCount: 0
                        };
                        dp.ordenes[currentRow.LLAVE_SISTEMA] = currentOrden;
                    }

                    currentOrden.servicios.push(dp.servicios[currentKey]);

                    cotizacion = Number(currentRow.COTIZACION);
                    deduccion = Number(currentRow.DEDUCCION);

                    if (!isNaN(cotizacion)) {
                        currentOrden.cotizacion = currentOrden.cotizacion + cotizacion;
                    }
                    if (!isNaN(deduccion)) {
                        currentOrden.deducciones = currentOrden.deducciones + deduccion;
                    }

                    currentOrden.total = currentOrden.cotizacion - currentOrden.deducciones;
                    if (currentRow.CUMPLIMIENTO === 1) {
                        currentOrden.cumplimiento = "[ X ]";
                    }
                    if (currentRow.IDENTIFICADO === 1) {
                        currentOrden.identificado = "[ X ]";
                    }

                    nombreServicio = currentRow.NOMBRE_SERVICIO;
                    deduccionJustificacion = currentRow.DEDUCCION_JUSTIFICACION;
                    if (deduccionJustificacion !== null && deduccionJustificacion !== "") {
                        currentOrden.deduccionJustificacionAllCount++;
                        currentOrden.deduccionJustificacionAll = currentOrden.deduccionJustificacionAll + " " + currentOrden.deduccionJustificacionAllCount + ")" + nombreServicio + " : " + deduccionJustificacion + "  / Monto deducido: " + deduccion + "      ";
                    }
                }


                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getReport]');
                if (dp.idOrden !== '') {
                    res.render("ordenServicio", {
                        tipoReporte: dp.tipoReporte,
                        nombreAutoridad: dp.nombreAutoridad,
                        ordenes: dp.ordenes,
                        servicios: dp.servicios,
                        title: 'Orden de Servicio'
                    });
                } else {
                    res.render("prefactura", {
                        tipoReporte: dp.tipoReporte,
                        nombreAutoridad: dp.nombreAutoridad,
                        llaveOrdenMensual: dp.llaveOrdenMensual,
                        ordenes: dp.ordenes,
                        servicios: dp.servicios,
                        title: 'Prefactura',
                        userName: dp.userName,
                        eFirma: dp.eFirma
                    });
                }

                //res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getReport]');
                response.error = err.message;
                res.render("error", {
                    error: err.message,
                    title: 'Prefactura'
                });
                //res.render("view1");
                //res.jsonp(response);
            });
});
//</editor-fold>




//<editor-fold defaultstate="collapsed" desc="getCurDate">
app.get('/getCurDate', function (req, res) {
    var requestID = new Date().getTime();
    var response = {};
    var dataPacket = {
        requestID: requestID,
        connectionParameters: SQLServerConnectionParameters,
        looked: 0
    };
    mn.init(dataPacket)
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[START]:[/getCurDate]');
                return dp;
            })
            .then(function (dp) {
                inputValidation(response, req.query, [
                    new FieldValidation('_dc', ENC.STRING()),
                    new FieldValidation('callback', ENC.STRING())
                ]);
                response.success = false;
                return dp;
            })
            .then(function (dp) {

                var now = new Date();
                response.curDay = now.getDay();
                response.curMonth = now.getMonth() + 1;
                response.curYear = now.getFullYear();
                response.avalible = false;
                if (response.curDay <= 10) {
                    response.avalible = true;
                }
                response.leftDay = 10 - response.curDay;
                response.success = true;
                return dp;
            })
            .then(function (dp) {
                mc.info('RID:[' + requestID + ']-[REQUEST]-[END]:[/getCurDate]');
                res.jsonp(response);
            })
            .catch(function (err) {
                mc.error('RID:[' + requestID + ']-[REQUEST]-[ERROR]:[' + err.message + ']:[/getCurDate]');
                response.error = err.message;
                res.jsonp(response);
            });
});
//</editor-fold>

app.set('port', (process.env.PORT || 3000));
var server = app.listen(app.get('port'), function () {
    mc.info('[BACKEND]-[WEBSERVICES] init on port:[' + app.get('port') + ']');
});






