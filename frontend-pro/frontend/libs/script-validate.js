document.addEventListener("DOMContentLoaded", function () {
  const validation = new JustValidate(".form");
  im.mask(selector);

  validation
    .addField(".name", [
      {
        rule: "minLength",
        value: 3,
        errorMessage: "Ошибка",
      },
      {
        rule: "maxLength",
        value: 5,
        errorMessage: "Ошибка",
      },
    ])
    .addField(".mail", [
      {
        rule: "required",
        errorMessage: "Ошибка",
      },
      {
        rule: "email",
        errorMessage: "Ошибка",
      },
    ]);
});
