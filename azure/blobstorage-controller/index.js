const { 

  StorageSharedKeyCredential,
  ContainerSASPermissions,
  SASProtocol, 
  generateBlobSASQueryParameters,
} = require('@azure/storage-blob');
require('dotenv').config()
const {STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY1, STORAGE_ACCOUNT_KEY2} = process.env;

const constants = {
  accountName: STORAGE_ACCOUNT_NAME,
  accountKey: STORAGE_ACCOUNT_KEY2
};

const sharedKeyCredential = new StorageSharedKeyCredential(
  constants.accountName,
  constants.accountKey
);

async function createContainerSas(containerName='close-up') {
    const sasOptions = {
      containerName,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400000),
      protocol: SASProtocol.Https,
      permissions: ContainerSASPermissions.parse("rwlaciytfx")
  };


  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  return sasToken;
}

module.exports = async function (context, req) {
  const sasToken = await createContainerSas(req.query.containerName);
  // ?sv=2022-11-02&ss=bf&srt=co&sp=rwlaciytfx&se=2023-12-07T02:26:19Z&st=2023-12-05T18:26:19Z&spr=https&sig=%2BdGRz7R3%2Fcv2Z%2FZ0nsewSVvEyN6wZEw17jjfi1EDYpE%3D
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