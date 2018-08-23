export default class DashTreeHandler {
  constructor(history) {
    if (!window.dashTree)
      window.dashTree = [];
    this.dashTree = window.dashTree;
    this.history = history;
  }
  
  addElement(e) {
    const elem = e || this.newElement();
    if (!elem) return;
    if (!elem.href || !elem.name)
      throw new Error(`Missing the following property: ${!elem.href ? 'href' : ''} ${!elem.name ? 'name' : ''}`);
    if (this.dashTree.filter(d => d.name === elem.name).length < 1)
      this.dashTree.push(elem);
    this.ensureReferenceIsMantained();
  }
  
  newElement() {
    const regex = /\/dashboard\/([A-Za-z0-9]+)(?:\?)?(?:.)*/;
    const pathname = window.location.pathname;
    if (!regex.test(pathname))
      return null;
    const elem = {
      name: regex.exec(pathname)[1] || 'index2',
      href: window.location.href,
      index: this.dashTree.length,
    };
    return elem;
  }
  
  popUntil(name) {
    const idx = window.dashTree.findIndex(e => e.name === name);
    this.dashTree.splice(idx + 1);
    this.ensureReferenceIsMantained();
    return this.dashTree[idx];
  }
  
  popAllUntil(name) {
    const current = this.getCurrent();
    const lastPopped = this.popUntil(name);
    if (this.history)
      this.history.go(-1 * (current.index - lastPopped.index));
    return lastPopped;
  }
  
  getAll() {
    return this.dashTree.slice();
  }
  
  getCurrent() {
    return this.dashTree[this.dashTree.length - 1];
  }
  
  ensureReferenceIsMantained() {
    window.dashTree = this.dashTree;
  }
}
