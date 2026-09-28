import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { getPost, nextPost } from "../data/posts";
import { pageTitle } from "../data/site";

export function PostPage() {
  const { slug } = useParams();
  const post = getPost(slug);
  const next = post ? nextPost(post.slug) : null;

  useEffect(() => {
    document.title = post ? pageTitle(post.title) : pageTitle("Blog");
  }, [post]);

  if (!post) {
    return (
      <div className="missing">
        <h1>That essay is not here.</h1>
        <Link to="/blog">Back to the blog</Link>
      </div>
    );
  }

  return (
    <article className="article">
      <p className="kicker">
        <Link to="/blog">Blog</Link>
      </p>
      <h1>{post.title}</h1>
      <p className="lede">{post.dek}</p>
      <p className="article__meta">
        {post.displayDate}
        <span aria-hidden="true"> · </span>
        {post.minutes} min
      </p>
      <div className="prose prose--read">
        {post.sections.map((section) => (
          <section key={section.heading || section.paragraphs?.[0] || section.codes?.[0]?.label}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.codes?.map((block) => (
              <CodeBlock key={`${block.label}-${block.code.slice(0, 24)}`} code={block.code} label={block.label} />
            ))}
            {section.links?.length ? (
              <ul className="article__links">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
      {next ? (
        <Link className="nextproj nextproj--essay" to={`/blog/${next.slug}`}>
          <span>Next</span>
          <strong>{next.title}</strong>
        </Link>
      ) : null}
    </article>
  );
}
