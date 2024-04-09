import { NotificationType } from "./contant";

export interface IDataNotification {
  type?: NotificationType;
  content: string;
  ownerId: string
}
