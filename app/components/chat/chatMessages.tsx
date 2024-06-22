import { useCallback } from 'react';
import {
  MixedTextTypedElement,
  TimetokenUtils,
  User,
  Message
} from '@pubnub/chat';
import MessageReactions from './chatMessageReaction';

type ChatMessagesProps = {
  messages: Message[];
  users: User[];
  currentUser: {
    name: string;
  };
  handleEditMessage: (message: Message) => void;
  handleAddReaction: (message: Message, reaction: string) => void;
};

const reactionTypes = ['👍', '❤️', '😂'];

export default function ChatMessages({
  messages,
  users,
  currentUser,
  handleEditMessage,
  handleAddReaction
}: ChatMessagesProps) {
  const formatMessage = (msg: string) => {
    return msg.split('\n').map((str, index) => (
      <div>
        <span
          key={index}
          className='bg-gray-600 p-2 text-sm rounded-full inline-block mb-1'
        >
          {str}
          <br />
        </span>
      </div>
    ));
  };

  const renderMessagePart = useCallback(
    (messagePart: MixedTextTypedElement) => {
      if (messagePart.type === 'text') {
        return formatMessage(messagePart.content.text);
      }
      if (messagePart.type === 'plainLink') {
        return (
          <a href={messagePart.content.link}>{messagePart.content.link}</a>
        );
      }
      if (messagePart.type === 'textLink') {
        return (
          <a href={messagePart.content.link}>{messagePart.content.text}</a>
        );
      }
      if (messagePart.type === 'mention') {
        return (
          <a href={`https://pubnub.com/${messagePart.content.id}`}>
            {messagePart.content.name}
          </a>
        );
      }

      return '';
    },
    []
  );

  return (
    <ol>
      {messages.map((message) => {
        const user = users.find((user) => user.id === message.userId);

        return (
          <li
            key={message.timetoken}
            className={`mb-3 ${currentUser.name === user.name && 'text-right'}`}
          >
            <article>
              <h3 className='text-xs mb-2'>
                {user?.name}{' '}
                <time>
                  {TimetokenUtils.timetokenToDate(
                    message.timetoken
                  ).toLocaleTimeString([], {
                    timeStyle: 'short'
                  })}
                </time>
              </h3>

              {message
                .getLinkedText()
                .map((messagePart: MixedTextTypedElement, i: number) => (
                  <div key={message.timetoken} className='relative group'>
                    {renderMessagePart(messagePart)}

                    <MessageReactions
                      message={message}
                      right={currentUser.name === user.name}
                    />

                    <div
                      className={`absolute invisible group-hover:visible rounded-full bg-slate-400 px-3  ${
                        currentUser.name === user.name ? 'right-0' : 'left-0'
                      }`}
                    >
                      {reactionTypes.map((reaction, index) => (
                        <button
                          className='mr-2'
                          key={index}
                          onClick={() => handleAddReaction(message, reaction)}
                        >
                          {reaction}
                        </button>
                      ))}

                      <button
                        onClick={() => handleEditMessage(message)}
                        className='text-[10px] -mt-2'
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
