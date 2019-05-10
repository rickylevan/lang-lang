# Lang-Lang

This is my first programming language, in the style of high-level assembly. I think it is pleasant to have each line begin with some atomic instruction about what the computer is doing.

Lang-Lang is implemented in JavaScript, which of course means all of the advantages of working inside of the browser.

**Here are some notable features of the language thus far:**

* Hard `mov` semantics even with primitive types. `mov a b` means the name `a` is no longer accessible on the global scope.

* No braces or indentation. A `loop`, for example, closes out with a `pool`. An `if` with a `fi`. This makes the execution model very simple and fun. A `loop` does not know a priori when it will find its matching `pool`.

* Special `%n` syntax for referring to loop indices.

* General assembly character. There is something that just feels good about each line beginning with its operation. Everyone knows what `b = a` means, but it's still intriguing to `mov a b`


**Here are some notable features that are missing right now:**

* Scope other than the global scope

* Scoped functions to pass input and receive output

* Expressions. These are super convenient, but I might just not implement them. No expressions means that source lines are more isomorphic to actual computer actions, not using "under the hood" invisible instructions to manipulate the expression. No expressions gives a very crisp high-level assembly feel to the language.