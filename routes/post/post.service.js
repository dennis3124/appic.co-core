var Post = require('./post.model');
var Promise = require('bluebird');
var config = require('../../config/config')
// Add a new post
function addPost(post) {
    return new Promise(function(resolve, reject) {
        var newPost = new Post(post);
        newPost.save(function(err, post) {
            if (err) {
                return reject(err);
            }

            return resolve(post);
        });
    })
}


// Get All available posts
function getAllPosts(skip, limit) {

    return Post.find({}).sort({
        createdAt: -1
    }).skip(skip).limit(limit).exec().then(function(data) {
        return Promise.resolve(data);
    }).catch(function(err) {
        return Promise.reject(err);
    })
}

// Delete one post
function deletePost(id) {
    return new Promise(function(resolve, reject) {
        Post.remove({
            _id: id
        }, function(err) {
            if (err) {
                return reject(err);
            }
            resolve();
        })
    })
}

// Get Post by Id
function getPost(id) {
    return new Promise(function(resolve, reject) {
        Post.find({
            _id: id
        }).exec().then(function(data) {
            return resolve(data);
        }).catch(function(err) {
            return reject(err);
        })
    })
}

// GEt post by company id
function getPostByCompanyId(id) {
    return new Promise(function(resolve, reject) {
        Post.find({
            companyId: id
        }).exec().then(function(data) {
            return resolve(data);
        }).catch(function(err) {
            return reject(err)
        })
    })
}



module.exports = {
    add: addPost,
    getAll: getAllPosts,
    delete: deletePost,
    get: getPost,
    getPostByCompanyId: getPostByCompanyId
};
