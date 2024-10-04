import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { connectDB } from '@/util/database';
import { ObjectId } from 'mongodb';

// 파일 저장을 위한 multer 설정
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads/', // 파일을 저장할 경로
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`); // 파일 이름을 유니크하게 저장
    },
  }),
});

const apiRoute = nextConnect({
  onError(error, req, res) {
    res.status(500).json({ error: `Something went wrong! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

// 파일 업로드를 처리하는 미들웨어
apiRoute.use(upload.single('file'));

apiRoute.post(async (req, res) => {
  const { id } = req.query; // 탭의 ID
  const filePath = `/uploads/${req.file.filename}`; // 새로 업로드된 파일 경로

  if (!id) {
    return res.status(400).json({ error: 'Tab ID is required' });
  }

  try {
    const client = await connectDB;
    const db = client.db('NextCardZone');

    // MongoDB에서 기존 파일 경로 조회
    const tab = await db.collection('noticeBoard').findOne({ _id: new ObjectId(id) });

    if (!tab) {
      return res.status(404).json({ error: 'Tab not found' });
    }

    // 기존 파일 경로가 있으면 해당 파일 삭제
    if (tab.filePath) {
      const oldFilePath = path.join(process.cwd(), 'public', tab.filePath);

      // 파일 존재 여부 확인 후 삭제
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // 기존 파일 삭제
        console.log(`Deleted old file: ${oldFilePath}`);
      } else {
        console.warn(`Old file not found: ${oldFilePath}`);
      }
    }

    // MongoDB에 새 파일 경로 업데이트
    await db.collection('noticeBoard').updateOne(
      { _id: new ObjectId(id) },
      { $set: { filePath } }
    );

    res.status(200).json({ message: 'File uploaded successfully and old file deleted', filePath });
  } catch (error) {
    console.error('Error while uploading file or deleting old file:', error);
    res.status(500).json({ error: 'Failed to upload file and update database' });
  }
});

export default apiRoute;

export const config = {
  api: {
    bodyParser: false, // Multer와 함께 사용하기 위해 bodyParser 비활성화
  },
};