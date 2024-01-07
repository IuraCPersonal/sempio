import { Logger, NotFoundException } from '@nestjs/common';
import { AbstractDocument } from './abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';

/**
 * Abstract repository class for interacting with a database.
 * @template TDocument - The type of the document.
 */
export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Creates a new document in the database.
   * @param document - The document to be created.
   * @returns A promise that resolves to the created document.
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as unknown as TDocument;
  }

  /**
   * Finds a single document in the database based on the provided filter query.
   * @param filterQuery - The filter query to find the document.
   * @returns A promise that resolves to the found document.
   * @throws NotFoundException if the document is not found.
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn(`Document not found: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }

    return document as TDocument;
  }

  /**
   * Finds a single document in the database based on the provided filter query and updates it.
   * @param filterQuery - The filter query to find the document.
   * @param update - The update query to update the document.
   * @returns A promise that resolves to the updated document.
   * @throws NotFoundException if the document is not found.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
      lean: true,
      new: true,
    });

    if (!document) {
      this.logger.warn(`Document not found: ${JSON.stringify(filterQuery)}`);
      throw new NotFoundException('Document not found');
    }

    return document as TDocument;
  }

  /**
   * Finds all documents in the database based on the provided filter query.
   * @param filterQuery - The filter query to find the documents.
   * @returns A promise that resolves to the found documents.
   */
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
