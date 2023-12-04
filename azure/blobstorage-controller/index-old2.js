const {generateAccountSharedAccessSignature, Constants:{AccountSasConstants}} = require('azure-storage');
require('dotenv').config();
const {STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY} = process.env;
module.exports = async function (context, req) {
    const accountName = STORAGE_ACCOUNT_NAME;
    const accountKey = STORAGE_ACCOUNT_KEY;
    const startDate = new Date();
    const expiryDate = new Date(startDate + 86400);
    const sharedAccessPolicy = {
        AccessPolicy: {
          Services: AccountSasConstants.Services.BLOB ,
          ResourceTypes: AccountSasConstants.Resources.SERVICE + 
                         AccountSasConstants.Resources.CONTAINER +
                         AccountSasConstants.Resources.OBJECT,
          Permissions: AccountSasConstants.Permissions.READ + 
                       AccountSasConstants.Permissions.ADD +
                       AccountSasConstants.Permissions.CREATE +
                       AccountSasConstants.Permissions.WRITE +
                       AccountSasConstants.Permissions.DELETE +
                       AccountSasConstants.Permissions.LIST,
          Protocols: AccountSasConstants.Protocols.HTTPSONLY,
          Start: startDate,
          Expiry: expiryDate
        }
        
      };

    const sasToken = generateAccountSharedAccessSignature(accountName, accountKey, sharedAccessPolicy);
    context.res = {
        body: {
            sasToken
        }
    };
};