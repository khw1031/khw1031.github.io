import React from 'react'

export default function HTML({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) {
  return (
    <html lang='ko' {...htmlAttributes}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no, maximum-scale=1, user-scalable=0'
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var vglnk = {key: 'ee216a5565c6278385bf52d9b5f1ceef'};
              (function(d, t) {
                var s = d.createElement(t);
                  s.type = 'text/javascript';
                  s.async = true;
                  s.src = '//cdn.viglink.com/api/vglnk.js';
                var r = d.getElementsByTagName(t)[0];
                    r.parentNode.insertBefore(s, r);
              }(document, 'script'));
            `,
          }}
        />
      </body>
    </html>
  )
}
