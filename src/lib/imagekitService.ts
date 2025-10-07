import ImageKit from 'imagekit-javascript';

const imagekit = new ImageKit({
  publicKey: import.meta.env.IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.IMAGEKIT_URL_ENDPOINT,
});

export interface UploadResponse {
  url: string;
  fileId: string;
  fileName: string;
  fileType: string;
}

export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const authResponse = await fetch('/api/imagekit-auth');
    const authData = await authResponse.json();

    const uploadResponse = await imagekit.upload({
      file: file,
      fileName: `${Date.now()}_${file.name}`,
      useUniqueFileName: true,
      tags: ['post', 'user-upload'],
      folder: '/posts',
      signature: authData.signature,
      expire: authData.expire,
      token: authData.token,
    });

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      fileName: uploadResponse.name,
      fileType: uploadResponse.fileType,
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload image');
  }
};

export const getImageUrl = (filePath: string, transformations?: any): string => {
  return imagekit.url({
    path: filePath,
    transformation: transformations,
  });
};

export const deleteImage = async (fileId: string): Promise<void> => {
  try {
    await fetch('/api/imagekit-delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileId }),
    });
  } catch (error) {
    console.error('Error deleting from ImageKit:', error);
    throw new Error('Failed to delete image');
  }
};

export default imagekit;
