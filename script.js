import { Dropdown } from "./select.js";

const dropdownElements = document.querySelectorAll(".dropdown");

dropdownElements.forEach(dropdownElement => {
  new Dropdown(dropdownElement);
});
