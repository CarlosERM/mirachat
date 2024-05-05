import { RefObject, useEffect, useRef } from "react";
import { MyUser } from "../utils/interface";

export default function Messages({
  user,
  scrollView,
}: {
  user: MyUser;
  scrollView: RefObject<HTMLUListElement>;
}) {
  return (
    <>
      {user.messages && user.messages.length > 0 ? (
        <ul
          className="h-full p-3 pb-0 flex flex-col gap-2 overflow-y-scroll "
          ref={scrollView}
        >
          {user.messages.map((message, index) => (
            <li
              key={index}
              className={`py-3  border border-c10 rounded-lg shadow shadow-c10 max-w-fit ${
                message.fromSelf
                  ? "self-end bg-c11 text-c4 pl-3 pr-8"
                  : "self-start pl-3 pr-8"
              }`}
            >
              {message.content}
            </li>
          ))}
          {/* <div ref={scrollView} className="h-0"></div> */}
        </ul>
      ) : (
        <ul className="h-full p-3 flex flex-col gap-2"></ul>
      )}
    </>
  );
}
