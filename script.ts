import { Dropdown } from "./select";

const dropdownElements = document.querySelectorAll(".dropdown");

dropdownElements.forEach(dropdownElement => {
  new Dropdown(dropdownElement as HTMLSelectElement);
});
