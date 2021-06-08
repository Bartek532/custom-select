type SelectFormattedOption = {
  value: string;
  label: string;
  selected: boolean;
  element: HTMLOptionElement;
};

export class Dropdown {
  dropdownElement: HTMLSelectElement;
  optionElements: SelectFormattedOption[];
  wrapperElement: HTMLDivElement;
  labelElement: HTMLSpanElement;
  optionsListElement: HTMLUListElement;

  constructor(element: HTMLSelectElement) {
    this.dropdownElement = element;
    this.optionElements = getFormattedOptions(
      document.querySelectorAll("option")
    );
    this.wrapperElement = document.createElement("div");
    this.labelElement = document.createElement("span");
    this.optionsListElement = document.createElement("ul");
    setupDropdownElement(this);
    element.style.display = "none";
    element.after(this.wrapperElement);
  }

  get selectedOption() {
    return this.optionElements.find(option => option.selected);
  }

  get selectedOptionIndex() {
    return this.optionElements.indexOf(this.selectedOption);
  }

  selectValue(value: string) {
    const newSelectedOption = this.optionElements.find(
      option => option.value === value
    );

    const prevSelectedOption = this.selectedOption;
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.labelElement.innerText = newSelectedOption.label;

    this.optionsListElement
      .querySelector(`[data-value="${prevSelectedOption.value}"]`)
      .classList.remove("selected");

    const newSelectedElement = this.optionsListElement.querySelector(
      `[data-value="${newSelectedOption.value}"]`
    );

    newSelectedElement.classList.add("selected");
    newSelectedElement.scrollIntoView({ block: "nearest" });
  }
}

let debounceTimeout;
let searchTerm = "";

const setupDropdownElement = (select: Dropdown) => {
  select.wrapperElement.classList.add("custom-select-wrapper");
  select.wrapperElement.tabIndex = 0;

  select.labelElement.classList.add("custom-select-selected-value");
  select.labelElement.innerText = select.selectedOption.label;
  select.wrapperElement.append(select.labelElement);

  select.optionElements.forEach(optionElement => {
    const option = document.createElement("li");
    option.classList.add("custom-select-options-list-item");
    option.classList.toggle("selected", optionElement.selected);

    option.addEventListener("click", () => {
      select.selectValue(optionElement.value);
      select.optionsListElement.classList.remove("show");
    });
    option.innerText = optionElement.label;
    option.dataset.value = optionElement.value;
    select.optionsListElement.append(option);
  });

  select.optionsListElement.classList.add("custom-select-options-list");
  select.wrapperElement.append(select.optionsListElement);

  select.labelElement.addEventListener("click", () => {
    select.optionsListElement.classList.toggle("show");
  });

  select.wrapperElement.addEventListener("blur", () => {
    select.optionsListElement.classList.remove("show");
  });

  select.wrapperElement.addEventListener("keydown", e => {
    switch (e.code) {
      case "Space":
        select.optionsListElement.classList.toggle("show");
        break;

      case "ArrowUp": {
        const prevOption =
          select.optionElements[select.selectedOptionIndex - 1];

        if (prevOption) {
          select.selectValue(prevOption.value);
        }
        break;
      }
      case "ArrowDown": {
        const nextOption =
          select.optionElements[select.selectedOptionIndex + 1];

        if (nextOption) {
          select.selectValue(nextOption.value);
        }
        break;
      }
      case "Enter":
      case "Escape":
        select.optionsListElement.classList.remove("show");
        break;
      default: {
        clearTimeout(debounceTimeout);
        searchTerm += e.key;
        debounceTimeout = setTimeout(() => {
          searchTerm = "";
        }, 500);

        const searchedOption = select.optionElements.find(option => {
          return option.label.toLowerCase().startsWith(searchTerm);
        });

        if (searchedOption) {
          select.selectValue(searchedOption.value);
        }
      }
    }
  });
};

const getFormattedOptions = (
  options: HTMLOptionElement[] | NodeListOf<HTMLOptionElement>
) => {
  return [...options].map(option => {
    return {
      value: option.value,
      label: option.label,
      selected: option.selected,
      element: option,
    };
  });
};
