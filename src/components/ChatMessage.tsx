
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ChatMessageProps = {
  content: string;
  role: "user" | "assistant";
  timestamp: string;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ content, role, timestamp }) => {
  return (
    <div
      className={`flex ${
        role === "user" ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          role === "user"
            ? "bg-primary text-white"
            : "bg-gray-100 text-gray-800"
        }`}
      >
        {role === "assistant" && (
          <div className="flex items-center mb-2">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src="/placeholder.svg" alt="AI" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <span className="font-medium">AI Assistant</span>
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">{content}</div>
        <div
          className={`text-xs mt-1 ${
            role === "user" ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {timestamp}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
