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

export async function adDeleteImageDraftMutation({ adId }: { adId: string }) {
  return await apiCall(apiClient.api.ad[':id']['delete-image-draft'].$patch({ param: { id: adId } }));
}

export async function adPublishDraftMutation() {
  const publishedAd = await apiCall(apiClient.api.ad['publish-draft'].$patch({}));

  return publishedAd;
}

export async function adTogglePublishMutation({ adId }: { adId: string }) {
  return await apiCall(apiClient.api.ad[':id']['toggle-publish'].$patch({ param: { id: adId } }));
}

export async function adDeleteMutation({ adId }: { adId: string }) {
  return await apiCall(apiClient.api.ad[':id'].$delete({ param: { id: adId } }));
}
