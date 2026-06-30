# Link S3 and DVC

```bash
dvc remote add -d s3 s3://my-s3-bucket

# add IAM Role access keys
dvc remote modify --local s3 \
                    access_key_id 'mysecret'
dvc remote modify --local s3 \
                    secret_access_key 'mysecret'
```

[DVC Docs on S3](https://doc.dvc.org/user-guide/data-management/remote-storage/amazon-s3)