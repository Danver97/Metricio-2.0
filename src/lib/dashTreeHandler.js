export default class DashTreeHandler {
  constructor() {
    if (!window.dashTree)
      window.dashTree = [];
    this.dashTree = window.dashTree;
  }
  
  addElement(e) {
    const elem = e || this.newElement();
    if (!elem) return;
    if (!elem.href || !elem.name)
      throw new Error(`Missing the following property: ${!elem.href ? 'href' : ''} ${!elem.name ? 'name' : ''}`);
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
    };
    return elem;
  }
  
  popAllUntil(name) {
    const idx = window.dashTree.findIndex(e => e.name === name);
    this.dashTree.splice(idx + 1);
    this.ensureReferenceIsMantained();
    return this.dashTree[idx];
  }
  
  getAll() {
    return this.dashTree.slice();
  }
  
  ensureReferenceIsMantained() {
    window.dashTree = this.dashTree;
  }
}
