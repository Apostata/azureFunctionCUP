const { 
  BlobServiceClient, 
  generateAccountSASQueryParameters, 
  AccountSASPermissions, 
  AccountSASServices,
  AccountSASResourceTypes,
  StorageSharedKeyCredential,
  SASProtocol 
} = require('@azure/storage-blob');
require('dotenv').config()
const {STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY} = process.env;

const constants = {
  accountName: STORAGE_ACCOUNT_NAME,
  accountKey: STORAGE_ACCOUNT_KEY
};

const sharedKeyCredential = new StorageSharedKeyCredential(
  constants.accountName,
  constants.accountKey
);

async function createAccountSas() {

  const sasOptions = {

      services: AccountSASServices.parse("btqf").toString(),          // blobs, tables, queues, files
      resourceTypes: AccountSASResourceTypes.parse("sco").toString(),
      protocol: SASProtocol.Https, // service, container, object
      permissions: AccountSASPermissions.parse("rwdlacupiytfx"),          // permissions
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + (10 * 60 * 1000)),
  };

  const sasToken = generateAccountSASQueryParameters(
      sasOptions,
      sharedKeyCredential 
  ).toString();

  console.log(`sasToken = '${sasToken}'\n`);

  // prepend sasToken with `?`
  return (sasToken[0] === '?') ? sasToken : `?${sasToken}`;
}

module.exports = async function (context, req) {
  const sasToken = await createAccountSas();
  context.res = {
      body: {
          sasToken
      }
  };
};

// Permissions:
// r: read
// w: write
// d: delete
// l: list
// f: filter
// a: add
// c: create
// u: update
// t: tag access
// p: process - such as process messages in a queue
// i: set immutability policy