import { Application } from "probot"; // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on("create", async context => {
    const payload = context.payload;

    if (!payload.ref_type || payload.ref_type !== "branch") return;

    const branchName: string = payload.ref;
    const issueReference = Number.parseInt(branchName.split("-")[0]);
    if (isNaN(issueReference)) return;

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
