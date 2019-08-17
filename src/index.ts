import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { isNull } from "util";

export = (app: Application) => {
  app.on("create", async context => {
    const payload = context.payload;
    const config = await context.config("config.yml");

    if (!payload.ref_type || payload.ref_type !== "branch") return;

    const branchName: string = payload.ref;
    if (!branchName.match(config.branchNameRegex)) return;

    const regexMatch = branchName.match(config.issueReferenceRegex);
    if (isNull(regexMatch) || regexMatch.length == 0) return;

    const issueReference = Number.parseInt(regexMatch[0]);

    try {
      await context.github.issues.createComment({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        number: issueReference,
        body: `A branch has been created for this issue. It can be found at:  ${
          payload.repository.html_url
        }/tree/${payload.ref}`
      });

      context.log("successfully commented on issue");
    } catch (error) {
      context.log(error);
    }
  });
};
