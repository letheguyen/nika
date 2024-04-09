import { Logger } from '@nestjs/common';
import { Document, Model, Types } from 'mongoose';

export class BaseService<T extends Document> {
  constructor(private readonly model: Model<T>) {}
  private readonly logger = new Logger(BaseService.name);

  /**
   * Execute the provided callback function within a MongoDB transaction.
   * @param callback The callback function to execute within the transaction.
   * @returns The result of the callback function.
   */

  public async usingTransaction(callback: any) {
    const session = await this.model.db.startSession();

    try {
      return await session.withTransaction(async () => {
        const callbackResult = await callback(session);
        return callbackResult;
      });
    } catch (err) {
      this.logger.error(`Transaction error: ${err}`);
      if (session.inTransaction()) await session.abortTransaction();

      throw err;
    } finally {
      session.endSession();
    }
  }

  /**
   * Create a new document in the database.
   * @param data The data to create the document.
   * @returns The created document.
   */
  public async create(data: Partial<T>): Promise<T> {
    try {
      const createdDoc = await this.model.create(data);
      return createdDoc;
    } catch (error) {
      this.logger.error("Error creating document : "+error);
      throw error;
    }
  }

  /**
   * Find a document by its ID.
   * @param id The ID of the document to find.
   * @returns The found document, or null if not found.
   */
  public async findById(id: Types.ObjectId): Promise<T | null> {
    try {
      const foundDoc = await this.model.findById(id);
      return foundDoc;
    } catch (error) {
      this.logger.error("Error finding document by ID : "+error);
      throw error;
    }
  }

  /**
   * Find documents that match the given query.
   * @param query The query to filter documents.
   * @returns An array of documents that match the query.
   */
  public async find(query: any = {}): Promise<T[]> {
    try {
      const foundDocs = await this.model.find(query);
      return foundDocs;
    } catch (error) {
      this.logger.error("Error finding document : "+error);
      throw error;
    }
  }
}