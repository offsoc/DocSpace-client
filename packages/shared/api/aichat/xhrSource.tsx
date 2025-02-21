function sseEvent(message: string) {
  let type = "message";
  let start = 0;
  if (message.startsWith("event: ")) {
    start = message.indexOf("\n");
    type = message.slice(7, start);
  }
  start = message.indexOf(": ", start) + 2;
  const data = message.slice(start, message.length);

  return new MessageEvent(type, { data });
}

export function XhrSource(
  url: string,
  opts: {
    method?: string;
    headers: { [key: string]: string };
    body: string;
  },
) {
  const eventTarget = new EventTarget();
  const xhr = new XMLHttpRequest();

  xhr.open(opts.method || "GET", url, true);

  Object.keys(opts.headers).forEach((key) => {
    xhr.setRequestHeader(key, opts.headers[key]);
  });

  let ongoing = false;
  let start = 0;
  xhr.onprogress = function () {
    if (!ongoing) {
      // onloadstart is sync with `xhr.send`, listeners don't have a chance
      ongoing = true;
      eventTarget.dispatchEvent(
        new Event("open", {
          status: xhr.status,
          headers: xhr.getAllResponseHeaders(),
          url: xhr.responseUrl,
        }),
      );
    }

    let i;
    let chunk;
    while ((i = xhr.responseText.indexOf("\n\n", start)) >= 0) {
      chunk = xhr.responseText.slice(start, i);
      start = i + 2;
      if (chunk.length) {
        eventTarget.dispatchEvent(sseEvent(chunk));
      }
    }
  };

  xhr.onloadend = () => {
    eventTarget.dispatchEvent(new CloseEvent("close"));
  };

  xhr.timeout = opts.timeout;
  xhr.ontimeout = () => {
    eventTarget.dispatchEvent(
      new CloseEvent("error", { reason: "Network request timed out" }),
    );
  };
  xhr.onerror = () => {
    eventTarget.dispatchEvent(
      new CloseEvent("error", {
        reason: xhr.responseText || "Network request failed",
      }),
    );
  };
  xhr.onabort = () => {
    eventTarget.dispatchEvent(
      new CloseEvent("error", { reason: "Network request aborted" }),
    );
  };

  eventTarget.close = () => {
    // eventTarget.dispatchEvent(
    //   new CloseEvent("error", { reason: "Network request aborted" }),
    // );
    // console.log("xhr.responseText", xhr.responseText);
    xhr.abort();
  };

  xhr.send(opts.body);
  return eventTarget;
}
