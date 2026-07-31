import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/api/shared/infrastructure/s3";
import CheckAuthentication from "@/lib/api/shared/services/CheckAuthentication";
import { ErrorResponse } from "@/lib/api/shared/services/ErrorResponse";
import { Response } from "@/lib/api/shared/types/response_schema/base";
import { StorageListResponse } from "@/lib/api/storage/schema/list-files/schema";

export async function GET() {
  try {
    await CheckAuthentication();

    const command = new ListObjectsV2Command({
      Bucket: process.env.MINIO_BUCKET_NAME,
    });

    const data = await s3.send(command);
    return Response.ok<StorageListResponse>({ files: data.Contents });
  } catch (error) {
    return ErrorResponse(error);
  }
}
