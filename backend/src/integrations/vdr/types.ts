export interface VDRDocument {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, unknown>;
}

export interface VDRFolder {
  id: string;
  name: string;
  path: string;
  parentId?: string;
}

export interface VDRAuthConfig {
  apiKey?: string;
  apiUrl?: string;
  username?: string;
  password?: string;
  accessToken?: string;
}

export interface IVDRProvider {
  name: string;
  authenticate(config: VDRAuthConfig): Promise<void>;
  listFolders(projectId: string): Promise<VDRFolder[]>;
  listDocuments(folderId: string): Promise<VDRDocument[]>;
  downloadDocument(documentId: string): Promise<Buffer>;
  uploadDocument(
    folderId: string,
    fileName: string,
    content: Buffer
  ): Promise<VDRDocument>;
  getDocumentMetadata(documentId: string): Promise<VDRDocument>;
}
