export type ItemKey = {
  pk: string,
  sk: string,
};

export abstract class Item {
  abstract get pk(): string
  abstract get sk(): string
  public keys(): ItemKey {
    return {
      pk: this.pk,
      sk: this.sk,
    };
  }
  abstract toItem(): Record<string, unknown>
}