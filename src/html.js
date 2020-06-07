import React from "react";

export default function HTML({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) {
  return (
    <html lang='ko-KR' {...htmlAttributes}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0'
        />
        <meta
          name='naver-site-verification'
          content='38089d39cdd5fe303b16c74bc4b5cf3bfb66277d'
        />
        {headComponents}
      </head>
      <body {...bodyAttributes}>
        {preBodyComponents}
        <noscript key='noscript' id='gatsby-noscript'>
          This app works best with JavaScript enabled.
        </noscript>
        <div
          key='body'
          id='___gatsby'
          dangerouslySetInnerHTML={{ __html: body }}
        />
        {postBodyComponents}
        <script type='text/javascript' src='//wcs.naver.net/wcslog.js' />
        <script
          type='text/javascript'
          dangerouslySetInnerHTML={{
            __html: `if(!wcs_add) var wcs_add = {};wcs_add["wa"] = "6819f77e71c10c";if(window.wcs) {wcs_do();}`,
          }}
        />
      </body>
    </html>
  );
}
