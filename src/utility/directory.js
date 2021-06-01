import { v4 as uuidv4 } from 'uuid';

export default class Directory {
  constructor(name) {
    this.name = name;
    this.id = uuidv4();
    this.children = [];
  }

  addchildren(newChild) {
    this.children.push(newChild);
  }

  editName(newName) {
    this.name = newName;
  }

  removeChildren(childrenId) {
    const index = this.children.findIndex(child => child.id === childrenId);
    this.children.splice(index, 1);
  }
}