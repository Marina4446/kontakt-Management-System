document.addEventListener("DOMContentLoaded", async function () {
  const SERVER_URL = "http://localhost:3000";

  let number = 0;

  async function serverAddClient(obj) {
    let response = await fetch("http://localhost:3000" + "/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    let data = await response.json();
    return {
      ok: response.ok,
      data,
    };
  }
  async function serverChangeClient(obj, id) {
    let response = await fetch("http://localhost:3000" + "/api/clients/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj),
    });

    let data = await response.json();
    return {
      data,
      ok: response.ok,
    };
  }
  async function serverGetClient() {
    let response = await fetch("http://localhost:3000" + "/api/clients", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    let data = await response.json();
    return data;
  }

  async function serverDeleteClient(id) {
    let response = await fetch(SERVER_URL + "/api/clients/" + id, {
      method: "DELETE",
    });
    let data = await response.json();
    return data;
  }
  let serverData = await serverGetClient();

  let listData = [];

  if (listData !== null) {
    listData = serverData;
  }

  let sortColumnFlag = "id",
    sortDirFlag = true;

  //создание элементов

  const $app = document.getElementById("app"),
    $btnID = document.getElementById("btnID"),
    $btnFIO = document.getElementById("btnFIO"),
    $btnCreateAt = document.getElementById("createAt"),
    $btnChangeAt = document.getElementById("changeAt"),
    $btnContacts = document.getElementById("contacts"),
    $btnAction = document.getElementById("action"),
    $inputHeader = document.getElementById("input-header"),
    $nameInp = document.getElementById("new-user-name"),
    $lastnameInp = document.getElementById("new-user-lastname"),
    $surnameInp = document.getElementById("new-user-surname"),
    $table = document.createElement("table"),
    $tableHead = document.createElement("thead"),
    $tableBody = document.createElement("tbody"),
    $tableHeadTr = document.createElement("tr"),
    $tableHeadThID = document.createElement("th"),
    $tableHeadThFIO = document.createElement("th"),
    $tableHeadThCreate = document.createElement("th"),
    $tableHeadThChange = document.createElement("th"),
    $tableHeadThContacts = document.createElement("th"),
    $tableHeadThAction = document.createElement("th");

  $tableHeadThID.append($btnID),
    $tableHeadThFIO.append($btnFIO),
    $tableHeadThCreate.append($btnCreateAt),
    $tableHeadThChange.append($btnChangeAt),
    $tableHeadThContacts.append($btnContacts),
    $tableHeadThAction.append($btnAction);

  $table.classList.add("table", "table-hover");
  $tableBody.classList.add("table-striped");
  $tableHeadThID.classList.add("table-head-style");
  $tableHeadThFIO.classList.add("table-head-style");
  $tableHeadThCreate.classList.add("table-head-style");
  $tableHeadThChange.classList.add("table-head-style");
  $tableHeadThContacts.classList.add("table-head-style", "contacts-head");
  $tableHeadThAction.classList.add("table-head-style");
  $tableHeadTr.append($tableHeadThID);
  $tableHeadTr.append($tableHeadThFIO);
  $tableHeadTr.append($tableHeadThCreate);
  $tableHeadTr.append($tableHeadThChange);
  $tableHeadTr.append($tableHeadThContacts);
  $tableHeadTr.append($tableHeadThAction);

  $tableHead.append($tableHeadTr);
  $table.append($tableHead);

  $table.append($tableBody);
  $app.append($table);

  const deleteModal = new bootstrap.Modal(
    document.getElementById("deleteModal"),
    { backdrop: true }
  );

  let $formChangeUser = document.querySelector(".user-change-form"),
    $spanIdUser = document.querySelector(".form-user-id"),
    $nameChangeInput = document.querySelector(".user-name-change"),
    $surnameChangeInput = document.querySelector(".user-surname-change"),
    $removeChangeForm = document.querySelector(
      ".remove-button-change-user-form"
    ),
    $lastnameChangeInput = document.querySelector(".user-lastname-change"),
    $deleteBtnChangeForm = document.querySelector(".remove-change-user"),
    $addContactButtonChange = document.querySelector(".change-contact-button");

  let $errorMessageBlock = document.createElement("div"),
    $errorMessageDiv = document.createElement("div");
  let changeUserModal = new bootstrap.Modal(
    document.getElementById("changeModal"),
    { backdrop: true }
  );

  let $errorMessageChangeDiv = document.createElement("div");

  async function changeClient(id) {
    let isOk;
    const clientData = parseFormData($formChangeUser);

    let answerFromServer = await serverChangeClient(clientData, id);
    console.log(answerFromServer.data);

    if (answerFromServer.ok) {
      number = 0;
      $addContactsButton.classList.remove("contact-button-none");
      $addContactButtonChange.classList.remove("change-contact-button-none");
      $errorMessageDiv.innerHTML = "";
      const indexID = listData.findIndex((oneUser) => oneUser.id === id);
      listData[indexID] = answerFromServer.data;
      changeUserModal.hide();
      $errorMessageChangeDiv.remove();
      isOk = true;
      render(listData);
    } else {
      $errorMessageChangeDiv.innerHTML = "";
      number = 0;
      $addContactsButton.classList.remove("contact-button-none");
      $addContactButtonChange.classList.remove("change-contact-button-none");
      if (answerFromServer.data.errors) {
        for (const errorChange of answerFromServer.data.errors) {
          let $addContactsChange = document.querySelector(
            ".add-contact-change"
          );
          $errorMessageChangeDiv.classList.add("error-message-div");
          let errorMessageChange = errorChange.message;
          let $errorMessageChangeBlock = document.createElement("div");
          $addContactsChange.prepend($errorMessageChangeBlock);
          $errorMessageChangeBlock.append($errorMessageChangeDiv);
          $errorMessageChangeDiv.append(" Ошибка: ", errorMessageChange, "; ");
        }
      }
      isOk = false;
    }
    return isOk;
  }

  function createOption(value) {
    const optionEl = document.createElement("option");
    optionEl.textContent = value;

    return optionEl;
  }
  function createContactsSelect(contact) {
    const optionsMap = ["Телефон", "E-mail", "Facebook", "VK", "Другое"];

    const contactLabel = document.createElement("label"),
      labelSelect = document.createElement("select");

    labelSelect.name = "contact-type";
    contactLabel.classList.add("task", "select__label");
    labelSelect.classList.add(
      "select",
      "contact-type",
      "style-choices",
      "custom__select"
    );

    for (const opt of optionsMap) {
      const option = createOption(opt);
      if (contact) {
        if (contact.type === opt) {
          option.selected = true;
        }
      }

      labelSelect.append(option);
    }

    contactLabel.append(labelSelect);
    contactLabel.setAttribute("data-value", "priver");
    return { contactLabel, labelSelect };
  }

  function createInputContacts(obj) {
    const inputBlock = document.createElement("div"),
      inputValue = document.createElement("input");

    inputValue.placeholder = "Введите даннные контакта";

    inputBlock.append(inputValue);
    inputBlock.classList.add("input-block");
    inputValue.classList.add("contact-value", "input-contacts");
    inputValue.name = "contact-value";

    if (obj) {
      inputValue.value = obj.value;
    }

    inputValue.addEventListener("input", function () {
      inputBlock.append(inputSVG);
      inputValue.classList.add("input-contacts-with-button");
    });

    return inputBlock;
  }

  function changeContactsInModal(contactObj) {
    const contactSelect = document.createElement("div");
    const contObj = createContactsSelect(contactObj);
    const inputBlock = createInputContacts(contactObj);

    const inputSVG = document.createElement("button");
    inputSVG.type = "button";

    inputSVG.classList.add("button-input-clean", "button");

    contactSelect.classList.add("select-contacts-active");
    contactSelect.append(contObj.contactLabel);
    contactSelect.append(inputBlock);

    console.log(number);
    inputSVG.addEventListener("click", function () {
      if (number < 10) {
        $addContactButtonChange.classList.remove("change-contact-button-none");
      }
    });

    // $addContactButtonChange.addEventListener("click", function () {
    //   if (number <= 10) {
    //     number++;
    //   }
    //   if (number >= 10) {
    //     $addContactButtonChange.classList.add("change-contact-button-none");
    //   }
    // });

    inputSVG.addEventListener("click", function (event) {
      event.preventDefault();
      contactSelect.remove();
    });
    const choices = new Choices(contObj.labelSelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      position: "bottom",
    });

    return contactSelect;
  }

  //отрисовка пользователя
  function createUserTr(oneUser) {
    const $userTr = document.createElement("tr"),
      $userID = document.createElement("td"),
      $userFIO = document.createElement("td"),
      $userCreate = document.createElement("td"),
      $userChange = document.createElement("td"),
      $userContacts = document.createElement("td"),
      $changeBtnTh = document.createElement("td"),
      $changeBtn = document.createElement("button"),
      $deleteBtn = document.createElement("button");
    $changeBtn.textContent = "Изменить";
    $deleteBtn.textContent = "Удалить";

    $deleteBtn.type = "button";
    $deleteBtn.setAttribute("data-bs-toggle", "modal");
    $deleteBtn.setAttribute("data-bs-target", "#deleteModal");

    $changeBtn.type = "button";
    $changeBtn.setAttribute("data-bs-toggle", "modal");
    $changeBtn.setAttribute("data-bs-target", "#changeModal");

    $deleteBtn.classList.add("button", "btn-delete");
    $changeBtn.classList.add("button", "btn-change");
    $userTr.classList.add("table-user-tr");
    $userID.classList.add("grey-style");
    $userFIO.classList.add("black-style");
    $userCreate.classList.add("black-style");
    $userChange.classList.add("black-style");
    $userContacts.classList.add("contacts-style");
    oneUser.fio = oneUser.surname + " " + oneUser.name + " " + oneUser.lastName;

    function normalizeMonthOrYear(num) {
      return num <= 9 ? `0${num}` : `${num}`;
    }

    const $normalizeCreatedAt = new Date(oneUser.createdAt);
    const $normalizeChangeAt = new Date(oneUser.updatedAt);

    oneUser.createDate =
      normalizeMonthOrYear($normalizeCreatedAt.getDate()) +
      "." +
      normalizeMonthOrYear($normalizeCreatedAt.getMonth()) +
      "." +
      $normalizeCreatedAt.getFullYear() +
      "  " +
      normalizeMonthOrYear($normalizeCreatedAt.getHours()) +
      ":" +
      normalizeMonthOrYear($normalizeCreatedAt.getMinutes());

    oneUser.changeDate =
      normalizeMonthOrYear($normalizeChangeAt.getDate()) +
      "." +
      normalizeMonthOrYear($normalizeChangeAt.getMonth()) +
      "." +
      $normalizeChangeAt.getFullYear() +
      "  " +
      normalizeMonthOrYear($normalizeChangeAt.getHours()) +
      ":" +
      normalizeMonthOrYear($normalizeChangeAt.getMinutes());

    //клики удаления
    let $deleteBlockDltButton = document.querySelector(
      ".delete-block-dlt-button"
    );

    async function onDeleteBtnClick() {
      await serverDeleteClient(oneUser.id);
      let indexDelId = oneUser.id;
      console.log(indexDelId);
      let indexIDDel = listData.findIndex(
        (oneUser) => oneUser.id === indexDelId
      );
      console.log(indexIDDel);
      let removedUser = listData.splice(indexIDDel, 1);
      console.log("удаляемый элемент", removedUser);
      deleteModal.hide();
      render(listData);
    }

    const modDel = document.querySelector("#deleteModal");
    const modChange = document.querySelector("#changeModal");
    const modNew = document.querySelector("#exampleModal");

    $deleteBtn.addEventListener("click", async function () {
      $deleteBlockDltButton.addEventListener("click", onDeleteBtnClick);
      modDel.addEventListener("hide.bs.modal", function () {
        $deleteBlockDltButton.removeEventListener("click", onDeleteBtnClick);
      });
    });

    //изменение пользователя

    $changeBtn.addEventListener("click", async function (e) {
      number = 0;
      e.preventDefault();
      async function submitHundler(e) {
        e.preventDefault();
        number = 0;

        const changeIsOk = await changeClient(oneUser.id);

        if (changeIsOk) {
          number = 0;
          $contactBlockChange.innerHTML = "";
          $formChangeUser.removeEventListener("submit", submitHundler);
        }
      }

      $spanIdUser.textContent = "ID: " + oneUser.id;
      $surnameChangeInput.value = oneUser.surname;
      $nameChangeInput.value = oneUser.name;
      $lastnameChangeInput.value = oneUser.lastName;

      if (oneUser.contacts) {
        number = oneUser.contacts.length;
        for (let i = 0; i < oneUser.contacts.length; i++) {
          const contactWrap = changeContactsInModal(oneUser.contacts[i]);
          $contactBlockChange.append(contactWrap);
        }
      }
      $formChangeUser.addEventListener("submit", submitHundler);

      $deleteBlockDltButton.addEventListener("click", onDeleteBtnClick);
      modDel.addEventListener("hide.bs.modal", function () {
        $deleteBlockDltButton.removeEventListener("click", onDeleteBtnClick);
      });

      $addContactButtonChange.addEventListener("click", addMoreContactChange);
      $removeChangeForm.addEventListener("click", function onFormClose() {
        number = 0;
        $addContactButtonChange.classList.remove("change-contact-button-none");
        $errorMessageChangeDiv.innerHTML = "";
        $contactBlockChange.innerHTML = "";
        $addContactButtonChange.removeEventListener(
          "click",
          addMoreContactChange
        );

        $formChangeUser.removeEventListener("submit", submitHundler);
        $removeChangeForm.removeEventListener("click", onFormClose);
      });
    });
    modChange.addEventListener("hide.bs.modal", function () {
      number = 0;
      $addContactButtonChange.classList.remove("change-contact-button-none");
      $errorMessageDiv.innerHTML = "";
      $contactBlockChange.innerHTML = "";
    });
    modNew.addEventListener("hide.bs.modal", function () {
      number = 0;
      $addContactsButton.classList.remove("contact-button-none");
      $errorMessageDiv.innerHTML = "";
      $contactBlock.innerHTML = "";
    });

    //добавление контактов в таблицу

    tippy("[data-tippy-content]");

    let buttonNumberContacts = 0;
    let moreContacts = document.createElement("button");

    if (oneUser.contacts) {
      for (let i = 0; i < oneUser.contacts.length; i++) {
        let $telButton = document.createElement("button");
        let $mailButton = document.createElement("button");
        let $facebookButton = document.createElement("button");
        let $VKButton = document.createElement("button");
        let $elseButton = document.createElement("button");

        let contactsData =
          oneUser.contacts[i].type + " :" + oneUser.contacts[i].value;
        if (
          oneUser.contacts[i].type === "Телефон" &&
          oneUser.contacts[i].value !== ""
        ) {
          $userContacts.append($telButton);
          buttonNumberContacts++;
          if (buttonNumberContacts > 4) {
            $telButton.classList.add("contact-button-none");
          }
          $telButton.classList.add("contact-tel", "btn");
          tippy($telButton, {
            content: contactsData,
          });
        }
        if (
          oneUser.contacts[i].type === "E-mail" &&
          oneUser.contacts[i].value !== ""
        ) {
          $userContacts.append($mailButton);
          buttonNumberContacts++;
          if (buttonNumberContacts > 4) {
            $mailButton.classList.add("contact-button-none");
          }
          $mailButton.classList.add("contact-email", "btn");
          tippy($mailButton, {
            content: contactsData,
          });
        }
        if (
          oneUser.contacts[i].type === "Facebook" &&
          oneUser.contacts[i].value !== ""
        ) {
          $userContacts.append($facebookButton);
          buttonNumberContacts++;
          if (buttonNumberContacts > 4) {
            $facebookButton.classList.add("contact-button-none");
          }
          $facebookButton.classList.add("contact-facebook", "btn");
          tippy($facebookButton, {
            content: contactsData,
          });
        }

        if (
          oneUser.contacts[i].type === "VK" &&
          oneUser.contacts[i].value !== ""
        ) {
          $userContacts.append($VKButton);
          buttonNumberContacts++;
          if (buttonNumberContacts > 4) {
            $VKButton.classList.add("contact-button-none");
          }
          $VKButton.classList.add("contact-vk", "btn");

          tippy($VKButton, {
            content: contactsData,
          });
        }
        if (
          oneUser.contacts[i].type === "Другое" &&
          oneUser.contacts[i].value !== ""
        ) {
          $userContacts.append($elseButton);
          buttonNumberContacts++;
          if (buttonNumberContacts > 4) {
            $elseButton.classList.add("contact-button-none");
          }
          $elseButton.classList.add("contact-else", "btn");
          tippy($elseButton, {
            content: contactsData,
          });
        }
        moreContacts.addEventListener("click", function (elem) {
          elem.preventDefault();
          $VKButton.classList.remove("contact-button-none");
          $facebookButton.classList.remove("contact-button-none");
          $mailButton.classList.remove("contact-button-none");
          $telButton.classList.remove("contact-button-none");
          $elseButton.classList.remove("contact-button-none");
          moreContacts.remove();
        });
      }
    }
    if (buttonNumberContacts > 4) {
      $userContacts.append(moreContacts);
      moreContacts.classList.add("more-contacts", "button");
      moreContacts.textContent = "+" + (buttonNumberContacts - 4);
    }

    ($userID.textContent = oneUser.id),
      ($userFIO.textContent = oneUser.fio),
      ($userCreate.textContent = oneUser.createDate),
      ($userChange.textContent = oneUser.changeDate),
      $changeBtnTh.classList.add("bth-change-delete-th");

    $userTr.append($userID);
    $userTr.append($userFIO);
    $userTr.append($userCreate);
    $userTr.append($userChange);
    $userTr.append($userContacts);
    $userTr.append($changeBtnTh);

    $changeBtnTh.append($changeBtn);
    $changeBtnTh.append($deleteBtn);

    return $userTr;
  }
  function render(arrData) {
    $tableBody.innerHTML = "";
    let copyListData = [...arrData];

    //сортировка
    copyListData = copyListData.sort(function (a, b) {
      let sort = a[sortColumnFlag] < b[sortColumnFlag];
      if (sortDirFlag == false) sort = a[sortColumnFlag] > b[sortColumnFlag];
      if (sort) return -1;
      else 1;
    });
    //фильтрация

    function filterUser(val) {
      let dataCopy = [...listData];
      const cleanVal = val.trim();
      return dataCopy.filter(function (oneUser) {
        return `${oneUser.name} ${oneUser.surname} ${oneUser.lastName}`.includes(
          cleanVal
        );
      });
    }

    let filterTimeout;

    $inputHeader.addEventListener("input", function () {
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(() => {
        const filteredArr = filterUser($inputHeader.value);
        render(filteredArr);
      }, 600);
    });

    for (const oneUser of copyListData) {
      const $newTr = createUserTr(oneUser);
      $tableBody.append($newTr);
    }
  }

  render(listData);

  let $btnIDSvg = document.querySelector(".btn-id-svg"),
    $btnFIOSvg = document.querySelector(".btn-fio-svg"),
    $btnCreateSvg = document.querySelector(".btn-create-svg"),
    $btnChangeSvg = document.querySelector(".btn-change-svg");

  //клики сортировки
  $btnID.addEventListener("click", function () {
    $btnIDSvg.classList.toggle("btn-id-rotate");
    sortColumnFlag = "id";
    sortDirFlag = !sortDirFlag;
    render(listData);
  });

  $btnFIO.addEventListener("click", function () {
    $btnFIOSvg.classList.toggle("btn-id-rotate");
    sortColumnFlag = "fio";
    sortDirFlag = !sortDirFlag;
    render(listData);
  });
  $btnChangeAt.addEventListener("click", function () {
    $btnChangeSvg.classList.toggle("btn-id-rotate");
    sortColumnFlag = "updatedAt";
    sortDirFlag = !sortDirFlag;

    render(listData);
  });
  $btnCreateAt.addEventListener("click", function () {
    $btnCreateSvg.classList.toggle("btn-id-rotate");
    sortColumnFlag = "createdAt";
    sortDirFlag = !sortDirFlag;

    render(listData);
  });

  $inputHeader.addEventListener("input", function () {
    render(listData);
  });

  //форма добавления нового пользователя(клики)

  let $formAddNewUser = document.getElementById("user-form");
  let $removeButtonNewUser = document.querySelector(
      ".remove-button-new-user-form"
    ),
    $removeUserButton = document.querySelector(".remove-new-user");

  let $addContactsButton = document.querySelector(".add-contact-button"),
    $addContacts = document.querySelector(".add-contact");

  $removeButtonNewUser.addEventListener("click", function () {
    number = 0;
    $addContactsButton.classList.remove("contact-button-none");
    $errorMessageDiv.innerHTML = "";
    $contactBlock.innerHTML = "";
  });
  $removeUserButton.addEventListener("click", function () {
    number = 0;
    $addContactsButton.classList.remove("contact-button-none");
    $errorMessageDiv.innerHTML = "";
    $contactBlock.innerHTML = "";
  });

  let $contactBlockChange = document.querySelector(".contact-block-change");
  function addMoreContactChange() {
    // number = 0;
    console.log(number);
    let contactSelect = document.createElement("div"),
      contactLabel = document.createElement("label"),
      labelSelect = document.createElement("select"),
      inputBlock = document.createElement("div"),
      optionTel = document.createElement("option"),
      optionMail = document.createElement("option"),
      optionFacebook = document.createElement("option"),
      optionVK = document.createElement("option"),
      optionElse = document.createElement("option"),
      inputValue = document.createElement("input"),
      inputSVG = document.createElement("button");

    inputSVG.type = "button";

    optionTel.textContent = "Телефон";
    optionMail.textContent = "E-mail";
    optionFacebook.textContent = "Facebook";
    optionVK.textContent = "VK";
    optionElse.textContent = "Другое";
    inputValue.placeholder = "Введите даннные контакта";

    contactSelect.classList.add("select-contacts-active");

    contactLabel.classList.add("task", "select__label");
    labelSelect.classList.add(
      "select",
      "contact-type",
      "style-choices",
      "custom__select"
    );

    labelSelect.name = "contact-type";
    inputBlock.classList.add("input-block");
    inputValue.classList.add("contact-value", "input-contacts");
    inputSVG.classList.add("button-input-clean", "button");
    inputValue.name = "contact-value";

    $contactBlockChange.append(contactSelect);
    contactSelect.append(contactLabel);
    contactLabel.append(labelSelect);
    labelSelect.append(optionTel);
    labelSelect.append(optionMail);
    labelSelect.append(optionFacebook);
    labelSelect.append(optionVK);
    labelSelect.append(optionElse);
    contactSelect.append(inputBlock);
    inputBlock.append(inputValue);

    inputValue.addEventListener("input", function () {
      inputBlock.append(inputSVG);
      inputValue.classList.add("input-contacts-with-button");
    });

    inputSVG.addEventListener("click", function () {
      if (number < 10) {
        $addContactButtonChange.classList.remove("change-contact-button-none");
      }
    });

    if (number < 9) {
      number++;
    } else {
      $addContactButtonChange.classList.add("change-contact-button-none");
    }

    inputSVG.addEventListener("click", function (event) {
      event.preventDefault();
      contactSelect.remove();
    });
    const choices = new Choices(labelSelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      position: "bottom",
    });
  }
  let $contactBlock = document.querySelector(".contact-block");

  function addMoreContact() {
    let contactSelect = document.createElement("div"),
      contactLabel = document.createElement("label"),
      labelSelect = document.createElement("select"),
      inputBlock = document.createElement("div"),
      optionTel = document.createElement("option"),
      optionMail = document.createElement("option"),
      optionFacebook = document.createElement("option"),
      optionVK = document.createElement("option"),
      optionElse = document.createElement("option"),
      inputValue = document.createElement("input"),
      inputSVG = document.createElement("button");

    inputSVG.type = "button";

    optionTel.textContent = "Телефон";
    optionMail.textContent = "E-mail";
    optionFacebook.textContent = "Facebook";
    optionVK.textContent = "VK";
    optionElse.textContent = "Другое";
    inputValue.placeholder = "Введите даннные контакта";

    contactSelect.classList.add("select-contacts-active");

    contactLabel.classList.add("task", "select__label");
    labelSelect.classList.add(
      "select",
      "contact-type",
      "style-choices",
      "custom__select"
    );

    labelSelect.name = "contact-type";
    inputBlock.classList.add("input-block");
    inputValue.classList.add("contact-value", "input-contacts");
    inputSVG.classList.add("button-input-clean", "button");
    inputValue.name = "contact-value";

    $contactBlock.append(contactSelect);
    contactSelect.append(contactLabel);
    contactLabel.append(labelSelect);
    labelSelect.append(optionTel);
    labelSelect.append(optionMail);
    labelSelect.append(optionFacebook);
    labelSelect.append(optionVK);
    labelSelect.append(optionElse);
    contactSelect.append(inputBlock);
    inputBlock.append(inputValue);

    inputValue.addEventListener("input", function () {
      inputBlock.append(inputSVG);
      inputValue.classList.add("input-contacts-with-button");
    });

    // inputSVG.addEventListener("click", function () {});

    inputSVG.addEventListener("click", function (event) {
      event.preventDefault();
      contactSelect.remove();

      number--;

      if (number === 9) {
        $addContactsButton.classList.remove("contact-button-none");
      }
    });
    const choices = new Choices(labelSelect, {
      searchEnabled: false,
      itemSelectText: "",
      shouldSort: false,
      position: "bottom",
    });
  }
  $addContactsButton.addEventListener("click", function (event) {
    event.preventDefault();
    addMoreContact();
  });

  $addContactsButton.addEventListener("click", function () {
    if (number <= 10) {
      number++;
    }
    if (number >= 10) {
      $addContactsButton.classList.add("contact-button-none");
    }
  });

  //получение данных из формы

  const CONTACT_TYPE = "contact-type";
  const CONTACT_VALUE = "contact-value";

  function parseContacts(contacts) {
    const contactsLenght = contacts.length;
    const preparedContacts = [];

    for (let i = 0; i < contactsLenght; i += 2) {
      preparedContacts.push({ type: contacts[i], value: contacts[i + 1] });
    }
    return preparedContacts;
  }

  function parseFormData(formElement) {
    const formData = new FormData(formElement);
    const resultObj = { contacts: [] };

    for (const pair of formData.entries()) {
      if (pair[0] !== CONTACT_TYPE && pair[0] !== CONTACT_VALUE) {
        resultObj[pair[0]] = pair[1];
      } else {
        resultObj.contacts.push(pair[1]);
      }
    }

    resultObj.contacts = parseContacts(resultObj.contacts);
    return resultObj;
  }

  const newUserModal = new bootstrap.Modal(
    document.getElementById("exampleModal"),
    { backdrop: true }
  );

  $formAddNewUser.addEventListener("submit", async function (event) {
    event.preventDefault();

    const clientData = parseFormData($formAddNewUser);

    let addObject = {
      name: $nameInp.value.trim(),
      lastName: $lastnameInp.value.trim(),
      surname: $surnameInp.value.trim(),
      contacts: clientData.contacts,
    };

    let answerFromServer = await serverAddClient(addObject);

    console.log("ANSWER", answerFromServer);
    if (answerFromServer.ok) {
      listData.push(answerFromServer.data);

      render(listData);
      number = 0;
      $addContactsButton.classList.remove("contact-button-none");
      $addContactButtonChange.classList.remove("change-contact-button-none");
      $contactBlock.innerHTML = "";
      $nameInp.value = "";
      $surnameInp.value = "";
      $lastnameInp.value = "";
      $errorMessageDiv.remove();
      newUserModal.hide();
    } else {
      number = 0;
      $addContactsButton.classList.remove("contact-button-none");
      $addContactButtonChange.classList.remove("change-contact-button-none");
      $errorMessageDiv.innerHTML = "";
      $contactBlock.innerHTML = "";
      $errorMessageDiv.classList.add("error-message-div");
      if (answerFromServer.data.errors.length) {
        for (const error of answerFromServer.data.errors) {
          let errorMessage = error.message;
          $addContacts.prepend($errorMessageBlock);
          $errorMessageBlock.append($errorMessageDiv);
          $errorMessageDiv.append(" Ошибка: ", errorMessage, "; ");
        }
      }
    }
  });

  //ошибки сервера для добавления нового пользователя

  const form = document.querySelector(".user-error");
  const inputsElems = Array.from(form.querySelectorAll(".js-input"));

  function createEl(tag, classNames = [], text) {
    const el = document.createElement(tag);
    el.textContent = text;

    for (const clName of classNames) {
      el.classList.add(clName);
    }

    return el;
  }

  function createErrorMessage(errorText) {
    const errorMessage = createEl("span", ["invalid-feedback"], errorText);
    return errorMessage;
  }

  function showErrMessage(errContaner, errElem, form) {
    form.classList.add("is-invalid");
    errContaner.append(errElem);
  }

  function cleanErrMess(container, form) {
    if (form.classList.contains("is-invalid")) {
      const errMessEl = container.querySelector(".invalid-feedback");
      form.classList.remove("is-invalid");
      errMessEl.remove();
    }
  }

  function showErrorMessages(inputs, errors = []) {
    console.log("Ошибки", errors);

    for (const input of inputs) {
      const inputWrap = input.parentElement;
      const hasErr = errors.find((err) => input.id === err.field);

      if (hasErr) {
        cleanErrMess(inputWrap, input);

        const errElem = createErrorMessage(hasErr.message);
        showErrMessage(inputWrap, errElem, input);
      } else {
        cleanErrMess(inputWrap, input);
      }
    }
  }

  async function sendClient(clientData) {
    try {
      const res = await fetch(SERVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(clientData),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Добавление клиента", data);
        form.reset();
      }

      showErrorMessages(inputsElems, data.errors);
    } catch (error) {}
  }
});
