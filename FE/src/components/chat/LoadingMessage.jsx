import gnarAvatar from "../../assets/images/gnarAvatar.png";

function LoadingMessage() {
  return (
    <div className="flex justify-start mb-3">
      <div className="bg-white border p-3 shadow-sm rounded-[20px_20px_20px_5px]">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <img
            src={gnarAvatar}
            alt="Gnar"
            className="w-6 h-6 rounded-full mr-2"
          />
          Alpha AI
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <svg
            className="w-4 h-4 animate-spin text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Thinking...</span>
        </div>
      </div>
    </div>
  );
}

export default LoadingMessage;
