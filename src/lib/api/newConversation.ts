export const createNewConversation = async (userId: string) => {
  const response = await fetch("/api/create-new-conversation", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
  });

  const conversation = await response.json();
  console.log(conversation);
  return conversation;
};