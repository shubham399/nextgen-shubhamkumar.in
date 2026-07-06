import { cache } from "react";
import {
  buildWispClient,
  GetPostsResult,
  GetPostResult,
  GetCommentsResult,
  GetTagsResult,
  GetCtasResult,
} from "@wisp-cms/client";

export const wisp = buildWispClient({
  blogId: process.env.WISP_ID!,
});

export const getCachedPost = cache((slug: string) => wisp.getPost(slug));

export type { GetPostsResult, GetPostResult, GetCommentsResult, GetTagsResult, GetCtasResult };
