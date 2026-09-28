import { useDeferredValue, useEffect, useId, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { posts, searchPosts } from "../data/posts";
import { pageTitle } from "../data/site";

export function Writing() {
  const inputId = useId();
  const statusId = useId();
  const inputRef = useRef(null);
  const [params, setParams] = useSearchParams();
  const query = params.get("q") ?? "";
  const deferredQuery = useDeferredValue(query);
  const results = searchPosts(deferredQuery);
  const searching = deferredQuery.trim().length > 0;
  const pending = query !== deferredQuery;

  useEffect(() => {
    document.title = pageTitle("Blog");
  }, []);

  function setQuery(next) {
    const value = next.trimStart();
    if (!value) {
      setParams({}, { replace: true });
      return;
    }
    setParams({ q: value }, { replace: true });
  }

  function onKeyDown(event) {
    if (event.key === "Escape" && query) {
      event.preventDefault();
      setQuery("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="write-index">
      <div className="write-index__top">
        <header>
          <p className="kicker">Blog</p>
          <h1>Blog</h1>
          <p className="lede">Deploys, model clients, and the rules that stay in code.</p>
        </header>

        <form
          className="write-search"
          role="search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr" htmlFor={inputId}>
            Search the blog
          </label>
          <div className="write-search__field">
            <input
              ref={inputRef}
              id={inputId}
              type="search"
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search titles, topics, tools…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-controls="blog-results"
              aria-describedby={statusId}
            />
            {query ? (
              <button type="button" className="write-search__clear" onClick={() => setQuery("")}>
                Clear
              </button>
            ) : null}
          </div>
          <p id={statusId} className="write-search__status" aria-live="polite">
            {searching
              ? pending
                ? "Searching…"
                : `${results.length} of ${posts.length} ${results.length === 1 ? "essay" : "essays"}`
              : `${posts.length} essays`}
          </p>
        </form>
      </div>

      {results.length ? (
        <ul id="blog-results" className="write-index__list">
          {results.map((post) => (
            <li key={post.slug}>
              <Link className="write-index__item" to={`/blog/${post.slug}`}>
                <p className="write-index__meta">
                  <time dateTime={post.date}>{post.displayDate}</time>
                  <span aria-hidden="true">·</span>
                  <span>{post.minutes} min</span>
                </p>
                <div className="write-index__copy">
                  <strong>{post.title}</strong>
                  <em>{post.dek}</em>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div id="blog-results" className="write-index__empty" role="status">
          <p>No essays match “{deferredQuery.trim()}”.</p>
          <button type="button" className="textlink" onClick={() => setQuery("")}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
