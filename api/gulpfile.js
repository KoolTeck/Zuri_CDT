const gulp = require("gulp");
const apidoc = require("gulp-apidoc");

gulp.task("apidoc", (done) => {
  apidoc(
    {
      src: "./api",
      dest: "../docs/",
    },
    done
  );
});

gulp.task("watch", () => {
  gulp.watch(["./api/**"], ["apidoc"]);
});
