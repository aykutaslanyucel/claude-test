import { prisma } from '../config/database';
import { StorageService } from './storage.service';
import { DocumentParser } from '../ai/document-parser';
import { AnalysisService } from '../ai/analysis.service';
import { NotFoundError, ValidationError } from '../utils/errors';
import { DocumentStatus, DocumentType } from '@prisma/client';
import { logger } from '../config/logger';

export class DocumentService {
  private storageService: StorageService;
  private parser: DocumentParser;
  private analysisService: AnalysisService;

  constructor() {
    this.storageService = new StorageService();
    this.parser = new DocumentParser();
    this.analysisService = new AnalysisService();
  }

  async uploadDocument(
    projectId: string,
    userId: string,
    file: Express.Multer.File
  ) {
    // Verify project exists and user has access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: { userId },
        },
      },
    });

    if (!project) {
      throw new NotFoundError('Project');
    }

    // Upload to storage
    const storagePath = await this.storageService.uploadFile(
      file,
      `projects/${projectId}/documents`
    );

    // Create document record
    const document = await prisma.document.create({
      data: {
        projectId,
        uploadedBy: userId,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype,
        storagePath,
        status: DocumentStatus.PENDING,
      },
    });

    // Process document asynchronously
    this.processDocumentAsync(document.id, file.buffer, file.mimetype);

    return document;
  }

  private async processDocumentAsync(
    documentId: string,
    buffer: Buffer,
    mimeType: string
  ): Promise<void> {
    try {
      // Update status to processing
      await prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.PROCESSING },
      });

      const startTime = Date.now();

      // Parse document
      const parsed = await this.parser.parse(buffer, mimeType);

      // Analyze with AI
      const analysis = await this.analysisService.analyzeDocument(
        parsed.text,
        mimeType
      );

      const processingTime = Date.now() - startTime;

      // Save analysis
      await prisma.documentAnalysis.create({
        data: {
          documentId,
          extractedText: parsed.text.substring(0, 100000), // Limit size
          summary: analysis.summary,
          keyPoints: analysis.keyPoints,
          entities: analysis.entities,
          riskLevel: analysis.riskLevel,
          riskFactors: analysis.riskFactors,
          flags: analysis.flags,
          metadata: parsed.metadata || {},
          aiModel: 'claude-3-5-sonnet-20241022',
          processingTime,
        },
      });

      // Update document status
      await prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.ANALYZED },
      });

      logger.info('Document processed successfully', { documentId });
    } catch (error) {
      logger.error('Document processing failed', { documentId, error });

      await prisma.document.update({
        where: { id: documentId },
        data: { status: DocumentStatus.FLAGGED },
      });
    }
  }

  async getDocument(documentId: string, userId: string) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        project: {
          members: {
            some: { userId },
          },
        },
      },
      include: {
        analysis: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        uploader: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundError('Document');
    }

    return document;
  }

  async listDocuments(projectId: string, userId: string) {
    // Verify access
    const membership = await prisma.projectMember.findFirst({
      where: { projectId, userId },
    });

    if (!membership) {
      throw new NotFoundError('Project');
    }

    return prisma.document.findMany({
      where: { projectId },
      include: {
        analysis: {
          select: {
            riskLevel: true,
            summary: true,
          },
        },
        uploader: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async downloadDocument(documentId: string, userId: string) {
    const document = await this.getDocument(documentId, userId);
    const buffer = await this.storageService.downloadFile(document.storagePath);

    return {
      buffer,
      fileName: document.fileName,
      mimeType: document.fileType,
    };
  }

  async deleteDocument(documentId: string, userId: string) {
    const document = await this.getDocument(documentId, userId);

    // Delete from storage
    await this.storageService.deleteFile(document.storagePath);

    // Delete from database (cascade will handle related records)
    await prisma.document.delete({
      where: { id: documentId },
    });

    logger.info('Document deleted', { documentId });
  }

  async askQuestion(
    documentId: string,
    userId: string,
    question: string
  ): Promise<string> {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        project: {
          members: {
            some: { userId },
          },
        },
      },
      include: {
        analysis: true,
      },
    });

    if (!document || !document.analysis) {
      throw new NotFoundError('Document or analysis');
    }

    return this.analysisService.answerQuestion(
      question,
      document.analysis.extractedText || ''
    );
  }
}
