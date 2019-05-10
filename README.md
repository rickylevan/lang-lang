# Lang-Lang

This is my first programming language, in the style of high-level assembly. I think it is pleasant to have each line begin with some atomic instruction about what the computer is doing. 😄

Lang-Lang is implemented in JavaScript, which of course means all of the advantages of working inside of the browser.

**Here are some notable features of the language thus far:**

* Hard `mov` semantics even with primitive types. `mov a b` means the name `a` is no longer accessible on the global scope.

* No braces or indentation. A `loop`, for example, closes out with a `pool`. An `if` with a `fi`. This makes the execution model very simple and fun. A `loop` does not know a priori when it will find its matching `pool`.

* Special `%n` syntax for referring to loop indices.

* Initial direct addressing layers deep. You can `cp true x.y.z` without first needing to initialize `x` as an object then initialize `y` on `x` as an object.

* The Map as the universal data structure. JavaScript flexibly interprets number keys into strings, and we do the same thing here. Assuming no CPU bottleneck for the app, it is nice to have one universal structure. We, indexing by 1, represent `[10, 20, 30]` as `{1: 10, 2: 20, 3: 30}`.

* Address substitutions. You can `cp 1 snk./%1/.x`. Since `%1` is between the `/` signs, it gets interpreted in scope. So this code copies `1` to the `x` field of whatever snake item we are currently looping over.

* General assembly character. There is something that just feels good about each line beginning with its operation. Everyone knows what `b = a` means, but it's still intriguing to `mov a b`


**Here are some notable features that are missing right now:**

* Scope other than the global scope. In particular, scoped functions to pass input and receive output.

* Strings. Right now there are implicit strings as the keys of the JavaScript objects, but the only primitive types are JavaScript's `boolean` and `number.`

* Type constraints that keep the high-level assembly flavor of the language. One idea that could be cool is to have a template system like `tt snk.*i*.x :: number`, and `tt snk.*i*.y :: number`, where the `*i*` is a wildcard catch-all. With a `development_mode` turned on, we can intercept any writes to the `x` and `y` fields of a snake segment and verify that they are both type number.

* Expressions. These are super convenient, but I might just not implement them. No expressions means that source lines are more isomorphic to actual computer actions, not using "under the hood" invisible instructions to manipulate the expression. No expressions gives a very crisp high-level assembly feel to the language.