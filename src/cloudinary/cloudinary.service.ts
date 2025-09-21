import { Inject, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            folder: 'link-station-dev',
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async deleteAsset(publicId: string): Promise<void> {
    try {
      const res = await this.cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });

      res.result !== 'ok' &&
        console.log('[deleteAsset] failed --->', {
          publicId,
          res,
        });
    } catch (err) {
      console.log('[deleteAsset] err --->', {
        publicId,
        err,
      });
    }
  }
}
