const {
  StorageSharedKeyCredential,
  ContainerSASPermissions,
  generateBlobSASQueryParameters
} = require("@azure/storage-blob");
require('dotenv').config()
const { extractConnectionStringParts } = require('./utils.js');
const {STORAGE_CONNECTION_STRING}= process.env;
  module.exports = async function (context, req) {
  // const permissions = 'racwl';
  //racwl - read, add, create, write, list
  //racwltme - read, add, create, write, list, tag, move, execute
  //racwdxyltmeop - read, add, create, write, delete, delete version, delete, permanent, list, tag, move, execute, ownership, process
  
  const reqPermissions = (req.query.permissions || req.body.permissions || 'rwl').split('');
  const permissionsOrder = ["r", "a", "c", "w", "d", "x", "y", "l", "t", "m", "e", "o", "p"]; 
  const permissions = reqPermissions.sort((a, b) => {
      return (
          permissionsOrder.indexOf(a) - permissionsOrder.indexOf(b)
      );
  }).join('');

  const container = req.query.containerName || req.body.containerName;
  context.res = {
      body: generateSasToken(STORAGE_CONNECTION_STRING, container, permissions)
  };
};

function generateSasToken(connectionString, container, permissions) {
  const { accountKey, accountName } = extractConnectionStringParts(connectionString);
  const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey.toString('base64'));

  let expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);

  const sasToken = generateBlobSASQueryParameters({
      containerName: container,
      permissions: ContainerSASPermissions.parse(permissions),
      expiresOn: expiryDate,
  }, sharedKeyCredential);

  return {
      sasToken: sasToken.toString(),
  };
}