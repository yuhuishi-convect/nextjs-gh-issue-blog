import { Octokit } from "octokit";
import { Endpoints } from "@octokit/types";
import ReactMarkdown from "react-markdown";


type Issue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"]["data"];


export async function getStaticPaths() {
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

    // get the issue number
    const paths = issues.map((issue) => ({
        params: { id: issue.number.toString() },
    }));

    return { paths, fallback: false };
    
}

export async function getStaticProps({ params }: { params: { id: string } }) {
    const octokit = new Octokit();

    // get the issue by issue number
    const { data: issue } = await octokit.request("GET /repos/{owner}/{repo}/issues/{issue_number}", {
        owner: process.env.GITHUB_OWNER || 'yuhuishi-convect',
        repo: process.env.GITHUB_REPO || 'gh-blog',
        issue_number: parseInt(params.id),
    });

    return { props: { issue } };
}

export default function Issue({ issue }: { issue: Issue }) {
    // render the issue title and body as markdown

    return (
        <>
            <h1>{issue.title}</h1>
            {issue.body && <ReactMarkdown>{issue.body}</ReactMarkdown>}
        </>
    );
}


