import { BadRequestException, FileValidator } from '@nestjs/common';

interface ImageValidatorOptions {
  maxSize: number;
  fileType: RegExp;
}

export class ImageFileValidator extends FileValidator {
  private errors: string[];
  private readonly maxSize: number;
  private readonly fileType: RegExp;

  constructor(options: ImageValidatorOptions) {
    super(options);
    this.maxSize = options.maxSize;
    this.fileType = options.fileType;
  }

  /**
   * Note: Instead of returning false and using buildErrorMessage(),
   * we throw a BadRequestException directly inside isValid().
   *
   * This ensures file validation errors follow the same pattern
   * as class-validator errors, allowing multiple error messages
   * to be returned as an array.
   */
  isValid(file?: Express.Multer.File): boolean | Promise<boolean> {
    this.errors = [];

    if (file.size > this.maxSize)
      this.errors.push(
        `file size must be less then ${this.maxSize / 1024 / 1024}MB`,
      );

    if (!this.fileType.test(file.mimetype))
      this.errors.push('Only .jpg and .png images are allowed!');

    if (this.errors.length !== 0) throw new BadRequestException(this.errors);

    return true;
  }

  buildErrorMessage(): string {
    return;
  }
}
