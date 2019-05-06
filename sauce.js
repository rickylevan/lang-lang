// define our lang-lang source file and export as "sauce"

const sauce = `

route ArrowLeft leftHandle
route ArrowRight rightHandle
route ArrowUp upHandle
route ArrowDown downHandle

route ~blink~ blinkHandle

loop 1 3

mov 3 k
sub %1 k k
add 1 k k
mov k snk./%1/.x
mov 1 snk./%1/.y

pool

mov 180 grey
black
loop 1 3
  draw grey snk./%1/.x snk./%1/.y
pool

mov 1 state


stop


mov 1 state :: rightHandle
stop

mov 2 state :: leftHandle
stop

mov 3 state :: upHandle
stop

mov 4 state :: downHandle
stop

// :: blinkHandle

cp snk.1.x x
cp snk.1.y y

if state == 1
  add 1 x x
fi
if state == 2
  sub 1 x x
fi
if state == 3
  add 1 y y
fi
if state == 4
  sub 1 y y
fi

mov 2 var1
mov 3 var2
mov snk./var1/ snk./var2/

mov 1 var1
mov 2 var2
mov snk./var1/ snk./var2/

mov x snk.head.x
mov y snk.head.y
mov snk.head snk.1

black
loop 1 3
  draw grey snk./%1/.x snk./%1/.y
pool

stop

`
	
		
console.log(`The sauce:`);
console.log(sauce);