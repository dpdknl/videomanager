export default {
    /**
     * Removes an element from the DOM
     *
     * @param element
     */
    removeElement: (element) =>
    {
        element && element.parentNode && element.parentNode.removeChild(element);
    }
}
