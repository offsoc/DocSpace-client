// (c) Copyright Ascensio System SIA 2009-2025
//
// This program is a free software product.
// You can redistribute it and/or modify it under the terms
// of the GNU Affero General Public License (AGPL) version 3 as published by the Free Software
// Foundation. In accordance with Section 7(a) of the GNU AGPL its Section 15 shall be amended
// to the effect that Ascensio System SIA expressly excludes the warranty of non-infringement of
// any third-party rights.
//
// This program is distributed WITHOUT ANY WARRANTY, without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For details, see
// the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
//
// You can contact Ascensio System SIA at Lubanas st. 125a-25, Riga, Latvia, EU, LV-1021.
//
// The  interactive user interfaces in modified source and object code versions of the Program must
// display Appropriate Legal Notices, as required under Section 5 of the GNU AGPL version 3.
//
// Pursuant to Section 7(b) of the License you must retain the original Product logo when
// distributing the program. Pursuant to Section 7(e) we decline to grant you any rights under
// trademark law for use of our trademarks.
//
// All the Product's GUI elements, including illustrations and icon sets, as well as technical writing
// content are licensed under the terms of the Creative Commons Attribution-ShareAlike 4.0
// International. See the License terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode

import { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { DeviceType } from "../../../../enums";
import { Portal } from "../../../portal";
import styles from "./AIChat.module.scss";
import AIChatHeader from "./AIChatHeader";
import AIChatBody from "./AIChatBody";
import AIChatFooter from "./AIChatFooter";
import { Scrollbar } from "../../../scrollbar";
import { Scrollbar as CustomScrollbar } from "../../../scrollbar/custom-scrollbar";

import {
  // vectorizeFiles,
  // getVectorizeProgress,
  sendMessage,
} from "../../../../api/aichat";
import { AIChatPanelProps, MessageType } from "./AIChat.types";

const AIChat = ({
  isVisible,
  isMobileHidden,
  setIsVisible,
  canDisplay,
  anotherDialogOpen,
  viewAs,
  currentDeviceType,
  sectionIsVisible,
  setSectionIsVisible,
  AIChatIsData,
  AIChatUser,
}: AIChatPanelProps) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const scrollRef = useRef<null | CustomScrollbar>(null);

  const sendMessageFn = async (message: string) => {
    if (message.trim() === "") return;

    const { folderId, filesId } = AIChatIsData;
    setMessages((prev) => [...prev, { message, isSend: true }]);

    const xs = await sendMessage({
      message,
      folder_id: folderId,
      files_id: filesId,
    });

    xs.addEventListener("error", (e: Event & { reason?: string }) => {
      setMessages((prev) => [
        ...prev,
        { message: `Error: ${e.reason}`, isSend: false },
      ]);
    });

    xs.addEventListener("close", () => {
      console.log("close", "\nDONE");

      if (scrollRef.current) scrollRef.current.scrollToBottom();

      // setMessages((prev) => [...prev, { message: "close", isSend: false }]);
    });

    xs.addEventListener("message", (e: Event & { data?: string }) => {
      setMessages((prev) => {
        if (prev[prev.length - 1]?.isSend) {
          return [...prev, { message: e.data, isSend: false }];
        }

        prev[prev.length - 1].message += e.data;
        return [...prev];
      });
    });
  };

  useEffect(() => {
    if (!AIChatIsData) return;
    const { folderId, filesId } = AIChatIsData;
    console.log(`folderId: ${folderId}, filesId: ${filesId}`);

    // vectorizeFiles(AIChatIsData.folderId, AIChatIsData.filesId).then((res) =>
    //   getVectorizeProgress(res.files[0].id),
    // );
  }, [AIChatIsData]);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.id === "AIChatPanelWrapper") setIsVisible?.(false);
    };

    if (viewAs === "row" || currentDeviceType !== DeviceType.desktop)
      document.addEventListener("mousedown", onMouseDown);

    window.onpopstate = () => {
      if (currentDeviceType !== DeviceType.desktop && isVisible)
        setIsVisible?.(false);
    };

    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [currentDeviceType, isVisible, setIsVisible, viewAs]);

  const chatComponent = (
    <div
      className={classNames("AI-chat-panel", styles.AIChatWrapper, {
        [styles.sectionIsVisible]: sectionIsVisible,
      })}
      id="AIChatPanelWrapper"
    >
      <div
        className={classNames(styles.AIChat, {
          [styles.sectionIsVisible]: sectionIsVisible,
        })}
      >
        <AIChatHeader
          setIsVisible={setIsVisible}
          sectionIsVisible={sectionIsVisible}
          setSectionIsVisible={setSectionIsVisible}
        />
        <Scrollbar
          ref={scrollRef}
          scrollClass="section-scroll ai-chat_panel-scroll"
          createContext
          className={styles.scrollbar}
        >
          <AIChatBody
            sectionIsVisible={sectionIsVisible}
            messages={messages}
            AIChatUser={AIChatUser}
          />
        </Scrollbar>

        <AIChatFooter
          sectionIsVisible={sectionIsVisible}
          sendMessageFn={sendMessageFn}
        />
      </div>
    </div>
  );

  const renderPortal = () => {
    const rootElement = document.getElementById("root");

    return (
      <Portal
        element={chatComponent}
        appendTo={rootElement || undefined}
        visible={isVisible && !isMobileHidden ? !anotherDialogOpen : false}
      />
    );
  };

  const isMobileView =
    currentDeviceType === DeviceType.mobile ||
    currentDeviceType === DeviceType.tablet;

  return !isVisible ||
    !canDisplay ||
    (anotherDialogOpen && currentDeviceType !== DeviceType.desktop) ||
    (currentDeviceType !== DeviceType.desktop && isMobileHidden)
    ? null
    : isMobileView
      ? renderPortal()
      : chatComponent;
};

export default AIChat;
