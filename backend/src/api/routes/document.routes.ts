import { Router } from 'express';
import multer from 'multer';
import { DocumentService } from '../../services/document.service';
import { successResponse } from '../../utils/response';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const documentService = new DocumentService();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Upload document
router.post(
  '/:projectId/upload',
  upload.single('file'),
  async (req: AuthRequest, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const document = await documentService.uploadDocument(
        req.params.projectId,
        req.user!.userId,
        req.file
      );

      successResponse(res, document, 201);
    } catch (error) {
      next(error);
    }
  }
);

// List documents in a project
router.get('/:projectId', async (req: AuthRequest, res, next) => {
  try {
    const documents = await documentService.listDocuments(
      req.params.projectId,
      req.user!.userId
    );
    successResponse(res, documents);
  } catch (error) {
    next(error);
  }
});

// Get document details
router.get('/:projectId/:documentId', async (req: AuthRequest, res, next) => {
  try {
    const document = await documentService.getDocument(
      req.params.documentId,
      req.user!.userId
    );
    successResponse(res, document);
  } catch (error) {
    next(error);
  }
});

// Download document
router.get(
  '/:projectId/:documentId/download',
  async (req: AuthRequest, res, next) => {
    try {
      const { buffer, fileName, mimeType } =
        await documentService.downloadDocument(
          req.params.documentId,
          req.user!.userId
        );

      res.setHeader('Content-Type', mimeType);
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(buffer);
    } catch (error) {
      next(error);
    }
  }
);

// Ask question about document
router.post(
  '/:projectId/:documentId/ask',
  async (req: AuthRequest, res, next) => {
    try {
      const { question } = req.body;
      const answer = await documentService.askQuestion(
        req.params.documentId,
        req.user!.userId,
        question
      );
      successResponse(res, { answer });
    } catch (error) {
      next(error);
    }
  }
);

// Delete document
router.delete(
  '/:projectId/:documentId',
  async (req: AuthRequest, res, next) => {
    try {
      await documentService.deleteDocument(
        req.params.documentId,
        req.user!.userId
      );
      successResponse(res, { message: 'Document deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

export { router as documentRoutes };
