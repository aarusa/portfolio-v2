import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { respond } from "../lib/cloneEngine";
import { playOpenSound, playReceiveSound, playSendSound, unlockChatSounds } from "../lib/chatSounds";

const ChatContext = createContext(null);
const STORAGE_KEY = "arusha-clone-thread";

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (!saved?.messages) return null;
    return saved;
  } catch {
    return null;
  }
}

export function ChatProvider({ children }) {
  const saved = useRef(load());
  const [messages, setMessages] = useState(saved.current?.messages || []);
  const [pending, setPending] = useState(false);
  const memoryRef = useRef(saved.current?.memory || { topic: null, id: null, facet: null });
  const busy = useRef(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, memory: memoryRef.current }));
  }, [messages]);

  useEffect(() => {
    const unlock = () => unlockChatSounds();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  function ask(text) {
    const trimmed = text.trim();
    if (!trimmed || busy.current) return;
    busy.current = true;
    setPending(true);
    playSendSound();
    const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setMessages((current) => [...current, { id: id(), role: "user", text: trimmed }]);
    const result = respond(trimmed, memoryRef.current);
    memoryRef.current = result.memory;
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: id(), role: "assistant", text: result.text, suggestions: result.suggestions, link: result.link },
      ]);
      playReceiveSound();
      setPending(false);
      busy.current = false;
    }, Math.min(900, 280 + result.text.length * 2));
  }

  function reset() {
    memoryRef.current = { topic: null, id: null, facet: null };
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(() => ({ messages, pending, ask, reset }), [messages, pending]);
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  return useContext(ChatContext);
}

export function ChatThread({ large = false }) {
  const { messages, pending, ask } = useChat();
  const endRef = useRef(null);
  const last = messages[messages.length - 1];

  useEffect(() => {
    const node = endRef.current;
    if (!node) return;
    const scroller = node.closest(".clone__stage") || node.closest(".dock__panel");
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight;
      return;
    }
    node.scrollIntoView({ block: "nearest" });
  }, [messages, pending]);

  return (
    <div className={`thread ${large ? "thread--large" : ""}`} aria-live="polite">
      {messages.map((message) => (
        <article key={message.id} className={`msg msg--${message.role}`}>
          {message.role === "assistant" ? <span className="msg__mark">A</span> : null}
          <div>
            {message.text.split("\n\n").map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {message.link ? <MessageLink link={message.link} /> : null}
          </div>
        </article>
      ))}
      {pending ? (
        <p className="msg msg--pending">
          <span className="msg__mark">A</span> Thinking with the work…
        </p>
      ) : null}
      {!pending && last?.role === "assistant" && last.suggestions?.length ? (
        <div className="chips">
          {last.suggestions.map((suggestion) => (
            <button key={suggestion} type="button" onClick={() => ask(suggestion)}>
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
      <div ref={endRef} />
    </div>
  );
}

function MessageLink({ link }) {
  if (link.href.startsWith("/")) {
    return (
      <Link className="msg__link" to={link.href}>
        {link.label}
      </Link>
    );
  }
  return (
    <a className="msg__link" href={link.href} target="_blank" rel="noreferrer">
      {link.label}
    </a>
  );
}

export function Composer({ autoFocus = false }) {
  const { ask, pending } = useChat();
  const [text, setText] = useState("");
  const ref = useRef(null);

  function send(event) {
    event.preventDefault();
    if (!text.trim() || pending) return;
    ask(text);
    setText("");
  }

  return (
    <form className="composer" onSubmit={send}>
      <label className="sr" htmlFor="clone-input">
        Message the clone
      </label>
      <textarea
        id="clone-input"
        ref={ref}
        rows="1"
        autoFocus={autoFocus}
        placeholder="Ask about the work"
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            event.currentTarget.form?.requestSubmit();
          }
        }}
      />
      <button className="btn" type="submit" disabled={pending || !text.trim()}>
        Send
      </button>
    </form>
  );
}

const starters = [
  "What does PupSplash actually do?",
  "What tech does YAM use?",
  "How does Burnit count a walk?",
];

export function ChatDock() {
  const { pathname } = useLocation();
  const { messages, ask } = useChat();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname === "/clone") return null;

  return (
    <div className={`dock ${open ? "is-open" : ""}`}>
      {open ? (
        <section className="dock__panel" aria-label="Digital clone">
          <header>
            <p>Clone</p>
            <button type="button" onClick={() => setOpen(false)}>
              Close
            </button>
          </header>
          {messages.length === 0 ? (
            <div className="dock__empty">
              <p>Ask about a project.</p>
              <div className="chips">
                {starters.map((starter) => (
                  <button key={starter} type="button" onClick={() => ask(starter)}>
                    {starter}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ChatThread />
          )}
          <Composer autoFocus />
        </section>
      ) : null}
      <button
        className="dock__toggle"
        type="button"
        aria-expanded={open}
        onClick={() =>
          setOpen((value) => {
            if (!value) playOpenSound();
            return !value;
          })
        }
      >
        {open ? "Close" : "Ask"}
      </button>
    </div>
  );
}
