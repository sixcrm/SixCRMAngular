const aws = require('aws-sdk');
const fs = require('fs');
const fileUtils = require('./file.utils');
const git = require('./git.utils');

aws.config.apiVersions = {s3: '2006-03-01'};
const s3 = new aws.S3();

exports.createBucketIfNotExist = (projectName, branchName) => {
  let bucketName = `${branchName}-${projectName}`;

  return bucketExists(bucketName)
    .then(exist => {
      if (exist) return Promise.resolve(bucketName);

      return createBucket(bucketName)
    })
};

exports.upload = (bucketName) => {
  return git.getVersion()
    .then(version => uploadFiles(bucketName, version))
};

exports.setStaticHosting = (bucketName) => {
  console.log('Enabling static hosting');

  return new Promise((resolve, reject) => {
    let params = {
      Bucket: bucketName,
      ContentMD5: "",
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html"
        }
      }
    };

    s3.putBucketWebsite(params, (error, data) => {
      if (error) return reject(error);

      console.log('Static hosting successfully enabled');
      resolve(bucketName);
    })
  });
};

exports.setPolicies = (bucketName) => {
  console.log('Setting policies');

  return new Promise((resolve, reject) => {
    let params = {
      Bucket: bucketName,
      Policy: `{"Version": "2012-10-17", "Statement": [ {"Sid": "AddPerm", "Effect": "Allow", "Principal": "*", "Action": "s3:GetObject", "Resource": "arn:aws:s3:::${bucketName}/*"} ] }`
    };

    s3.putBucketPolicy(params, (error, data) => {
      if (error) return reject(error);

      console.log('Policy successfully applied');
      resolve(bucketName);
    })
  });
};

function uploadFiles(bucketName, version) {
  return new Promise((resolve, reject) => {
    let filesToUpload = fileUtils.getAllPaths('dist');

    let promises = filesToUpload.map(file => {
      let params = {
        Body: fs.createReadStream(file),
        Key: file.replace('dist/', `${version}/`),
        ContentType: getContentType(file),
        Bucket: bucketName
      };

      return new Promise((resolve, reject) => {
        s3.putObject(params, (error, data) => {
          if (error) return reject(error);

          resolve()
        })
      })
    });

    Promise.all(promises).then(
      () => {
        console.log(`Upload of ${promises.length} files to ${bucketName} successful!`);
        resolve()
      },
      (error) => reject(error)
    )
  })
}

function bucketExists(bucketName) {

  return new Promise((resolve, reject) => {
    s3.listBuckets((err, data) => {
      if (err || !data || !data.Buckets) return reject(`Could not fetch list of buckets`);

      resolve(data.Buckets.filter(b => b.Name === bucketName).length === 1);
    });
  })

}

function createBucket(bucketName) {
  console.log(`Creating bucket ${bucketName}`);

  return new Promise((resolve, reject) => {
    s3.createBucket({Bucket: bucketName}, (err, data) => {
      if (err) reject(err);

      resolve(bucketName);
    })
  })

}

function getContentType(file) {
  if (file.length >= 5 && file.substring(file.length - 5, file.length) === '.html') return 'text/html';
  if (file.length >= 3 && file.substring(file.length - 3, file.length) === '.js') return 'application/javascript';
  if (file.length >= 4 && file.substring(file.length - 4, file.length) === '.txt') return 'text/plain';
  if (file.length >= 4 && file.substring(file.length - 4, file.length) === '.png') return 'image/png';
  if (file.length >= 4 && file.substring(file.length - 4, file.length) === '.svg') return 'image/svg+xml';
  if (file.length >= 4 && file.substring(file.length - 4, file.length) === '.gif') return 'image/gif';
  if (file.length >= 4 && file.substring(file.length - 4, file.length) === '.css') return 'text/css';

  return 'binary/octet-stream';
}
