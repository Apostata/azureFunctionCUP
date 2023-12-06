const { 

  StorageSharedKeyCredential,
  ContainerSASPermissions,
  SASProtocol, 
  generateBlobSASQueryParameters,
} = require('@azure/storage-blob');
require('dotenv').config()
const {STORAGE_ACCOUNT_NAME, STORAGE_ACCOUNT_KEY1} = process.env;

const constants = {
  accountName: STORAGE_ACCOUNT_NAME,
  accountKey: STORAGE_ACCOUNT_KEY1
};

const sharedKeyCredential = new StorageSharedKeyCredential(
  constants.accountName,
  constants.accountKey
);

async function createContainerSas(containerName) {
    const sasOptions = {
      containerName,
      permissions: ContainerSASPermissions.parse("racwli"),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400000),
      protocol: SASProtocol.Https,
  };


  const sasToken = generateBlobSASQueryParameters(sasOptions, sharedKeyCredential).toString();
  return sasToken;
}

module.exports = async function (context, req) {
  const sasToken = await createContainerSas(req.query.containerName);
  context.res = {
      body: {
          sasToken
      }
  };
};

// ?sv=2022-11-02&ss=bf&srt=co&sp=rwlaciytfx&se=2023-12-07T02:26:19Z&st=2023-12-05T18:26:19Z&spr=https&sig=%2BdGRz7R3%2Fcv2Z%2FZ0nsewSVvEyN6wZEw17jjfi1EDYpE%3D

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