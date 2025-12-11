import { MAX_FILE_SIZE } from '@/lib/constants';
import { uploadFile } from '@/storage';
import { StorageError } from '@/storage/types';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      console.log('uploadFile, file size exceeds the server limit', file.size);
      return NextResponse.json(
        { error: 'File size exceeds the server limit' },
        { status: 400 }
      );
    }

    // Validate file type (optional, based on your requirements)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.log('uploadFile, file type not supported', file.type);
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to storage
    const result = await uploadFile(
      buffer,
      file.name,
      file.type,
      folder || undefined
    );

    console.log('uploadFile, result', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error uploading file:', error);

    if (error instanceof StorageError) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: 'Something went wrong while uploading the file' },
      { status: 500 }
    );
  }
}

// Route segment config for Next.js App Router
// Note: Body size limits are configured at the platform level (e.g., vercel.json)
export const maxDuration = 30; // 30 seconds timeout
