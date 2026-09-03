import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './firebase/client';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: 'https://f072b93cff24dfde250be436e8fbe9d0.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'b192f0841e1c48bfe7e82393f5d0481c',
    secretAccessKey: '9c08db0f3d804460cfffe92999a9e673f6af71ba56330dffcc0c736f3578551b',
  },
});

const BUCKET_NAME = 'blog-ashutosh';
const R2_PUBLIC_DOMAIN = 'https://pub-8eb7ce16ea8a4e9984a17c9db407213c.r2.dev';

export async function uploadImageToR2(file: File): Promise<string> {
  const extension = file.name.split('.').pop() || 'jpg';
  const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 20);
  const key = `blogs/${Date.now()}-${cleanName}.${extension}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: uint8Array,
      ContentType: file.type || 'image/jpeg',
    });

    await r2Client.send(command);
    return `${R2_PUBLIC_DOMAIN}/${key}`;
  } catch (r2Error) {
    console.warn('R2 upload warning, attempting Firebase Storage fallback...', r2Error);
    try {
      const storage = getStorage(app);
      const storageRef = ref(storage, `blogs/${Date.now()}-${cleanName}.${extension}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (firebaseError) {
      console.error('Both R2 and Firebase Storage upload failed:', firebaseError);
      throw new Error('Image upload failed');
    }
  }
}

export async function deleteImageFromR2(imageUrl: string): Promise<boolean> {
  if (!imageUrl) return false;

  // Cloudflare R2 cleanup
  if (imageUrl.includes('r2.dev') || imageUrl.includes('r2.cloudflarestorage.com')) {
    try {
      const urlObj = new URL(imageUrl);
      const key = urlObj.pathname.replace(/^\/+/, '');
      if (key) {
        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
          })
        );
        console.log(`Successfully purged R2 file: ${key}`);
        return true;
      }
    } catch (e) {
      console.warn('Failed to delete image from R2:', e);
    }
  }

  // Firebase Storage fallback cleanup
  if (imageUrl.includes('firebasestorage.googleapis.com') || imageUrl.includes('firebasestorage.app')) {
    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, imageUrl);
      await deleteObject(fileRef);
      console.log(`Successfully purged Firebase Storage file`);
      return true;
    } catch (e) {
      console.warn('Failed to delete image from Firebase Storage:', e);
    }
  }

  return false;
}

export async function deleteArticleImagesFromR2(blog: { image_url?: string; content?: string }): Promise<void> {
  const imagesToDelete: string[] = [];

  // 1. Cover photo
  if (blog.image_url) {
    imagesToDelete.push(blog.image_url);
  }

  // 2. Parse all embedded images in content (HTML <img> and markdown ![]())
  if (blog.content) {
    const htmlImgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = htmlImgRegex.exec(blog.content)) !== null) {
      if (match[1]) imagesToDelete.push(match[1]);
    }

    const mdImgRegex = /!\[.*?\]\((https?:\/\/[^\s\)]+)\)/gi;
    while ((match = mdImgRegex.exec(blog.content)) !== null) {
      if (match[1]) imagesToDelete.push(match[1]);
    }
  }

  const uniqueUrls = Array.from(new Set(imagesToDelete));
  await Promise.allSettled(uniqueUrls.map((url) => deleteImageFromR2(url)));
}
