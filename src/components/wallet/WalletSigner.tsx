import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

export const MessageSigner = () => {
  const { isConnected } = useAccount();
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState<string | null>(null);

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (data: `0x${string}`) => {
        setSignature(data);
      },
    },
  });

  const handleSign = async () => {
    if (!message.trim()) return;
    signMessage({ message });
  };

  return (
    <div className="mt-5 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Message Signer</h2>

      <textarea
        className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your message to sign..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!isConnected}
      />

      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSign}
        disabled={!isConnected || !message.trim()}
      >
        Sign Message
      </button>

      {signature && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg break-all">
          <h3 className="font-semibold mb-2">Signature:</h3>
          <p className="text-sm">{signature}</p>
        </div>
      )}

      {!isConnected && (
        <p className="text-red-500">
          Please connect your wallet to sign messages
        </p>
      )}
    </div>
  );
};