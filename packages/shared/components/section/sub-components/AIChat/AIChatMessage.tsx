import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeMathjax from "rehype-mathjax";

import AIChatImage from "PUBLIC_DIR/images/ai.bot32.react.svg";

import { Text } from "../../../text";
import { Avatar, AvatarRole, AvatarSize } from "../../../avatar";
import { AIChatMessageProps } from "./AIChat.types";
import styles from "./AIChat.module.scss";

const AIChatMessage = ({ message, AIChatUser }: AIChatMessageProps) => {
  return (
    <div className={styles.AIChatMessageContainer}>
      {message.isSend ? (
        <>
          <div className={styles.AIChatMessageUser}>
            <Avatar
              className="avatar"
              size={AvatarSize.min}
              role={AvatarRole.none}
              source={AIChatUser.avatar}
            />
            <Text fontSize="14px" fontWeight={600}>
              {AIChatUser.displayName}
            </Text>
          </div>

          <Text
            fontSize="13px"
            fontWeight={400}
            className={styles.AIChatMessageMessage}
          >
            {message.message}
          </Text>
        </>
      ) : (
        <>
          <div className={styles.AIChatMessageUser}>
            <AIChatImage />
            <Text fontSize="14px" fontWeight={600}>
              ChatGPT
            </Text>
          </div>

          <Text
            as="div"
            fontSize="13px"
            fontWeight={400}
            className={styles.AIChatMessageMessage}
          >
            <Markdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeMathjax]}
            >
              {message.message}
            </Markdown>
          </Text>
        </>
      )}
    </div>
  );
};

export default AIChatMessage;
