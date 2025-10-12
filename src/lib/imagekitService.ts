import ImageKit from 'imagekit-javascript';

// ImageKit configuration
const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
const urlEndpoint = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

if (!publicKey || !urlEndpoint) {
  console.error('ImageKit configuration is missing. Please check your .env file.');
}

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: publicKey || '',
  urlEndpoint: urlEndpoint || '',
  authenticationEndpoint: '/api/imagekit-auth'
});

// Types for ImageKit responses
export interface ImageKitUploadResponse {
  fileId: string;
  name: string;
  url: string;
  thumbnailUrl: string;
  height: number;
  width: number;
  size: number;
  filePath: string;
  tags: string[];
  isPrivateFile: boolean;
  customCoordinates: string | null;
  fileType: string;
}

export interface ImageKitError {
  message: string;
  help: string;
}

// Get authentication parameters from our API
export const getAuthenticationParameters = async () => {
  try {
    const response = await fetch('/api/imagekit-auth');
    if (!response.ok) {
      throw new Error('Failed to get authentication parameters');
    }
    return await response.json();
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// Upload image to ImageKit
export const uploadImage = async (
  file: File,
  fileName?: string,
  folder?: string
): Promise<ImageKitUploadResponse> => {
  try {
    // More detailed configuration checking
    console.log('Upload Debug - publicKey:', publicKey ? 'Set' : 'Missing');
    console.log('Upload Debug - urlEndpoint:', urlEndpoint ? 'Set' : 'Missing');

    if (!publicKey || !urlEndpoint || publicKey.trim() === '' || urlEndpoint.trim() === '') {
      throw new Error(`ImageKit configuration error - publicKey: ${publicKey ? 'Set' : 'Missing'}, urlEndpoint: ${urlEndpoint ? 'Set' : 'Missing'}`);
    }

    const uploadOptions = {
      file,
      fileName: fileName || file.name,
      folder: folder || '/wegram-posts',
      tags: ['wegram', 'user-upload'],
      useUniqueFileName: true,
      responseFields: ['fileId', 'name', 'url', 'thumbnailUrl', 'height', 'width', 'size', 'filePath', 'tags', 'isPrivateFile', 'customCoordinates', 'fileType']
    };

    console.log('Starting ImageKit upload...');
    const result = await imagekit.upload(uploadOptions);
    console.log('ImageKit upload successful:', result);
    return result as ImageKitUploadResponse;
  } catch (error) {
    console.error('ImageKit upload error:', error);

    // Provide more detailed error message
    if (error instanceof Error) {
      throw new Error(`ImageKit upload failed: ${error.message}`);
    } else {
      throw new Error(`ImageKit upload failed: ${JSON.stringify(error)}`);
    }
  }
};

// Delete image from ImageKit
export const deleteImage = async (fileId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/imagekit-delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fileId })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete image');
    }

    return true;
  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};

// Generate optimized image URL
export const getImageUrl = (
  path: string,
  transformations?: Array<{ height?: number; width?: number; quality?: number; format?: string }>
) => {
  if (!urlEndpoint) {
    return path;
  }

  let url = `${urlEndpoint}${path}`;

  if (transformations && transformations.length > 0) {
    const transformString = transformations
      .map(t => {
        const params = [];
        if (t.height) params.push(`h-${t.height}`);
        if (t.width) params.push(`w-${t.width}`);
        if (t.quality) params.push(`q-${t.quality}`);
        if (t.format) params.push(`f-${t.format}`);
        return params.join(',');
      })
      .join('/');

    url = `${urlEndpoint}/tr:${transformString}${path}`;
  }

  return url;
};

export default imagekit;