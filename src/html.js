import React from "react";

export default function HTML(props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            <script type="text/javascript" src="//wcs.naver.net/wcslog.js"></script>
            <script type="text/javascript">
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "6819f77e71c10c";
            if(window.wcs) {
              wcs_do();
            }
            </script>
          `,
          }}
        />
      </body>
    </html>
  );
}
