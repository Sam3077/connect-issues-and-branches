import { Application } from "probot"; // eslint-disable-line no-unused-vars
import { isNull } from "util";

export = (app: Application) => {
  app.on("create", async context => {
    const config = await context.config("config.yml");
    const branchNameRegex = new RegExp(
      config.branchNameRegex || "^[A-Za-z/_-]*[0-9]+[A-Za-z0-9/_-]*$"
    );
    const issueReferenceRegex = new RegExp(
      config.issueReferenceRegex || "[0-9]+"
    );

    const payload = context.payload;
    if (!payload.ref_type || payload.ref_type !== "branch") return;

    const branchName: string = payload.ref;
    context.log(config.branchNameRegex);
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
