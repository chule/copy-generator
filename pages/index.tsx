import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (input.length > 30) {
      setError(true);
    } else {
      setError(false);
    }
  }, [input]);

  const submit = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/marketing-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });
      const suggestion = await res.json();
      setSuggestion(suggestion.result);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Marketing Copy Project</title>
        <meta name="description" content="Marketing Copy Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7x1 mx-auto py-12 px-5">
        <h2 className="text-2x1 font-bold text-center pb-2">
          Marketing Copy Generator
        </h2>
        <div className="flex flex-col gap-4 justify-center  mx-auto min-w-fit sm:w-full md:w-1/2 lg:w-1/3 ">
          <div className="relative">
            {error && (
              <p className="text-red-500 p-1 text-xs">
                Character limit exceeded
              </p>
            )}
            <textarea
              rows={3}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Enter your text here"
              className="w-full border-2 border-gray-300 bg-white p-4 rounded-lg text-sm focus:outline-none resize-none"
            />
            <div
              className={`absolute ${
                input.length > 30 ? "text-red-500" : "text-gray-400"
              } bottom-2 right-2 text-xs`}
            >
              <span>{input.length}</span>/30
            </div>
          </div>
          <button
            disabled={error}
            type="button"
            className={`${
              error ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded`}
            onClick={() => submit()}
          >
            {loading ? "Loading..." : error ? "Disabled" : "Generate"}
          </button>
          {suggestion && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold pb-2 ">
                Your marketing copy:
              </h4>
              <div className="relative w-full rounded-md bg-gray-100 p-4">
                <p className="text-sm text-gray-700">{suggestion}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
