import {
  buildWispClient,
  GetPostsResult,
  GetPostResult,
} from "@wisp-cms/client";

export const wisp = buildWispClient({
  blogId: process.env.WISP_ID!,
});

export type { GetPostsResult, GetPostResult };

