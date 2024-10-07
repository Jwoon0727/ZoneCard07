import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const { file } = req.body; // 파일은 base64 또는 multipart로 받을 수 있습니다
    const buffer = Buffer.from(file.split(",")[1], "base64");

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${Date.now()}_${file.name}`, // 파일 이름을 현재 시간으로 유니크하게 만듭니다
      Body: buffer,
      ContentType: file.type,
      // ACL 옵션을 제거합니다.
    };

    try {
      const command = new PutObjectCommand(params);
      const uploadResponse = await s3.send(command);
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      return res.status(200).json({ url });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}