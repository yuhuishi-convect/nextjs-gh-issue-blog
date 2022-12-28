import Head from 'next/head'
import { Inter } from '@next/font/google'
import { Octokit } from "@octokit/core";
import {Endpoints} from "@octokit/types";
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

type Issue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];

export default function Home({ issues }: { issues: Issue[]}) {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main >
        {/* A list of blog posts */}

        {issues.map((issue) => (
          <div key={issue.number}>
            <Link href={`/blog/${issue.number}`}>
              {issue.title}
            </Link>
          </div>
        ))}
      </main>
    </>
  )
}


export async function getStaticProps() {
  const octokit = new Octokit(
      {
          auth: process.env.GITHUB_TOKEN,
      }
  );

  // get the issues under the repo
  const { data: issues } = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: process.env.GITHUB_OWNER || 'yuhuishi-convect',
      repo: process.env.GITHUB_REPO || 'gh-blog',
      per_page: 100,
  });

  return { props: { issues } };
}
