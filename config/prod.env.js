'use strict'
module.exports = {
    NODE_ENV: '"production"',
    SERVER_ENV: ('"' + process.argv.splice(2)[0] + '"') || '"prod"'
}
