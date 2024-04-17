import Head from "next/head";
import { getAllPostIds, getPostData } from "../../lib/posts";
import type { InferGetStaticPropsType } from "next";
import { Layout } from "~/components/Layout";
import { format } from "date-fns";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  // use the --scroll custom property to show/hide the button

  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className="fixed bottom-8 right-8 rounded-md bg-neutral-100 p-2 text-2xl shadow-md dark:bg-slate-800 dark:text-white dark:shadow-lg"
      style={{
        // use clever calc, if scroll is 0, opacity is 0, if scroll is more than 0.01, opacity is 1
        opacity: "var(--scroll)",
      }}
    >
      <FaArrowUp />
    </button>
  );
};

export default function Post({
  postData: {
    title,
    date,
    contentHtml,
    readTime,
    description,
    id,
    tableOfContents,
  },
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const publishDateFormatted = format(date, "LLL d, y");
  const hostUrl = "https://krishkrish.com";
  // const hostUrl = "http://localhost:3000";

  const escapedTitle = encodeURIComponent(title);
  const escapedDescription = encodeURIComponent(description);
  const escapedPublishDate = encodeURIComponent(publishDateFormatted);
  const escapedReadTime = encodeURIComponent(readTime);

  const ogImageUrl = `${hostUrl}/api/og?title=${escapedTitle}&description=${escapedDescription}&publishTime=${escapedPublishDate}&readingTime=${escapedReadTime}`;

  return (
    <>
      <Head>
        <title>{`krish's blog • ${title}`}</title>
        <meta property="og:title" content={`krish's blog • ${title}`} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://krishkrish.com/blog/${id}`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="krishkrish.com" />
        <meta
          property="twitter:url"
          content={`https://krishkrish.com/blog/${id}`}
        />
        <meta property="twitter:description" content={description} />

        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="viewport" content="width=device-width" />
        <link rel="icon" href="/favicon.ico" />

        {/* meta images */}
        <meta property="og:image" content={ogImageUrl} />
        <meta property="twitter:image" content={ogImageUrl} />
      </Head>
      {/* <ScrollToTopButton /> */}
      <Layout blog back>
        <div className="m-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-16">
            <h1 className="text-balance font-serif-condensed text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            <div className="py-1 font-serif text-sm dark:opacity-80">
              Published {publishDateFormatted} • {readTime} minute read 
            </div>
          </div>

          <aside className="text-xl md:pl-12">
            <span className="font-serif opacity-70">Table of Contents</span>
            <div
              dangerouslySetInnerHTML={{
                __html: tableOfContents,
              }}
            ></div>
          </aside>
        </div>
        <hr className="m-auto  border-neutral-400 py-4 dark:border-white dark:opacity-10" />

        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="prose-md prose prose-neutral m-auto w-full max-w-2xl text-xl dark:prose-invert [&>p>img]:m-auto"
        />
      </Layout>
    </>
  );
}

interface Params {
  id: string;
}

export async function getStaticProps({ params }: { params: Params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}
export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}
