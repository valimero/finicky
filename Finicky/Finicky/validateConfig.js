(function() {
  const { validate, getErrors } = fastidious;

  const browserSchema = validate.oneOf([
    validate.string,
    validate.shape({
      name: validate.string.isRequired,
      appType: validate.oneOf(["appName", "bundleId"]),
      openInBackground: validate.boolean
    }),
    validate.function
  ]);

  const matchSchema = validate.oneOf([
    validate.string,
    validate.function,
    validate.regex,
    validate.arrayOf(
      validate.oneOf([validate.string, validate.function, validate.regex])
    )
  ]);

  const schema = {
    defaultBrowser: browserSchema.isRequired,
    options: validate.shape({
      hideIcon: validate.boolean,
      urlShorteners: validate.arrayOf(validate.string)
    }),
    rewrite: validate.arrayOf(
      validate.shape({
        match: matchSchema.isRequired,
        url: validate.oneOf([validate.string, validate.function]).isRequired
      }).isRequired
    ),
    handlers: validate.arrayOf(
      validate.shape({
        match: matchSchema.isRequired,
        browser: browserSchema.isRequired
      })
    )
  };

  return function validateConfig() {
    if (!module) {
      throw new Error("module is not defined");
    }

    const invalid = getErrors(module.exports, schema, "module.exports.");

    if (invalid.length === 0) {
      return true;
    }

    throw new Error(invalid.join("\n"));
  };
})();
