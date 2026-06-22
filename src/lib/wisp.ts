import {
  buildWispClient,
  GetPostsResult,
  GetPostResult,
  GetCommentsResult,
  GetTagsResult,
} from "@wisp-cms/client";

export const wisp = buildWispClient({
  blogId: process.env.WISP_ID!,
});

export type { GetPostsResult, GetPostResult, GetCommentsResult, GetTagsResult };
