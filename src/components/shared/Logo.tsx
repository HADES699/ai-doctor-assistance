
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8 text-primary"
      >
        <path 
          d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M10 10H10.01M14 10H14.01M6 20V21H18V20C18 17.7909 16.2091 16 14 16H10C7.79086 16 6 17.7909 6 20ZM4 8.5C4 5.46243 6.46243 3 9.5 3C10.1232 3 10.7177 3.11055 11.2636 3.31483C12.1927 2.5063 13.5047 2 14.9451 2C17.7868 2 20 4.32108 20 7.12103C20 9.59915 18.236 11.7093 15.9131 12C15.9709 11.843 16 11.6753 16 11.5C16 10.6716 15.3284 10 14.5 10C13.6716 10 13 10.6716 13 11.5C13 11.6753 13.0291 11.843 13.0869 12H10.9131C10.9709 11.843 11 11.6753 11 11.5C11 10.6716 10.3284 10 9.5 10C8.67157 10 8 10.6716 8 11.5C8 11.6753 8.02908 11.843 8.08689 12C5.76402 11.7093 4 9.59915 4 7.12103C4 7.12103 4 8.5 4 8.5Z" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold text-gray-900">
        <span className="text-primary">AI</span> Doctor Assistant
      </span>
    </Link>
  );
};

export default Logo;
