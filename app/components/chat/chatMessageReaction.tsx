import { Message } from '@pubnub/chat';

type MessageReactionsProps = {
  message: Message;
  right: boolean;
};

export default function MessageReactions({
  message,
  right
}: MessageReactionsProps) {
  return (
    <span className={`absolute bottom-[-5px] ${!right ? 'left-0' : 'right-0'}`}>
      {Object.keys(message.reactions).map((key) =>
        message.reactions[key].length !== 0 ? key : ''
      )}
    </span>
  );
}
