/**
 * check auto-generated selectors
 * @param {String} val
 * @return {boolean} is auto-generated
 */
function autogenCheck(val){
    if(!val){
        return false;
    }
    if(/\d{4,}/.test(val)){
        return true;
    }
    if(/^[0-9_-]+$/.test(val)){
        return true;
    }
    if(/^_\d{2,}/.test(val)){
        return true;
    }
    if(/([a-fA-F_-]*[0-9_-]){6,}/.test(val)){
        return true;
    }
    return false;
}
exports.autogenCheck = autogenCheck;
