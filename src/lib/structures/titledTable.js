export default class TitledTableStructure {
  constructor(title, elements, titleButton, titleLink) {
    if ((titleButton && !titleLink) || (!titleButton && titleLink))
      throw new Error('titleLink and titleButton should be both set or unset');
    if (!elements || !Array.isArray(elements))
      throw new Error('elements should be an Array');
    this.title = title;
    this.titleLink = titleLink;
    this.titleButton = titleButton;
    this.elements = elements;
  }
}
