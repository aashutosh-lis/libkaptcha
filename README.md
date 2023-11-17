# libkaptcha

Boilerplate code for the Captcha react component library.

Reference: [How to build a React component library](https://www.airplane.dev/blog/how-to-build-a-react-component-library)

## Usage:
```js
import { KaptchaCard } from "@aashutosh-lis/libkaptcha";
import "@aashutosh-lis/libkaptcha/dist/style.css"  // to use library css

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
The library can be built using `npm run build`. Once built, the built artifacts are present in the `dist` directory.

To use the library locally , we publish it to the local yalc store using  `npx yalc publish` in the library's root directory. 

Then run `npx yalc add <library_name>` in the project where you want to use the library.
