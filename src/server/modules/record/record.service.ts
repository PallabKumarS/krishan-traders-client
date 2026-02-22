import httpStatus from "http-status";
import { AppError } from "../../errors/AppError";
import RecordModel from "./record.model";

//  GET ALL RECORDS
const getAllRecordFromDB = async (query?: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};

  if (query?.type) filter.type = query.type;
  if (query?.status) filter.status = query.status;

  return RecordModel.find(filter)
    .populate({
      path: "size",
      populate: {
        path: "product",
        populate: { path: "company" },
      },
    })
    .populate("interactedBy")
    .sort("-createdAt");
};

//  DELETE RECORD
const deleteRecordFromDB = async (id: string) => {
  const record = await RecordModel.findById(id);
  if (!record) throw new AppError(httpStatus.NOT_FOUND, "Record not found");

  if (record.status === "accepted") {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot delete accepted record");
  }

  return RecordModel.findByIdAndDelete(id);
};

export const RecordService = {
  getAllRecordFromDB,
  deleteRecordFromDB,
};
