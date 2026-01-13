import axios, { AxiosInstance } from 'axios';
import { logger } from '../../config/logger';
import { VDRConnectionError } from '../../utils/errors';
import {
  IVDRProvider,
  VDRAuthConfig,
  VDRDocument,
  VDRFolder,
} from './types';

export class DatasiteProvider implements IVDRProvider {
  name = 'Datasite';
  private client: AxiosInstance;
  private authenticated = false;

  constructor() {
    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add retry logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config || config._retry) {
          return Promise.reject(error);
        }

        // Retry on 429 (rate limit) or 5xx errors
        if (error.response?.status === 429 || error.response?.status >= 500) {
          config._retry = true;
          const delay = error.response?.headers['retry-after']
            ? parseInt(error.response.headers['retry-after']) * 1000
            : 2000;

          await new Promise((resolve) => setTimeout(resolve, delay));
          return this.client(config);
        }

        return Promise.reject(error);
      }
    );
  }

  async authenticate(config: VDRAuthConfig): Promise<void> {
    try {
      this.client.defaults.baseURL = config.apiUrl;
      this.client.defaults.headers.common['Authorization'] =
        `Bearer ${config.apiKey}`;

      // Verify authentication with a test request
      await this.client.get('/health');
      this.authenticated = true;
      logger.info('Datasite authentication successful');
    } catch (error) {
      logger.error('Datasite authentication failed', error);
      throw new VDRConnectionError(
        'Failed to authenticate with Datasite',
        'Datasite'
      );
    }
  }

  async listFolders(projectId: string): Promise<VDRFolder[]> {
    this.ensureAuthenticated();

    try {
      const response = await this.client.get(`/projects/${projectId}/folders`);
      return response.data.folders.map((folder: unknown) =>
        this.mapFolder(folder)
      );
    } catch (error) {
      logger.error('Failed to list Datasite folders', error);
      throw new VDRConnectionError(
        'Failed to list folders from Datasite',
        'Datasite'
      );
    }
  }

  async listDocuments(folderId: string): Promise<VDRDocument[]> {
    this.ensureAuthenticated();

    try {
      const response = await this.client.get(`/folders/${folderId}/documents`);
      return response.data.documents.map((doc: unknown) => this.mapDocument(doc));
    } catch (error) {
      logger.error('Failed to list Datasite documents', error);
      throw new VDRConnectionError(
        'Failed to list documents from Datasite',
        'Datasite'
      );
    }
  }

  async downloadDocument(documentId: string): Promise<Buffer> {
    this.ensureAuthenticated();

    try {
      const response = await this.client.get(
        `/documents/${documentId}/download`,
        {
          responseType: 'arraybuffer',
        }
      );
      return Buffer.from(response.data);
    } catch (error) {
      logger.error('Failed to download Datasite document', error);
      throw new VDRConnectionError(
        'Failed to download document from Datasite',
        'Datasite'
      );
    }
  }

  async uploadDocument(
    folderId: string,
    fileName: string,
    content: Buffer
  ): Promise<VDRDocument> {
    this.ensureAuthenticated();

    try {
      const response = await this.client.post(
        `/folders/${folderId}/documents`,
        {
          fileName,
          content: content.toString('base64'),
        }
      );
      return this.mapDocument(response.data.document);
    } catch (error) {
      logger.error('Failed to upload document to Datasite', error);
      throw new VDRConnectionError(
        'Failed to upload document to Datasite',
        'Datasite'
      );
    }
  }

  async getDocumentMetadata(documentId: string): Promise<VDRDocument> {
    this.ensureAuthenticated();

    try {
      const response = await this.client.get(`/documents/${documentId}`);
      return this.mapDocument(response.data.document);
    } catch (error) {
      logger.error('Failed to get Datasite document metadata', error);
      throw new VDRConnectionError(
        'Failed to get document metadata from Datasite',
        'Datasite'
      );
    }
  }

  private ensureAuthenticated(): void {
    if (!this.authenticated) {
      throw new VDRConnectionError('Not authenticated with Datasite', 'Datasite');
    }
  }

  private mapFolder(data: Record<string, unknown>): VDRFolder {
    return {
      id: String(data.id),
      name: String(data.name),
      path: String(data.path),
      parentId: data.parentId ? String(data.parentId) : undefined,
    };
  }

  private mapDocument(data: Record<string, unknown>): VDRDocument {
    return {
      id: String(data.id),
      name: String(data.name),
      path: String(data.path),
      size: Number(data.size),
      mimeType: String(data.mimeType),
      createdAt: new Date(String(data.createdAt)),
      updatedAt: new Date(String(data.updatedAt)),
      metadata: data.metadata as Record<string, unknown>,
    };
  }
}
