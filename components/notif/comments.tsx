import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { apiClient } from "@/lib/api";
import NotiCommentCard from "./commentCard";
import useUi from "@/lib/hooks/useUi";
import { View } from "react-native";

const Comments = ({ analysisId }: { analysisId: string }) => {
  const [comments, setComments] = useState<any>([]);
  const { getToken } = useAuth();
  const client = apiClient();
  const { refreash, mainServerAvailable } = useUi();

  const fetchData = async () => {
    try {
      const token = await getToken();
      const { data } = await client.get(
        `/noti/get/comments/${analysisId}`,
        token,
        {},
        mainServerAvailable
      );

      setComments(data.comments);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreash]);

  return (
    <View style={{ gap: 16 }}>
      {comments.map((comment: any) => {
        return <NotiCommentCard comment={comment} />;
      })}
    </View>
  );
};

export default Comments;
