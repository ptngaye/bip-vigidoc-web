export function createMockFile(options: {
  name?: string;
  type?: string;
  size?: number;
} = {}): File {
  const { name = 'test.pdf', type = 'application/pdf', size = 1024 } = options;

  const buffer = new ArrayBuffer(size);
  const blob = new Blob([buffer], { type });

  return new File([blob], name, { type });
}
