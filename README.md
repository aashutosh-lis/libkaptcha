# libkaptcha

Boilerplate code for the Captcha react component library.

Reference: [How to build a React component library](https://www.airplane.dev/blog/how-to-build-a-react-component-library)

## Usage:
```js
import { KaptchaCard } from "@aashutosh-lis/libkaptcha";

function App() {
  return (
    <div className="App">
      <KaptchaCard title="Yaayy! Working!!"/>
    </div>
  );
}

export default App;
```

### Building
The library can be built using `npm build`. Once built, the built artifacts are present in the `dist` directory.

To use the library locally without publishing, run `npm link` in the library's root directory. Then run `npm link <library_name>` in the project where you want to use the library.
