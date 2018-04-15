// Environment and config info
module.exports = {
    db: {
        dev: {
            url: 'mongodb://admin:d312436744@ds237389.mlab.com:37389/userdb001'
        }
    },
    dbCollections: {
        user: {
            userInfo: 'UserInfo',
        }
    },
    jwt: {
        secret: 'league of legends riven'
    },
    aws: {
        accessKeyId: 'AKIAIHH7T44RLCX37EOQ',
        secretAccessKey: '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',
        region: 'us-east-1',
        params: {
            Bucket: 'appics',
            ACL: 'public-read',
            Key: '',
            Body: ''
        }
    }
};