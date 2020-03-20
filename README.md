# Magnolia-React-Templating

This small utility allows you to use React JSX components directly in Magnolia templates (e.g. Freemarker).

## How does it work

To get started, you should set up a frontend project with `npx create-react-app`.

The main entry point for your application is `src/index.js`. Please remove the default content and replace it with the content below. This file registers all React components which you want to use within Magnolia templates.

```javascript
import { render } from "magnolia-react-templating";

import "./index.css";

import Layout from "./components/Layout";
import Headline from "./components/Headline";
import Text from "./components/Text";
import Image from "./components/Image";

render({ Layout, Headline, Text, Image }, document.getElementById("root"));
```

Now adapt your page template in Magnolia (e.g. `backend/light-modules/react-demo/templates/pages/ContentPage.ftl`), so the React bundle is loaded into your page. Here's an example:

```html
<!DOCTYPE html>
<html>
  <head>
    [@cms.page /]
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${content.windowTitle!content.title!}</title>
  </head>
  <body>
    [#-- Create a root container for React. --]
    <div id="root">
      [#-- Put JSX into a script-tag below the root --]
      <script type="text/jsx">
        <Layout>
          [@cms.area name="main"/]
        </Layout>
      </script>
    </div>
    <script src="http://localhost:3000/static/js/bundle.js"></script>
    <script src="http://localhost:3000/static/js/0.chunk.js"></script>
    <script src="http://localhost:3000/static/js/1.chunk.js"></script>
    <script src="http://localhost:3000/static/js/main.chunk.js"></script>
  </body>
</html>
```

And here is an example on how to wire up a Freemarker template with JSX code (e.g. `backend/light-modules/react-demo/templates/components/Image.ftl`):

```jsx
[#assign image = damfn.getAsset(content.image)]
[#assign imageLink = image.link]
<Image
  url="${imageLink}"
  alt="${content.caption!'image'}"
  rounded={${(content.rounded!false)?c}}
/>
```

The corresponding React component looks like this (e.g. `frontend/src/components/Image.js`):

```jsx
import React from "react";

export default Image({ url, alt, rounded })(
  <figure>
    <img className={rounded ? "is-rounded" : ""} src={url} alt={alt} />
  </figure>
);
```
