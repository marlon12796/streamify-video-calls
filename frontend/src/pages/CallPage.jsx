import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { lazy, Suspense } from "react";
// Lazy load de los componentes de stream-chat-react
const StreamVideo = lazy(() =>
  import("@stream-io/video-react-sdk").then((mod) => ({
    default: mod.StreamVideo,
  }))
);
const CallContent = lazy(() =>
  import("../components/CallContent").then((mod) => ({
    default: mod.CallContent,
  }))
);
const StreamCall = lazy(() =>
  import("@stream-io/video-react-sdk").then((mod) => ({
    default: mod.StreamCall,
  }))
);
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return;
      const StreamVideoClient = (await import("@stream-io/video-react-sdk"))
        .StreamVideoClient;

      try {
        console.log("Initializing Stream video client...");

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);

        await callInstance.join({ create: true });

        console.log("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <Suspense fallback={<ChatLoader />}>
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          </Suspense>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>
              No se pudo inicializar la llamada. Actualice o intente nuevamente
              más tarde.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;
