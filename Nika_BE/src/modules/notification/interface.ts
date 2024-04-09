import { NotificationType } from "./contant";

export interface IDataNotification {
  type?: NotificationType;
  content: string;
  owner: string
}
