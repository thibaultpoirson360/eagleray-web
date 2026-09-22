/**
 * GitHub git provider that records WHICH EDITOR made each commit.
 *
 * Problem: tinacms-gitprovider-github commits every edit with the PAT owner's
 * identity and the fixed message "Edited with TinaCMS", so with per-editor
 * Google logins the git history would still say one person did everything.
 *
 * Mitigation: the backend (tina/backend.ts) runs each request inside an
 * AsyncLocalStorage store and, once Auth.js has authorized the request,
 * stores the signed-in editor's name/email there. This provider reads it and
 * (a) sets the commit AUTHOR to the editor (the PAT owner stays the
 * committer) and (b) appends an "Edited-by:" trailer to the message.
 *
 * Caveats (UNVERIFIED against a live repo — needs a real deploy + PAT):
 *  - GitHub links an author to a GitHub profile only if the email matches a
 *    verified email on a GitHub account. The marketing team has no GitHub
 *    accounts, so commits show their name/email with no avatar. That is the
 *    intended audit trail.
 *  - Commits are not "Verified" (not GPG-signed); same as the stock provider.
 *  - The store is empty during `tinacms build` indexing and local dev, so the
 *    provider then behaves exactly like the stock one.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import { GitHubProvider } from "tinacms-gitprovider-github";

export type Actor = { name?: string | null; email?: string | null };
export type RequestStore = { actor?: Actor };

export const requestStore = new AsyncLocalStorage<RequestStore>();

const DEFAULT_MESSAGE = "Edited with TinaCMS";

function attribution(baseMessage?: string) {
  const actor = requestStore.getStore()?.actor;
  const message = baseMessage || DEFAULT_MESSAGE;
  if (!actor?.email) return { message, author: undefined };
  const name = actor.name?.trim() || actor.email;
  return {
    message: `${message}\n\nEdited-by: ${name} <${actor.email}>`,
    author: { name, email: actor.email },
  };
}

export class AttributedGitHubProvider extends GitHubProvider {
  async onPut(key: string, value: string) {
    const path = this.rootPath ? `${this.rootPath}/${key}` : key;
    let sha: string | undefined;
    try {
      const res = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
      // @ts-expect-error getContent is a union (file | dir | ...); file has sha
      sha = res.data.sha;
    } catch {
      // new file
    }
    const { message, author } = attribution(this.commitMessage);
    await this.octokit.repos.createOrUpdateFileContents({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      content: Buffer.from(value, "utf8").toString("base64"),
      branch: this.branch,
      sha,
      ...(author ? { author } : {}),
    });
  }

  async onDelete(key: string) {
    const path = this.rootPath ? `${this.rootPath}/${key}` : key;
    let sha: string | undefined;
    try {
      const res = await this.octokit.repos.getContent({
        owner: this.owner,
        repo: this.repo,
        path,
        ref: this.branch,
      });
      // @ts-expect-error see above
      sha = res.data.sha;
    } catch {
      // handled below
    }
    if (!sha) {
      throw new Error(`Could not find file ${path} in repo ${this.owner}/${this.repo}`);
    }
    const { message, author } = attribution(this.commitMessage);
    await this.octokit.repos.deleteFile({
      owner: this.owner,
      repo: this.repo,
      path,
      message,
      branch: this.branch,
      sha,
      ...(author ? { author } : {}),
    });
  }
}
