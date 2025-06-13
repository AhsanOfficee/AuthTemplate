import { Request } from "express";
import { FindOptions, ModelStatic, Model } from "sequelize";
import { FUNCTION_CONSOLE } from "../enums/enum";

interface PaginationMetadata {
  limit: number;
  currentPage: number;
  totalRecords: number;
}

export const paginate = async <T extends Model>(
  req: Request,
  baseQuery: FindOptions,
  model: ModelStatic<T>,
  findOne: boolean = false,
): Promise<{ result: T | T[] | null; metadata: PaginationMetadata }> => {
  console.debug(FUNCTION_CONSOLE.FETCHED_DATA_AND_PAGINATE_FUNCTION_CALLED);

  // Parse and validate query parameters
  const limit = Math.max(parseInt(String(req.query.limit)) || 10, 1);
  const currentPage = Math.max(parseInt(String(req.query.currentPage)) || 1, 1);
  const offset = (currentPage - 1) * limit;

  // Prepare the final query object
  const query: FindOptions = {
    ...baseQuery,
    limit,
    offset,
    raw: true,
  };

  // Perform count and fetch operations in parallel
  const [totalRecords, result] = await Promise.all([
    model.count({ where: baseQuery.where }),
    findOne ? model.findOne(query) : model.findAll(query),
  ]);

  const metadata: PaginationMetadata = {
    limit,
    currentPage,
    totalRecords,
  };

  return { result, metadata };
};
