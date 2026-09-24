import type { InferRequestType } from 'hono/client';

import { apiCall, apiClient } from '@/shared/lib/api-client';

export async function adUpdateDraftMutation({
  json,
}: InferRequestType<(typeof apiClient.api.ad)['update-draft']['$patch']>) {
  return await apiCall(apiClient.api.ad['update-draft'].$patch({ json }));
}

export async function adUploadImageDraftMutation({ image }: { image: File }) {
  return await apiCall(apiClient.api.ad['upload-image-draft'].$patch({ form: { image } }));
}

export async function adDeleteImageDraftMutation({ adImageId }: { adImageId: string }) {
  return await apiCall(apiClient.api.ad[':adImageId']['delete-image-draft'].$patch({ param: { adImageId } }));
}

export async function adPublishDraftMutation() {
  const publishedAd = await apiCall(apiClient.api.ad['publish-draft'].$patch({}));

  return publishedAd;
}

export async function adTogglePublishMutation({ adId }: { adId: string }) {
  return await apiCall(apiClient.api.ad[':adId']['toggle-publish'].$patch({ param: { adId } }));
}

export async function adDeleteMutation({ adId }: { adId: string }) {
  return await apiCall(apiClient.api.ad[':adId'].$delete({ param: { adId } }));
}
