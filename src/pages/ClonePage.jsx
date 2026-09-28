import { useEffect } from "react";
import { ChatThread, Composer, useChat } from "../components/Chat";
import { pageTitle } from "../data/site";

const starters = [
  "What does PupSplash actually do?",
  "What tech does YAM use?",
  "How does Burnit count a walk?",
  "What does SwiftHire actually do?",
];

export function ClonePage() {
  const { messages, ask, reset, pending } = useChat();

  useEffect(() => {
    document.title = pageTitle("Clone");
    document.documentElement.classList.add("is-clone");
    return () => document.documentElement.classList.remove("is-clone");
  }, []);

  return (
    <div className="clone">
      <header className="clone__bar">
        <p>Digital clone</p>
        <button type="button" onClick={reset} disabled={!messages.length || pending}>
          Clear
        </button>
      </header>
      <div className="clone__stage">
        {messages.length === 0 ? (
          <div className="clone__empty">
            <h1>Ask about the work.</h1>
            <p>I answer as Arusha, from the projects, essays, and lab on this site. The conversation runs in your browser.</p>
            <div className="chips chips--large">
              {starters.map((starter) => (
                <button key={starter} type="button" onClick={() => ask(starter)}>
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <ChatThread large />
        )}
      </div>
      <Composer autoFocus />
    </div>
  );
}
