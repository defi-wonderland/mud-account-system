import { useState } from "react";

interface CreateGameProps {
  signMessage: (message: string) => Promise<string | undefined>;
}

export const CreateGame = ({ signMessage }: CreateGameProps) => {
  const [signedMsg, setSignedMsg] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSignMessage = async (message: string) => {
    const signedMessage = await signMessage(message);
    setSignedMsg(signedMessage || "");
  };

  return (
    <div className="section">
      <h1>Create Game Section</h1>
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
