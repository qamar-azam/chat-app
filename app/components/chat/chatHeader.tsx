type ChatHeaderProps = {
  channelName: string;
  currentUserName: string;
};

export default function ChatHeader({
  channelName,
  currentUserName
}: ChatHeaderProps) {
  return (
    <header className='border-b mb-6 pb-2'>
      <h3>{channelName}</h3>
      <h3>{currentUserName}</h3>
    </header>
  );
}
