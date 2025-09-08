import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import { useThemeStore } from "../store/useThemeStore";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Lazy load de los componentes de stream-chat-react
const Chat = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.Chat }))
);
const Channel = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.Channel }))
);
const ChannelHeader = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.ChannelHeader }))
);
const MessageInput = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.MessageInput }))
);
const MessageList = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.MessageList }))
);
const Thread = lazy(() =>
  import("stream-chat-react").then((mod) => ({ default: mod.Thread }))
);

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const { theme } = useThemeStore();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;
      const { StreamChat } = await import("stream-chat");

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;
  const themesDark = ["dark", "forest"];

  return (
    <div className="h-[93vh]">
      <Suspense fallback={<ChatLoader />}>
        <Chat
          client={chatClient}
          theme={
            themesDark.includes(theme)
              ? "str-chat__theme-dark"
              : "str-chat__theme-light"
          }
        >
          <Channel channel={channel}>
            <div className="w-full relative flex flex-col">
              <CallButton handleVideoCall={handleVideoCall} />
              <ChannelHeader />
              <MessageList />
              <MessageInput focus />
            </div>
            <Thread />
          </Channel>
        </Chat>
      </Suspense>
    </div>
  );
};

export default ChatPage;
