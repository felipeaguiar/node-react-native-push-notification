export class ConcurrencyError extends Error {

  entity: any;

  constructor(entity: any) {
    super();
    this.entity = entity;
    Object.setPrototypeOf(this, ConcurrencyError.prototype);
  }

}
