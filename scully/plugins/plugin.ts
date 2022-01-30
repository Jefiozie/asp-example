import { PrismaClient } from "@prisma/client";
import {
  HandledRoute,
  logError,
  registerPlugin,
  RouteConfig,
} from "@scullyio/scully";
import { convertAndInjectContent } from "@scullyio/scully/src/lib/renderPlugins/content-render-utils/convertAndInjectContent";
export const prismaPlugin = "prismaPlugin";
const prisma = new PrismaClient();
const routerPlugin = async (route: string, config: RouteConfig) => {
  // here we are looking up all posts
  const data = await prisma.post.findMany({
    // where the published property is true
    where: { published: true },
    // and we include the author
    include: {
      author: {
        // and we only want the author's name
        select: { name: true },
      },
    },
  });
  return Promise.resolve(
    // let's loop over all posts
    data.map((post) => {
      // and return a new route for each post
      const { id, title, published, author, content } = post;
      return {
        ...config,
        route: `/blog/${id}`,
        data: {
          id,
          title,
          published,
          author: author.name,
          content,
        },
      } as HandledRoute;
    })
  );
};
registerPlugin("router", prismaPlugin, routerPlugin);

async function prismaDomPlugin(dom: any, route: HandledRoute | undefined) {
  if (!route) return dom;
  try {
    try {
      // here we use the power of scully and use the filehandler to convert the content to html
      return convertAndInjectContent(dom, route.data.content, "md", route);
    } catch (e) {
      logError(`Error during contentText rendering`);
      console.error(e);
    }
    return dom;
  } catch (e) {}
}

registerPlugin("postProcessByDom", prismaPlugin, prismaDomPlugin);
