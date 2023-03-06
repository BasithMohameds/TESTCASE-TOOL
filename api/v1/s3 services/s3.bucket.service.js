const AWS = require("aws-sdk");

//s3 bucket getSignedUrl
exports.s3LinkSigned = async (link, filename) => {
  const s3 = new AWS.S3();
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  const myBucket = process.env.AWS_BUCKET_NAME;
  const myKey = filename;
  // const signedUrlExpireSeconds = 60 * 60 * 24 * 365;
  const url = s3.getSignedUrl("getObject", {
    Bucket: myBucket,
    Key: myKey,
    Expires: 604800,
  });
  return url;
};
