# JSDoc-CodeSnippet for JSDoc 3

Replace placeholder in your text with named code snippets

## Installation & configuration

The simplest way to install *JSDoc-CodeSnippet* is probably by using **NPM**:
```shell
npm install --save-dev jsdoc-codesnippet
```
Why `--save-dev`? Well, to add it in your `package.json` file, and documenting things should be done only on test/dev environments, not production...


Once installed, you can add the plugin to your [JSDoc configuration file](http://usejsdoc.org/about-configuring-jsdoc.html):
```json
{
    "plugins": ["node_modules/jsdoc-codesnippet"]
}
```

*TODO: install globally?*

## Example usage

In your source code, use the `@snippetStart` & `@snippetEnd` doclets to mark the beginning and the end of your snippets:

```javascript
/**
 * @snippetStart foo
 */
function foo(){
  return bar;
}
/**
 * @snippetEnd foo
 */
```
Then, in your docblocks, use the doclet `@snippet` to reference it:
```javascript
/**
 * @description Returned by foo: {@snippet foo}
 */
function bar(){
}
```
Code between the `@snippetStart foo` and `@snippetEnd foo` will be copied in a `<pre>` tag at the position of your `@snippet foo`. Also, every occurence of the snippet name (IE `foo` here) will be printed in red to be clearly visible.
