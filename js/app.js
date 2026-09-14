import { FilterUi } from "./CategoryFilterUi.js";

export function app(manager) {
    const filterInstance = new FilterUi(manager);
    filterInstance.render();
}