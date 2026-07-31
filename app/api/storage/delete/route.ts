import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/api/shared/infrastructure/s3";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import {
  storageDeleteZodSchema,
  StorageDeleteResponse,
} from "@/lib/api/storage/schema/delete/schema";

export async function DELETE(req: Request) {
  try {
    await CheckAuthentication();

    const body = await req.json();
    const { key } = await storageDeleteZodSchema.parseAsync(body);

    const command = new DeleteObjectCommand({
      Bucket: process.env.MINIO_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    return Response.ok<StorageDeleteResponse>({}, "File deleted");
  } catch (error) {
    return ErrorResponse(error);
  }
}
