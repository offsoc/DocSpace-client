import { DeviceType } from "../../../../enums";
import { TViewAs } from "../../../../types";
import { TUser } from "../../../../api/people/types";

export type MessageType = {
  message: string;
  isSend?: boolean;
  error?: boolean;
};

export type AIChatIsDataType = {
  folderId: number;
  filesId?: number[];
};

export type AIChatPanelProps = {
  isVisible?: boolean;
  isMobileHidden?: boolean;
  setIsVisible: (value: boolean) => void;
  canDisplay?: boolean;
  anotherDialogOpen?: boolean;
  viewAs?: TViewAs;
  currentDeviceType?: DeviceType;
  sectionIsVisible: boolean;
  setSectionIsVisible: (value: boolean) => void;
  AIChatIsData: AIChatIsDataType;
  AIChatUser: TUser;
};

export type AIChatHeaderProps = {
  setIsVisible: AIChatPanelProps["setIsVisible"];
  sectionIsVisible: AIChatPanelProps["sectionIsVisible"];
  setSectionIsVisible: AIChatPanelProps["setSectionIsVisible"];
};

export type AIChatBodyProps = {
  messages: MessageType[];
  sectionIsVisible: AIChatPanelProps["sectionIsVisible"];
  AIChatUser: AIChatPanelProps["AIChatUser"];
};

export type AIChatMessageProps = {
  message: MessageType;
  AIChatUser: AIChatPanelProps["AIChatUser"];
};
