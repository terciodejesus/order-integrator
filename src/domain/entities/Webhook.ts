import { randomUUID } from 'node:crypto';

interface WebhookProps {
  type: string;
  data: Record<string, string>;
}

export class Webhook {
  private _id: string;
  private _timestamp: string;

  private readonly props: WebhookProps;

  constructor(props: WebhookProps) {
    this._id = randomUUID();
    this._timestamp = new Date().toISOString();
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  get timestamp(): string {
    return this._timestamp;
  }

  get type(): string {
    return this.props.type;
  }

  get data(): Record<string, string> {
    return this.props.data;
  }

  toJSON() {
    return {
      id: this.id,
      type: this.type,
      timestamp: this.timestamp,
      data: this.data,
    };
  }
}
