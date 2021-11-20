import { Color } from "@material-ui/lab/Alert";

export class AlertModel {
  message: string;
  severity: Color;

  constructor(message: string, severity: Color) {
    this.message = message;
    this.severity = severity;
  }
}