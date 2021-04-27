/**
 * @fileoverview Code Climate compatible formatter
 * @author Egor Talantsev
 */

"use strict";

//------------------------------------------------------------------------------
// Helper Functions
//------------------------------------------------------------------------------

/**
 * Returns the severity of warning or error
 * @param {Object} message message object to examine
 * @returns {string} severity level
 * @private
 */
function getMessageType(message) {
    if (message.fatal || message.severity === 2) {
        return "critical";
    }
    return "minor";
}

/**
 * Returns fingerprint of violation
 * @param {string} path to file
 * @param {Object} message message object to examine
 * @returns {string} hash of the message
 * @private
 */
function getHash(path, message) {
    const crypto = require('crypto');
    return crypto
        .createHash('md5')
        .update(message.ruleId + message.message + path + message.line)
        .digest('hex');
}


//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = function(results) {

    let output = [];
    results.forEach(result => {
        result.messages.forEach(message => {
            output.push({
                'type': 'issue',
                'check_name': message.ruleId,
                'description': message.message,
                'categories': [message.ruleId],
                'severity': getMessageType(message),
                'fingerprint': getHash(result.filePath, message),
                'location': {
                    path: result.filePath,
                    lines: {
                        begin: message.line,
                        end: message.line
                    }
                }

            })
        });
    });

    return JSON.stringify(output);
};
