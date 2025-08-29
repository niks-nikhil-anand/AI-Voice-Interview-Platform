import Image from "next/image";
import React from "react";

const Agent = ({userName}:AgentProps) => {
  const isSpeaking = false;
  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src={"/ai-avatar.png"}
              alt="avatar"
              height={65}
              width={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src={"/user-avatar.png"}
             height={110}
              width={110}
              alt="user avatar"
              className="rounded-full object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default Agent;
