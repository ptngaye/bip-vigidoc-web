import { ContentType, FileSize } from '../value-objects';

export interface DocumentToVerifyProps {
  readonly file: File;
  readonly contentType: ContentType;
  readonly fileSize: FileSize;
}

export class DocumentToVerify {
  private constructor(private readonly props: DocumentToVerifyProps) {}

  static create(file: File): DocumentToVerify {
    const contentType = ContentType.create(file.type);
    const fileSize = FileSize.create(file.size);

    return new DocumentToVerify({
      file,
      contentType,
      fileSize,
    });
  }

  get file(): File {
    return this.props.file;
  }

  get filename(): string {
    return this.props.file.name;
  }

  get contentType(): ContentType {
    return this.props.contentType;
  }

  get fileSize(): FileSize {
    return this.props.fileSize;
  }

  get isPdf(): boolean {
    return this.props.contentType.isPdf;
  }

  get isImage(): boolean {
    return this.props.contentType.isImage;
  }
}
