export default function renderIndexHtml(backendUrl, initialState, html = '') {

  const initialStateString = initialState ? `INITIAL_STATE: ${JSON.stringify(initialState)}` : '';

  return `
<!DOCTYPE html>
<html>
  <head lang="en">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nils Hartmann</title>
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <link href='https://fonts.googleapis.com/css?family=Lora:400,700,400italic,700italic|PT+Sans:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
    <link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css' rel='stylesheet' type='text/css'>
    <link href='/_dist/styles.css' rel='stylesheet' type='text/css'>
  </head>

  <body>
    <div id='mount'>${html}</div>
  </body>

  <script type="text/javascript">
    __simpleBlog_env = {
      BACKEND_URL: '${backendUrl}',
      ${initialStateString}
    };
  </script>

  <!-- dist/main.js will be created by Webpack -->
  <script type="text/javascript"
          src="/_dist/main.js">
  </script>
</html>`;

}
