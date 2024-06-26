'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Channel, Chat, Message, User } from '@pubnub/chat';
import { useSearchParams } from 'next/navigation';
import ChatForm from './chatForm';
import ChatMessages from './chatMessages';
import userData from './chatUsers';
import ChatHeader from './chatHeader';

export default function ChatDialog() {
  const searchParams = useSearchParams();
  const [chat, setChat] = useState<Chat>();
  const [text, setText] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [channel, setChannel] = useState<Channel>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [editMessage, setEditMessage] = useState<Message>(null);
  const [editText, setEditText] = useState<string>('');
  const messageListRef = useRef<HTMLElement>(null);

  async function handleSend(event: React.SyntheticEvent) {
    event.preventDefault();
    if (!text || !channel) return;
    await channel.sendText(text);
    setText('');
  }

  useEffect(() => {
    if (!messages.length) return;
    return Message.streamUpdatesOn(messages, setMessages);
  }, [messages]);

  useEffect(() => {
    if (!messageListRef.current) return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!channel) return;
    return channel.connect((message: string) =>
      setMessages((messages) => [...messages, message])
    );
  }, [channel]);

  useEffect(() => {
    async function initalizeChat() {
      const id = Number(searchParams.get('id')) || 0;

      const firstUser = userData[id];
      const secondUser = id === 0 ? userData[1] : userData[0];

      const chat = await Chat.init({
        publishKey: process.env.NEXT_PUBLIC_PUBNUB_PUBLISH_KEY,
        subscribeKey: process.env.NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY,
        userId: firstUser.id
      });
      const currentUser = await chat.currentUser.update(firstUser.data);
      const interlocutor =
        (await chat.getUser(secondUser.id)) ||
        (await chat.createUser(secondUser.id, secondUser.data));
      const { channel } = await chat.createDirectConversation({
        user: interlocutor,
        channelData: { name: 'Support Channel' }
      });

      setChat(chat);
      setUsers([currentUser, interlocutor]);
      setChannel(channel);
    }

    initalizeChat();
  }, []);

  const handleEditMessage = (message: Message) => {
    setEditMessage(message);
    setEditText(message.text);
  };

  const handleAddReaction = async (message: Message, reaction: string) => {
    await message.toggleReaction(reaction);
  };

  const handleSaveEdit = async () => {
    await editMessage.editText(editText);
    setEditMessage(null);
    setEditText('');
  };

  if (!chat || !channel)
    return <p className='text-white text-2xl'>Loading...</p>;

  return (
    <div className='flex flex-col border rounded p-4 w-full md:w-1/2 lg:w-1/3 text-white chat-height md:h-auto'>
      <ChatHeader
        channelName={channel.name}
        currentUserName={chat.currentUser.name}
      />
      <section className='grow sm:h-[250px] overflow-auto' ref={messageListRef}>
        <ChatMessages
          messages={messages}
          users={users}
          currentUser={chat.currentUser}
          handleEditMessage={handleEditMessage}
          handleAddReaction={handleAddReaction}
        />
      </section>

      <footer className='mt-0'>
        <ChatForm
          text={text}
          editMessage={editMessage}
          editText={editText}
          setText={setText}
          setEditText={setEditText}
          handleSend={handleSend}
          handleSaveEdit={handleSaveEdit}
        />
      </footer>
    </div>
  );
}
