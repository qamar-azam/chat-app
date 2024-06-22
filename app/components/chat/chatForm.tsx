import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Message } from '@pubnub/chat';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

type ChatFormProps = {
  text: string;
  editText: string;
  editMessage: Message;
  handleSaveEdit: () => void;
  setText: (text: Message) => void;
  setEditText: (text: string) => void;
  handleSend: (e: React.SyntheticEvent) => void;
};

export default function ChatForm({
  text,
  editText,
  editMessage,
  handleSaveEdit,
  setText,
  setEditText,
  handleSend
}: ChatFormProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiObject: { emoji: string }) => {
    setText((prevMessage: Message) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  return (
    <form
      className='mt-8 flex items-center border-t pt-4'
      onSubmit={handleSend}
    >
      <button
        type='button'
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className='text-2xl mr-2'
      >
        {'😀'}
      </button>

      <textarea
        value={editMessage ? editText : text}
        onChange={(e) =>
          editMessage ? setEditText(e.target.value) : setText(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key == 'Enter' && e.shiftKey == false) {
            handleSend(e);
          }
        }}
        placeholder='Send message'
        className='h-10 outline-0 p-3 mr-2 w-full rounded text-sm text-black'
      />
      <input
        type='submit'
        value='➔'
        onClick={editMessage ? handleSaveEdit : handleSend}
        className='bg-gray-500 rounded-full w-[35px] h-[30px] cursor-pointer'
      />

      {showEmojiPicker && (
        <div className='absolute'>
          <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled={true} />
        </div>
      )}
    </form>
  );
}
