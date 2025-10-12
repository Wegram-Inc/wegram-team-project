import ImageKit from 'imagekit-javascript';

const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !urlEndpoint) {
  throw new Error(
    'ImageKit configuration is missing. Please check your .env file.'
  );
}

const imagekit = new ImageKit({
  publicKey,
  urlEndpoint,
});

export interface UploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  fileType: string;
}

export interface AuthenticationParameters {
  signature: string;
  expire: number;
  token: string;
}

async function getAuthenticationParameters(): Promise<AuthenticationParameters> {
  const response = await fetch('/api/imagekit-auth');
  if (!response.ok) {
    throw new Error('Failed to get authentication parameters');
  }
  return response.json();
}

export async function uploadImage(
  file: File,
  fileName?: string,
  folder?: string,
  tags?: string[]
): Promise<UploadResponse> {
  try {
    const authParams = await getAuthenticationParameters();

    const uploadResponse = await imagekit.upload({
      file,
      fileName: fileName || file.name,
      folder: folder || '/uploads',
      tags: tags || [],
      useUniqueFileName: true,
      ...authParams,
    });

    return uploadResponse as UploadResponse;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function deleteImage(fileId: string): Promise<void> {
  try {
    const response = await fetch('/api/imagekit-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete image');
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

export function getImageUrl(
  path: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    crop?: string;
  }
): string {
  const transformArray = [];

  if (transformations) {
    if (transformations.width)
      transformArray.push(`w-${transformations.width}`);
    if (transformations.height)
      transformArray.push(`h-${transformations.height}`);
    if (transformations.quality)
      transformArray.push(`q-${transformations.quality}`);
    if (transformations.format)
      transformArray.push(`f-${transformations.format}`);
    if (transformations.crop) transformArray.push(`c-${transformations.crop}`);
  }

  const transformString =
    transformArray.length > 0 ? `tr:${transformArray.join(',')}` : '';

  return `${urlEndpoint}/${transformString}${path}`;
}

export { imagekit };
