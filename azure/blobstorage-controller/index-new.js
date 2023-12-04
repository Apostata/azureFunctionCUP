const { StorageSharedKeyCredential, BlobServiceClient, AccountSasPermissions } = require('@azure/storage-blob');
require('dotenv').config();
const { STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY } = process.env;

module.exports = async function (context, req) {
    const sharedKeyCredential = new StorageSharedKeyCredential(STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY);
    const startDate = new Date();
    const expiryDate = new Date(startDate.getTime() + 86400 * 1000); // Adding milliseconds equivalent to 24 hours

    const permissions = new AccountSasPermissions();
    permissions.read = true;
    permissions.write = true;
    permissions.delete = true;
    permissions.list = true;
    permissions.add = true;
    permissions.create = true;
    permissions.update = true;
    permissions.process = true;
    permissions.readPermissions = true;
    permissions.writePermissions = true;
    permissions.deletePermissions = true;
    permissions.listPermissions = true;
    permissions.addPermissions = true;
    permissions.updatePermissions = true;

    const sasOptions = {
        permissions,
        startsOn: startDate,
        expiresOn: expiryDate,
    };

    const blobServiceClient = new BlobServiceClient(`https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net`, sharedKeyCredential);
    const sasToken = blobServiceClient.generateAccountSasUrl(sasOptions);

    context.res = {
        body: {
            sasToken,
        },
    };
};
