export function CodeBlock({ code, label }) {
  return (
    <figure className="codeblock">
      {label ? <figcaption>{label}</figcaption> : null}
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}
