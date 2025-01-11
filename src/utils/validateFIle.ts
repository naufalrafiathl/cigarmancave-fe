export interface FileValidationOptions {
    maxSize?: number;
    allowedTypes?: string[];
    maxDimensions?: { width: number; height: number };
    minDimensions?: { width: number; height: number };
  }
  
  export enum FileValidationError {
    INVALID_TYPE = "INVALID_TYPE",
    FILE_TOO_LARGE = "FILE_TOO_LARGE",
    DIMENSIONS_TOO_LARGE = "DIMENSIONS_TOO_LARGE",
    DIMENSIONS_TOO_SMALL = "DIMENSIONS_TOO_SMALL",
    LOAD_ERROR = "LOAD_ERROR"
  }
  
  export interface ValidationResult {
    valid: boolean;
    error?: {
      code: FileValidationError;
      message: string;
    };
  }
  
  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };
  
  export const validateFile = async (
    file: File,
    options: FileValidationOptions = {}
  ): Promise<boolean> => {
    const {
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"],
      maxDimensions = { width: 4096, height: 4096 },
      minDimensions = { width: 200, height: 200 }
    } = options;
  
    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        `Invalid file type. Allowed types: ${allowedTypes
          .map((type) => type.split("/")[1])
          .join(", ")}`
      );
    }
  
    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new Error(`File size must be less than ${maxSizeMB}MB`);
    }
  
    // Check image dimensions
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
        URL.revokeObjectURL(img.src);
  
        if (
          img.width > maxDimensions.width ||
          img.height > maxDimensions.height
        ) {
          reject(
            new Error(
              `Image dimensions must be less than ${maxDimensions.width}x${maxDimensions.height}px`
            )
          );
        }
  
        if (
          img.width < minDimensions.width ||
          img.height < minDimensions.height
        ) {
          reject(
            new Error(
              `Image dimensions must be at least ${minDimensions.width}x${minDimensions.height}px`
            )
          );
        }
  
        resolve(true);
      };
  
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error("Failed to load image for validation"));
      };
    });
  };
  
  export const validateFileWithDetails = async (
    file: File,
    options: FileValidationOptions = {}
  ): Promise<ValidationResult> => {
    try {
      await validateFile(file, options);
      return { valid: true };
    } catch (error) {
      let code = FileValidationError.LOAD_ERROR;
      const message = error instanceof Error ? error.message : "Unknown error";
  
      if (message.includes("file type")) {
        code = FileValidationError.INVALID_TYPE;
      } else if (message.includes("file size")) {
        code = FileValidationError.FILE_TOO_LARGE;
      } else if (message.includes("must be less than")) {
        code = FileValidationError.DIMENSIONS_TOO_LARGE;
      } else if (message.includes("must be at least")) {
        code = FileValidationError.DIMENSIONS_TOO_SMALL;
      }
  
      return {
        valid: false,
        error: {
          code,
          message
        }
      };
    }
  };