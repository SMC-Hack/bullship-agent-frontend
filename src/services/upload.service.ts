import { UploadedFile } from "@/interfaces/upload.interface";
import api from "@/lib/axios";

const uploadFile = async (file: File, accessToken: string): Promise<UploadedFile> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<UploadedFile>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      },
    });
    return data;
  } catch (error) {
    throw new Error("Failed to upload file");
  }
};

const getFileUrl = (filename: string): string => {
  return `${api.defaults.baseURL}/files/${filename}`;
};

const uploadService = {
    uploadFile,
    getFileUrl
}

export default uploadService;