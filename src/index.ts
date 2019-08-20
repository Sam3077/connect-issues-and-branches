import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { isNull } from "util";
import defaultConfig from "./defaultConfig.json";

type Config = {
  branchNameRegex: string;
  issueReferenceRegex: string;
};

export = (app: Application) => {
  app.on("create", async context => {
    let config: Config = (await context.config(
      "config.yml",
      defaultConfig
    )) as Config;
    const branchNameRegex = new RegExp(config.branchNameRegex);
    const issueReferenceRegex = new RegExp(config.issueReferenceRegex);

    const payload = context.payload;
    if (!payload.ref_type || payload.ref_type !== "branch") return;

    const branchName: string = payload.ref;
    if (branchName.match(branchNameRegex) === null) {
      context.log("doesn't match branch regex");
      return;
    }

    const regexMatch = branchName.match(issueReferenceRegex);
    if (isNull(regexMatch) || regexMatch.length == 0) {
      context.log("no issue number found");
      return;
    }

    const issueReference = Number.parseInt(regexMatch[0]);

    try {
      await context.github.issues.createComment({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: issueReference,
        body: `A branch named \`${
          payload.ref
        }\` has been created for this issue. It can be found at: ${
          payload.repository.html_url
        }/tree/${payload.ref}`
      });
    } catch (error) {
      context.log(error);
    }
  });

  app.on("issue_comment.created", async context => {
    const body: string = context.payload.comment.body.trim().toLowerCase();
    const keywords = body.split(" ");
    if (keywords[0] !== "branch") {
      return;
    }

    let branchName =
      context.payload.issue.number +
      "-" +
      context.payload.issue.title.toLowerCase().replace(/ /g, "-");
    if (keywords.length > 1) {
      branchName = keywords[1];
    }

    const { repo, owner } = context.repo();

    try {
      const ref = await context.github.git.getRef({
        owner,
        repo,
        ref: "heads/master"
      });

      await context.github.git.createRef({
        owner,
        repo,
        sha: ref.data.object.sha,
        ref: `refs/heads/${branchName}`
      });
    } catch (error) {
      context.log(error);
    }
  });
};
