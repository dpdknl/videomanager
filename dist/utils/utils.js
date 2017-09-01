"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    /**
     * Removes an element from the DOM
     *
     * @param element
     */
    removeElement: function removeElement(element) {
        element && element.parentNode && element.parentNode.removeChild(element);
    }
};