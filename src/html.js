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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-106556857-1"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-106556857-1');
  `,
          }}
        />
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key={`body`}
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
        <script type="text/javascript" src="//wcs.naver.net/wcslog.js" />
        <script
          dangerouslySetInnerHTML={{
            __html: `            
            if(!wcs_add) var wcs_add = {};
            wcs_add["wa"] = "6819f77e71c10c";
            if(window.wcs) {
              wcs_do();
            }
          `,
          }}
        />
      </body>
    </html>
  );
}
