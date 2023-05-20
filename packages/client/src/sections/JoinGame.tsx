import { useState } from "react";

interface JoinGameProps {
  signMessage: (message: string) => Promise<string | undefined>;
}

export const JoinGame = ({ signMessage }: JoinGameProps) => {
  const [signedMsg, setSignedMsg] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSignMessage = async (message: string) => {
    const signedMessage = await signMessage(message);
    setSignedMsg(signedMessage || "");
  };

  return (
    <div className="section">
      <h1>Join Game Section</h1>
      <br />
      <span>message: </span>
      <br />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <br />
      <button onClick={async () => handleSignMessage(message)}>
        Sign Message
      </button>
      <br />
      <br />
      <span>signedMsg: </span>
      <br />
      <textarea value={signedMsg} disabled />
    </div>
  );
};
