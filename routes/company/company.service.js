var Company = require('./company.model');
var Promise = require('bluebird');


// Get All
function getAllCompanies() {
    return Company.find({}, function(err, companies) {
        if (err) {
            return Promise.reject({
                success: false,
                message: err
            })
        }

        return Promise.resovle(companies);
    })
}

// Get Company
function getCompany(id) {
    return Company.find({_id: id}).exec().then(function(company) {
        return Promise.resolve(company);
    }).catch(function(err) {
        return Promise.reject(err);
    })
}

// Add a new Company
function addCompany(company) {
    return new Promise(function(resolve, reject) {
        var newCompany = new Company(company);

        newCompany.save(function(err, company) {
            if (err) {
                return reject(err);
            }

            return resolve(company);
        })
    })
}

// Delete a company
function removeCompany(id) {
    return new Promise(function(resolve, reject) {
        Company.remove({
            _id: id
        }, function(err) {
            if (err) {
                reject(err);
            }
            resolve();
        })
    })
}

// Get company by owner id
function getByOwnerId(id) {
    return new Promise(function(resolve, reject) {
        Company.find({
            ownerId: id
        }).exec().then(function(company) {
            return resolve(company);
        }).catch(function(err) {
            return reject(err);
        })
    })
}

module.exports = {
    getAll: getAllCompanies,
    get: getCompany,
    add: addCompany,
    delete: removeCompany,
    getByOwnerId: getByOwnerId
};