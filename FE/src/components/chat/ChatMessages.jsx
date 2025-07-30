import { motion } from "framer-motion";
import { User } from "lucide-react";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github.css";
import AI from "../../assets/images/AI.png";

function ChatMessages({ messages, onQuickMessage }) {
  const quickItems = [
    { icon: "💡", text: "Giải thích về trí tuệ nhân tạo" },
    { icon: "👨‍💻", text: "Giúp tôi học lập trình" },
    { icon: "🎨", text: "Tạo ý tưởng sáng tạo" },
    { icon: "🔍", text: "Tìm hiểu về công nghệ" },
  ];

  const WelcomeMessage = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center py-10"
    >
      <div className="mb-6">
        <div className="inline-flex items-center justify-center rounded-full shadow bg-gradient-to-br w-16 h-16 p-1">
          <img
            src={AI}
            alt="AI logo"
            className="rounded-full w-full h-full object-cover transition-transform"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-200 mb-3">
        Chào mừng đến với Alpha AI!
      </h2>
      <p className="text-slate-300 mb-6 px-4">
        Tôi là trợ lý AI thông minh, sẵn sàng giúp bạn giải đáp mọi thắc mắc.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
        {quickItems.map((item, i) => (
          <div
            key={i}
            className="bg-gray-300 backdrop-blur p-4 text-center rounded shadow hover:shadow-md transition cursor-pointer"
            onClick={() => onQuickMessage?.(item.text)}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <p className="text-sm text-gray-600">{item.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  if (messages.length === 0) return <WelcomeMessage />;

  return (
    <div className="p-4 space-y-4">
      {messages.map((message, index) => {
        const isUser = message.role === "user";

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start ${
                isUser ? "flex-row-reverse" : ""
              } max-w-[75%]`}
            >
              {/* Avatar */}
              <div
                className={`rounded-full flex items-center justify-center w-11 h-11 p-1 ${
                  isUser ? "ml-3" : "mr-3"
                }`}
              >
                {isUser ? (
                  <div className="bg-gradient-to-br bg-neutral-600 w-full h-full flex items-center justify-center rounded-full shadow">
                    <User size={20} color="white" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-gradient-to-br flex items-center justify-center rounded-full shadow">
                    <img
                      src={AI}
                      alt="AI"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-2 rounded-2xl shadow-sm text-sm whitespace-pre-wrap break-words ${
                  isUser
                    ? "bg-neutral-600 text-gray-100  rounded-br-sm"
                    : "bg-gray-100 text-gray-800 rounded-bl-sm border"
                }`}
              >
                <ReactMarkdown
                  children={
                    message.role === "bot" && message.content === ""
                      ? "Đang suy nghĩ ..."
                      : message.content
                  }
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    pre: ({ ...props }) => (
                      <pre
                        className="bg-gray-100 text-black text-sm rounded p-2 overflow-x-auto mt-2 mb-2"
                        {...props}
                      />
                    ),
                    code: ({ inline, className, children, ...props }) => (
                      <code
                        className={`${
                          inline ? "bg-gray-200 px-1 py-0.5 rounded" : "block"
                        } ${className || ""}`}
                        {...props}
                      >
                        {children}
                      </code>
                    ),
                  }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default ChatMessages;
